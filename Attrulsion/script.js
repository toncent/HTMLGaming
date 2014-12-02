window.addEventListener("DOMContentLoaded", init);
window.onkeydown = function(e){
  keyDownHandler(e);
};

//--------Classes--------//

function Circle(x,y,size){
	this.x = x;
	this.y = y;
	this.size = size;
	this.draw = function(){
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.arc(x,y,size,0,2*Math.PI);
		ctx.fill();
	};
}

function GraphNode(content){
	this.content = content;
	this.neighbours = null;
	this.addNeighbour = function(neighbour){
		if(this.neighbours){
			if(this.neighbours.contains(neighbour)) return false;
			this.neighbours.append(new ListNode(neighbour));
		} else {
			this.neighbours = new ListNode(neighbour);
		}
		neighbour.addNeighbour(this);
		return true;
	}
}

//--------Variables--------//
var canv;
var ctx;
var mainLoop;
var listOfObjects;
var circleSize = 10;
var numOfCircles = 5;
var numOfConnections = 5;

//--------INIT--------//
function init(){
	canv = document.getElementById("mainCanv");
	ctx = canv.getContext("2d");
	listOfObjects = new LinkedList();
	createRandomCircles(numOfCircles);
	createRandomConnections(numOfConnections);
	mainLoop = window.setInterval(update,16);
}

function update(){
	//Draw Background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canv.width,canv.height);
	//Draw Objects
	drawCircles();
	drawConnections();
	updateCirclePositions();
}

function drawCircles(){
	current = headObj;
	while(current) {
		current.content.content.draw();
		current = current.next;
	}
}

function updateCirclePositions(){

}

function createRandomCircles(num){
	var x,y;
	for (var i = 0; i < num; i++) {
		x = Math.floor(circleSize+Math.random()*(canv.width-2*circleSize));
		y = Math.floor(circleSize+Math.random()*(canv.height-2*circleSize));
		if (!headObj) {
			headObj = new ListNode(new GraphNode(new Circle(x,y,circleSize)));
		} else {
			headObj.append(new ListNode(new GraphNode(new Circle(x,y,circleSize))));
		}
	};
}

function createRandomConnections(num){
	var n,m,success=false;
	for (var i = 0; i < num; i++) {
		n = Math.floor(Math.random()*numOfCircles);
		m = Math.floor(Math.random()*numOfCircles);
		while(m==n){
			m = Math.floor(Math.random()*numOfCircles);
		};
		while(!success){
			success = headObj.get(n).content.addNeighbour(headObj.get(m).content);
		}
	};
}