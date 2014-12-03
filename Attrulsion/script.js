window.addEventListener("DOMContentLoaded", init);

//--------Classes--------//

function Circle(x,y,size){
	this.x = x;
	this.y = y;
	this.size = size;
	this.draw = function(){
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.arc(this.x,this.y,size,0,2*Math.PI);
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

//--------Constants--------//
var circleSize = 10;
var numOfCircles = 2;
var numOfConnections = 1;
var repulsiveForce = 0.01;

//--------functions--------//
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
		console.log("x "+listOfObjects.get(i).content.x+"    y "+listOfObjects.get(i).content.x)
		listOfObjects.get(i).content.draw();
	};
}

function updateCirclePositions(){
	var forces = [];
	var node1,node2,distance,vectors,tempVector;
	//calculate forces that pull on each node as 2d vectors
	for (var i = 0; i < listOfObjects.size; i++) {
		node1 = listOfObjects.get(i);
		vectors = [];
		for (var j = 0; j < listOfObjects.size; j++) { //all nodes repel each other with force 1/distance^2
			if(i==j) continue;
			node2 = listOfObjects.get(j);
			distance = calculateDistance(node1.content.x,node1.content.y,node2.content.x,node2.content.y);
			tempVector = [node1.content.x-node2.content.x , node1.content.y-node2.content.y];
			tempVector = normVector(tempVector);
			tempVector = [repulsiveForce/(tempVector[0]*tempVector[0]) , repulsiveForce/(tempVector[1]*tempVector[1])];
			vectors.push(tempVector);
		};
		forces[i] = addVectors(vectors);
	};
	for (var i = 0; i < listOfObjects.size; i++) {
		listOfObjects.get(i).content.x += forces[i][0];
		listOfObjects.get(i).content.y += forces[i][1];
	};
}

function calculateDistance(x1,y1,x2,y2){
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function addVectors(vectors){
	result = [0,0];
	for (var i = 0; i < vectors.length; i++) {
		result[0]+=vectors[i][0];
		result[1]+=vectors[i][1];
	};
	return result;
}

function normVector(vector){
	var result = [];
	var length = calculateDistance(0,0,vector[0],vector[1]);
	result[0] = vector[0]/length;
	result[1] = vector[1]/length;
	return result;
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