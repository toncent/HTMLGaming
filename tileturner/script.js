var activePanel = 0,
	panelRotations = [],
	rowCount = 3,
	colCount = 5,
	imgPath = './images/test.jpg';


function init() {
	var gameDiv = document.getElementById("gameDiv");
	for(var j=0; j<rowCount; j++) {
		for (var i = 0; i < colCount; i++) {
			gameDiv.innerHTML += "<div class='img-container' style='top:"+(10+j*200)+"px; left:"+(10+i*200)+"px;'><img src='" + imgPath + "' style='top:" + -1*j*(600/rowCount) + "px; left:" + -1*i*(1000/colCount) + "px;'></div>"
		};
	}
	for(var j=0; j<colCount; j++) {
		panelRotations.push([]);
		for (var i = 0; i < rowCount; i++) {
			panelRotations[panelRotations.length - 1].push(0);
		};
	}
	window.addEventListener("keydown", function(e) {
		keyDownHandler(e.keyCode);
	});
	document.getElementById("startButton").addEventListener("click", scramble);
	updateGlow(0);
}

function keyDownHandler(key) {
	if (key == 32) {
		rotatePanel();
	} else	if (key == 37) {
		if (activePanel>0) {
			updateGlow(-1);
			activePanel--;
		}
	} else if (key == 39) {
		if (activePanel<(colCount*rowCount)-1) {
			updateGlow(1);
			activePanel++;
		}
	} else if (key == 38) {
		if(activePanel>=colCount){
			updateGlow(-1*colCount);
			activePanel -= colCount;
		}
	} else if (key == 40) {
		if (activePanel<(rowCount*colCount)-colCount) {
			updateGlow(colCount);
			activePanel+= colCount;
		};
	};
}

function updateGlow(change){
	document.getElementsByClassName("img-container")[activePanel].style.boxShadow = "none";
	document.getElementsByClassName("img-container")[activePanel].style.webkitBoxShadow = "none";
	document.getElementsByClassName("img-container")[activePanel].style.zIndex = "0";
	document.getElementsByClassName("img-container")[activePanel+change].style.boxShadow = "0 0 30px yellow";
	document.getElementsByClassName("img-container")[activePanel+change].style.webkitBoxShadow = "0 0 30px yellow";
	document.getElementsByClassName("img-container")[activePanel+change].style.zIndex = "1";
}

function rotatePanel() {
	var currentRow = getRow(activePanel);
	var currentCol = getColumn(activePanel);

	panelRotations[currentCol][currentRow] += 90;
	document.getElementsByClassName("img-container")[activePanel].style.transform = "rotate("+ panelRotations[currentCol][currentRow] +"deg)";
	document.getElementsByClassName("img-container")[activePanel].style.webkitTransform = "rotate("+ panelRotations[currentCol][currentRow] +"deg)";	
}

function scramble() {
	var containers = document.getElementsByClassName("img-container"),
		rotation;
	for (var i = containers.length - 1; i >= 0; i--) {
		rotation = 720+90*Math.round(Math.random()*2+1);
		containers[i].style.transform = "rotate("+rotation+"deg)";
		containers[i].style.webkitTransform = "rotate("+rotation+"deg)";
		panelRotations[getColumn(i)][getRow(i)] = rotation;
	};
}

function getColumn(num) {
	return num%colCount;
}

function getRow(num) {
	return Math.floor(num/colCount);
}