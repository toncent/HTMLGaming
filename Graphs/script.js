window.addEventListener("DOMContentLoaded", init);

//--------Constants--------//
var circleSize = 10;
var repulsiveForce = 1000;
var attractiveForce = 0.00001;
var attractionToCenter = 0.1;

//--------Variables--------//
var canv;
var ctx;
var mainLoop;
var listOfNodes;
var speedupFactor;
var numOfCircles = 10;
var numOfConnections = 12;
var a;
var draggedCircle = null;
var dragging = false;

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

//--------functions--------//
window.onkeydown = function(e){
  keyDownHandler(e);
};

function init(){
	document.getElementById("speedSlider").onchange = function(){
		document.getElementById("sliderLabel").innerHTML = document.getElementById("speedSlider").value;
		speedupFactor = document.getElementById("speedSlider").value;
	};
	document.getElementById("redoGraph").onclick = function(){
		numOfCircles = document.getElementById("numOfNodes").value;
		numOfConnections = document.getElementById("numOfEdges").value;
		reinit();
	};
	document.getElementById("mainCanv").onclick = function(e){
		canvClickHandler(e);
	};
	document.getElementById("mainCanv").onmousemove = function(e){
		canvMouseMoveHandler(e);
	};
	document.getElementById("mainCanv").onmousedown = function(e){
		canvMouseDownHandler(e);
	}
	document.getElementById("numOfNodes").onblur = function(){
		if(this.value == "") this.value ="10";
	};
	document.getElementById("numOfEdges").onblur = function(){
		if(this.value == "") this.value ="12";
		if(this.value > (numOfCircles*(numOfCircles-1))/2) this.value = (numOfCircles*(numOfCircles-1))/2;
	};

	canv = document.getElementById("mainCanv");
	ctx = canv.getContext("2d");
	speedupFactor = 1;
	reinit();
}

function reinit(){
	if(mainLoop){
		window.clearInterval(mainLoop);
	}
	listOfNodes = new LinkedList();
	createRandomCircles(numOfCircles);
	createRandomConnections(numOfConnections);
	mainLoop = window.setInterval(update,0);
}

function keyDownHandler(key){
	// console.log(key.keyCode);
	if(key.keyCode == 32){
		if(attractionToCenter == 0){
			attractionToCenter = 0.1
		} else {
			attractionToCenter = 0;
		}
	};
	
	if (key.keyCode == 38) {
		speedupFactor++;
	};

	if (key.keyCode == 40) {
		if(speedupFactor>1) speedupFactor--;
	};
}

function update(){
	//Draw Background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canv.width,canv.height);
	//Draw Objects
	drawCircles();
	drawConnections();
	drawText();
	if(!dragging) updateCirclePositions();
}

function drawCircles(){
	for (var i = 0; i < listOfNodes.size; i++) {
		listOfNodes.get(i).content.draw();
	};
}

function drawText(){
	ctx.fillStyle = "#FFFFFF";
	ctx.font="20px Arial";
	if(!dragging){
		ctx.fillText("Speed: "+speedupFactor,20,30);
	} else {
		ctx.fillText("Speed: Paused",20,30);
	}
}

function updateCirclePositions(){
	var forces;
	var node1,node2,distance,vectors,tempVector;
	for (var n = 0; n < speedupFactor; n++) {
		forces = [];
		//calculate forces that pull on each node as 2d vectors
		for (var i = 0; i < listOfNodes.size; i++) {
			node1 = listOfNodes.get(i);
			vectors = [];
			tempVector = [canv.width/2-node1.content.x , canv.height/2-node1.content.y];
			tempVector = normVector(tempVector);
			tempVector = [attractionToCenter*tempVector[0] , attractionToCenter*tempVector[1]];
			vectors.push(tempVector);
			for (var j = 0; j < listOfNodes.size; j++) { //all nodes repel each other with force repulsiveForce/distance^2
				if(i==j) continue;
				node2 = listOfNodes.get(j);
				distance = calculateDistance(node1.content.x,node1.content.y,node2.content.x,node2.content.y);
				tempVector = [node1.content.x-node2.content.x , node1.content.y-node2.content.y];
				tempVector = normVector(tempVector);
				tempVector = [(repulsiveForce/(distance*distance))*tempVector[0] , (repulsiveForce/(distance*distance))*tempVector[1]];
				vectors.push(tempVector);
				if(node1.neighbours.contains(node2)){  //nodes that are connected attract each other with force attractiveForce*distance^2
					tempVector = normVector(tempVector);
					tempVector = [-1*attractiveForce*distance*distance*tempVector[0] , -1*attractiveForce*distance*distance*tempVector[1]];
					vectors.push(tempVector);
				} 
			};
			forces[i] = addVectors(vectors);
		};
		for (var i = 0; i < listOfNodes.size; i++) {
			node1 = listOfNodes.get(i); 
			node1.content.x += forces[i][0];
			node1.content.y += forces[i][1];
			
			if(node1.content.x > canv.width - circleSize){
				node1.content.x = canv.width - circleSize;
			} else if (node1.content.x < circleSize){
				node1.content.x = circleSize;
			}

			if(node1.content.y > canv.height - circleSize){
				node1.content.y = canv.height - circleSize;
			} else if (node1.content.y < circleSize){
				node1.content.y = circleSize;
			}

		};
	}
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
	var currentNode,c1,c2;
	ctx.strokeStyle = "#FF0000";
	for (var i = 0; i < numOfCircles; i++) {
		currentNode = listOfNodes.get(i);
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
		listOfNodes.append(new GraphNode(new Circle(x,y,circleSize)));
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
			success = listOfNodes.get(n).addNeighbour(listOfNodes.get(m));
		}
	};
}

function canvClickHandler(event){
	if(!dragging){
		var x = event.pageX - event.target.offsetLeft;
		var y = event.pageY - event.target.offsetTop;
		var c = new Circle(x,y,circleSize);
		listOfNodes.append(new GraphNode(c));
		numOfCircles++;
	} else {
		dragging = false;
	}
}

function canvMouseDownHandler(event){
	draggedCircle = circleNear(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop);
	dragging = draggedCircle != null;
	if(dragging){
		draggedCircle.x = event.pageX - event.target.offsetLeft;
		draggedCircle.y = event.pageY - event.target.offsetTop;
	}
}

function canvMouseMoveHandler(event){
	if(dragging){
		draggedCircle.x = event.pageX - event.target.offsetLeft;
		draggedCircle.y = event.pageY - event.target.offsetTop;
	}
}

function circleNear(x,y){
	var c;
	for (var i = 0; i < numOfCircles; i++) {
		currentNode = listOfNodes.get(i);
		c = currentNode.content;
		if(calculateDistance(x,y,c.x,c.y)<circleSize){
			return c;
		}
		
	};
	return null;
}