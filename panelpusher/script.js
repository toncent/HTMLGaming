var emptySquare = 0;
	panelPositions = [],
	panelArrayPosition = [], //maps the number returned by getNumberOfPanel to an index of the panelPositions array
	rowCount = 3,
	colCount = 5,
	scrambling = false,
	scrambledAtLeastOnce = false,
	scrambleTimes = 0,
	scrambleInterval = null,
	imgPath = './images/test.jpg';

var animationFrameNumber = 0,
	panels = null,
	animationInterval = null;


function init() {
	var gameDiv = document.getElementById("gameDiv");
	document.getElementsByClassName("solution-wrapper")[0].style.backgroundImage = "url("+imgPath+")";
	for(var j=0; j<rowCount; j++) {
		for (var i = 0; i < colCount; i++) {
			if(!(j==rowCount-1 && i==colCount-1)){
				gameDiv.innerHTML += "<div class='img-container'><img src='" + imgPath + 
									 "' style='transform:translate(" + -1*i*(1000/colCount) + "px," + -1*j*(600/rowCount) + "px)'></div>";
				panelPositions.push([0,0]);
				panelArrayPosition.push(getNumberOfPanel(i,j));
			}
		};
	}
	emptySquare = getNumberOfPanel(colCount-1,rowCount-1);
	panelArrayPosition.push(-1);
	window.addEventListener("keydown", function(e) {
		keyDownHandler(e.keyCode);
	});
	document.getElementById("startButton").addEventListener("click", scramble);
	document.getElementById("solutionButton").onmouseover = function() {showSolution()};
	document.getElementById("solutionButton").onmouseout = function() {hideSolution()};
}

function keyDownHandler(key) {
	if (key == 37) {
		movePanel(-1,0);
	} else if (key == 39) {
		movePanel(1,0);
	} else if (key == 38) {
		movePanel(0,-1);
	} else if (key == 40) {
		movePanel(0,1);
	};
}

function movePanel(dirX, dirY){ //down and right are 1, up and left are -1
	var currentRow = getRow(emptySquare)-dirY;
	var currentCol = getColumn(emptySquare)-dirX;
	var prevSquareNumber = getNumberOfPanel(currentCol,currentRow);
	var newSquareNumber = emptySquare;
	if((dirY == 1 && currentRow >= 0)||
	   (dirY == -1 && currentRow < rowCount)||
	   (dirX == 1 && currentCol >= 0)||
	   (dirX == -1 && currentCol < colCount)){

		movingPanel = getPanelAt(currentCol, currentRow);
		emptySquare = prevSquareNumber;
		panelPositions[panelArrayPosition[prevSquareNumber]][0] += dirX*(1000/colCount);
		panelPositions[panelArrayPosition[prevSquareNumber]][1] += dirY*(600/rowCount);
		movingPanel.style.transform = 'translate('+ panelPositions[panelArrayPosition[prevSquareNumber]][0] + 'px,'+
									  			    panelPositions[panelArrayPosition[prevSquareNumber]][1] + 'px)';
		panelArrayPosition[newSquareNumber] = panelArrayPosition[prevSquareNumber];
		panelArrayPosition[prevSquareNumber] = -1;
		if(isPuzzleSolved()) {
			console.log("1")
			declareVictory();
		}
	}
}

function scramble() {
	if(scrambling){
		return;
	}
	scrambling = true;
	scrambleInterval = window.setInterval("scrambleHelper()",300);
}

function scrambleHelper(){
	if(scrambleTimes == 4) {
		window.clearInterval(scrambleInterval);
		scrambleTimes = 0;
		scrambling = false;
		scrambledAtLeastOnce = true;
		return;
	}
	var r;
	for (var i = 0; i < 1000; i++) {
		r = Math.round(Math.random()*400);
		if(r<100) movePanel(-1,0);
		if(r>=100 && r<200) movePanel(1,0);
		if(r>=200 && r<300) movePanel(0,-1);
		if(r>=300) movePanel(0,1);
	};
	scrambleTimes++;
}

function isPuzzleSolved(){
	if(!scrambling && scrambledAtLeastOnce){
		for (var i = 0; i < panelArrayPosition.length-1; i++) {
			if(panelArrayPosition[i] != i) return false;
		};
		return true;
	}
	return false;
}

function declareVictory(){
	panels = document.getElementsByClassName("img-container");
	for (var i = panels.length - 1; i >= 0; i--) {
		panels[i].className = "img-container-finish"
	}
	panels = document.getElementsByClassName("img-container-finish");
	animationFrameNumber = panels.length - 1;
	animationInterval = window.setInterval("animateFinish()",100);
}

function animateFinish(){
	if(animationFrameNumber == -1){
		window.clearInterval(animationInterval);
		return;
	}
	panels[animationFrameNumber].style.transform = "translate(0px,650px)";
	animationFrameNumber--;
}

function getPanelAt(x,y){
	return document.getElementsByClassName("img-container")[panelArrayPosition[getNumberOfPanel(x,y)]];
}

function getNumberOfPanel(x,y){
	return y*colCount+x;
}

function setPosition(panel, x, y){
	var pxX = (600/rowCount);
	var pxY = (1000/colCount);
	panel.style.transform = 'translate('+pxX+'px,'+pxY+'px)';
}

function showSolution() {
	document.getElementsByClassName("solution-wrapper")[0].style.display = "block";
}

function hideSolution() {
	document.getElementsByClassName("solution-wrapper")[0].style.display = "none";
}

function getColumn(num) {
	return num%colCount;
}

function getRow(num) {
	return Math.floor(num/colCount);
}