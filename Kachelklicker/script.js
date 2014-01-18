//Features TODO: verschiedene kachelzahl, highscores, timer, menü, musik/sounds, die stimme? 
var lowestTile = 1;
var randomListOfTiles = [];
var gameDone = 0;
var lastTile;
var mode;
var className;
var startTime;
var gameVisible = 0;
var highscores = [[],[],[],[],[]];
var timePassed = 0;
var timerFunction, animationFunction;
var className;
var initialState = "<div class='tile three'></div><div class='tile three'></div><div class='tile three'></div> <div class='tile three'></div> <div class='tile three'></div> <div class='tile three'></div> <div class='tile three'></div> <div class='tile three'></div> <div class='tile three'></div>"

document.addEventListener('DOMContentLoaded', init);

function init(){
	document.getElementsByClassName("tile")[0].addEventListener("click", function(){
		setBasicVariables(4, "two");
		createInitialState();
	});
	document.getElementsByClassName("tile")[1].addEventListener("click", function(){
		setBasicVariables(9, "three");
		createInitialState();
	});
	document.getElementsByClassName("tile")[2].addEventListener("click", function(){
		setBasicVariables(16, "four");
		createInitialState();
	});
	document.getElementsByClassName("tile")[3].addEventListener("click", function(){
		setBasicVariables(25, "five");
		createInitialState();
	});
	document.getElementsByClassName("tile")[4].addEventListener("click", function(){
		setBasicVariables(36, "six");
		createInitialState();
	});
	document.getElementsByClassName("button")[0].addEventListener("click", function(){
		resetGame();
	});
	document.getElementsByClassName("button")[1].addEventListener("click",function(){
		backToMenu();
		document.getElementsByClassName("highscore-section")[0].style.display = "none";
	});
	document.getElementsByClassName("button")[2].addEventListener("click",function(){
		initalizeCookie();
		initHighscores();
	});

	window.addEventListener("keydown", function(e){
			if(e.keyCode == 32 && gameDone == 1){
				document.getElementsByClassName("overlay")[0].style.display = "none";
				document.getElementsByClassName("overlay_inner")[0].style.display = "none";
				initGame();
			}
	});
}

function resetGame(){
	window.clearInterval(timerFunction);
	document.getElementsByClassName("overlay")[0].style.display = "block";
	document.getElementsByClassName("timer")[0].innerHTML = "0";
	createInitialState();
}

function backToMenu(){
	window.clearInterval(timerFunction);
	listOfTiles = [];
	randomListOfTiles = [];
	lowestTile = 1;
	document.getElementsByClassName("grid")[0].style.display = "none";
	document.getElementsByClassName("timer")[0].innerHTML = "0";
	document.getElementsByClassName("highscore-section")[0].style.display = "none";
	document.getElementsByClassName("menu-section")[0].style.display = "none";
	document.getElementsByClassName("overlay")[0].style.display = "none";
	document.getElementsByClassName("main_menu")[0].style.display = "block";
}

function setBasicVariables(tiles, newClassName){
	lastTile = tiles;
	className = newClassName;
	mode = Math.sqrt(tiles);
}

function createInitialState(){
	string = "";
	for (var i = 1; i <= lastTile; i++) {
		string += "<div class='tile "+className+"'></div>"
	};
	initialState = string;
	lowestTile = 1;
	document.getElementsByClassName("main_menu")[0].style.display = "none";
	document.getElementsByClassName("grid")[0].innerHTML = initialState;
	document.getElementsByClassName("grid")[0].style.display = "block";
	document.getElementsByClassName("overlay")[0].style.display = "block";
	document.getElementsByClassName("overlay_inner")[0].style.display = "block";
	document.getElementsByClassName("menu-section")[0].style.display = "block";
	gameDone = 1;
	initHighscores();
}

function initalizeCookie(){
	document.cookie = "highscore"+mode+"=99.999,99.999,99.999,99.999,99.999;expires=Wed, 01-Jul-2015 00:00:01 GMT;"
}

function getCookie(name){
	cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		if (cookies[i].trim().indexOf(name) == 0){
			cookieValue = cookies[i].split("=")[1];
			valueArray = cookieValue.split(",");
			for (var i = 0; i < valueArray.length; i++) {
				valueArray[i] = parseFloat(valueArray[i]);
			};
			return valueArray;
		}
	};
	return -1;
}

function setCookie(){
	string = "";
	string += "highscore"+mode+"="+highscores[mode-2][0];
	for (var i = 1; i < 5; i++) {
		string +=","+highscores[mode-2][i];
	}
	string += ";expires=Wed, 01-Jul-2015 00:00:01 GMT;"
	document.cookie = string;
}

function initGame(){
	var	listOfTiles = [];
	var randomListOfTiles = [];
	newTiles = "";
	for(var i=1; i<=lastTile; i++){
		listOfTiles.push(i);
	}
	for(var i=1; i<=lastTile; i++){
		rnd = Math.round(Math.random()*(listOfTiles.length-1));
		randomListOfTiles.push(listOfTiles[rnd]);
		listOfTiles = listOfTiles.slice(0,rnd).concat(listOfTiles.slice(rnd+1,listOfTiles.legth));
	}
	for (var i = 0; i < lastTile; i++) {
		newTiles+="<div class='tile "+className+"' id='"+randomListOfTiles[i]+"'>"+randomListOfTiles[i]+"</div>"
	};
	document.getElementsByClassName("grid")[0].innerHTML = newTiles;
	var currentTile;
	for (var t = 1; t <=lastTile; t++){
	    currentTile = document.getElementById(t);
	    if (typeof window.addEventListener === 'function'){
	        (function (_currentTile) {
	            _currentTile.addEventListener('mousedown', function(){
	                if(this.id == lowestTile){
	                	lowestTile++;
	                	this.style.background = "transparent";
	                	this.innerHTML = "";
	                	if(this.id == lastTile){
	                		gameDone = 1;
	                		checkHighscores();
	                		document.getElementsByClassName("grid")[0].innerHTML = initialState;
	                		document.getElementsByClassName("overlay")[0].style.display = "block";
							document.getElementsByClassName("overlay_inner")[0].style.display = "block";
	                		lowestTile = 1;
	                		randomListOfTiles = [];
	                	}
	                }
	            });
	        })(currentTile);
	    }
	}
	startTimer();
}

function startTimer(){
	gameDone = 0;
	startTime = new Date().getTime();
	timerFunction = window.setInterval("timerStuff()",10);
}

function timerStuff(){
	if (gameDone == 1) {
		window.clearInterval(timerFunction);
	} else {
		timePassed = new Date().getTime() - startTime;
		document.getElementById("timer").innerHTML = Math.round(timePassed/10)/100;
	} ;
}

function initHighscores(){
	hs = getCookie("highscore"+mode);
	if (hs != -1) {
		highscores[mode-2] = hs;
	} else {
		initalizeCookie(mode);
		highscores[mode-2] = [99.99,99.99,99.99,99.99,99.99];
	};
	for (var i = 0; i < highscores[mode-2].length; i++) {
		document.getElementsByClassName("highscore")[i].innerHTML = highscores[mode-2][i]
	};
	document.getElementsByClassName("highscore-section")[0].style.display = "block";
}

function checkHighscores(){
	changed = -1;
	timePassed = timePassed/1000
	for (var i = 0; i < highscores[mode-2].length; i++) {
		if(highscores[mode-2][i] > timePassed){
			if (changed == -1) changed = i;
			temp = highscores[mode-2][i];
			highscores[mode-2][i] = timePassed;
			timePassed = temp;
			document.getElementsByClassName("highscore")[i].innerHTML = highscores[mode-2][i];
		}
	};
	if (changed != -1) {
		setCookie()
		highscoreAnimation(changed);
	}
}

function highscoreAnimation(index){
	color = 0xFFFFFF;
	elem = document.getElementsByClassName("highscore")[index];
	animationFunction = window.setInterval("HSAnim()", 20);
}

function HSAnim(){
	elem.style.backgroundColor = "#"+color.toString(16);
	if(color <= 0xAAAAAA) {
		window.clearInterval(animationFunction);
	} else {
		color -= 0x020202;
	}
}