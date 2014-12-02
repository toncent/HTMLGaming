window.addEventListener("DOMContentLoaded", init);

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
	this.neighbours = new LinkedList();
	this.addNeighbour = function(neighbour){
		if(this.neighbours.contains(neighbour)) return false;
		this.neighbours.append(neighbour);
		neighbour.neighbours.append(this);
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
	for (var i = 0; i < listOfObjects.size; i++) {
		listOfObjects.get(i).content.draw();
	};
}

function updateCirclePositions(){

}

function drawConnections(){
	var currentNode,circle1,circle2;
	ctx.strokeStyle = "#FFFF00";
	for (var i = 0; i < numOfCircles; i++) {
		currentNode = listOfObjects.get(i);
		c1 = currentNode.content;
		for(var j = 0; j<currentNode.neighbours.size;j++){
			c2 = currentNode.neighbours.get(j).content;
			ctx.beginPath();
			ctx.moveTo(c1.x,c1.y);
			ctx.lineTo(c2.x,c2.y);
			ctx.stroke();
		}
	};
}

function createRandomCircles(num){
	var x,y;
	for (var i = 0; i < num; i++) {
		x = Math.floor(circleSize+Math.random()*(canv.width-2*circleSize));
		y = Math.floor(circleSize+Math.random()*(canv.height-2*circleSize));
		listOfObjects.append(new GraphNode(new Circle(x,y,circleSize)));
	};
}

function createRandomConnections(num){
	var n,m,success;
	for (var i = 0; i < num; i++) {
		success = false;
		while(!success){
			n = Math.floor(Math.random()*numOfCircles);
			m = Math.floor(Math.random()*numOfCircles);
			while(m==n){
				m = Math.floor(Math.random()*numOfCircles);
			};
			success = listOfObjects.get(n).addNeighbour(listOfObjects.get(m));
		}
	};
}