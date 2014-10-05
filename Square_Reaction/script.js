window.addEventListener("DOMContentLoaded", init);
window.onkeydown = function(e){
  keyDownHandler(e);
};

/*
Ideas
  - more than one gap in each wall
  - detectCollisions could return the coordinates of a collision to make an animation there

*/


/*--------- variables ---------*/
var cont; // canvas context - 2d in this game
var width, height;
var possibleGridSizes,
    gridSize = 0; // possibleGridSizes[gridSize] returns the current size of one tile in pixels
var mainLoop; // the game loop
var mainSquare; // the player
var animationFrames = 3; // number of frames for the movement animation of the square
var timeSinceLastWall = 0,
    pauseBetweenWalls = 5000, // time between two wall spawns in milliseconds
    wallSpeed = 1.5, // amount of pixels a wall moves per frame
    activeWalls = []; //Array of walls that are currently on the field
var squareColor = "#0000AA",
    bgColor = "#FFFFFF",
    gridColor ="#000000",
    wallColor = "#AA0000";

//--------- "Classes" ---------//
function square(size, posX, posY){
  this.size = size;
  this.startingPos = [posX,posY];
  this.currentPos = [posX,posY];
  this.targetPos = [posX,posY];
  this.animationFrameX = -1;
  this.animationFrameY = -1;
}

function wall(orientation, direction, gapPos, speed){ // orientation = horizontal(0)/vertical(1), direction = left to right/top to bottom (0), right to left/bottom to top (1)
  this.gapPos = gapPos;
  this.orientation = orientation;
  this.pos = 0;
  this.direction = direction;
  this.animationState = 0; // 0 for spawning, 1 for moving
  this.animationFrame = 0; // number of frames this has been in the current animationState
  this.speed = speed;
}


//--------- functions ---------//
function init(){
  var canv = document.getElementById("main-canvas");
  height = canv.height;
  width = canv.width;
  cont = canv.getContext("2d");
  possibleGridSizes = getDenominators();
  
  if(possibleGridSizes.length > 1) gridSize = Math.round(possibleGridSizes.length/2)-1;
  else {
    console.log("höhe und breite haben zu wenige teiler über 14");
    return;
  }

  mainSquare = new square(possibleGridSizes[gridSize]-10, 0, 0);
  repaint();
  mainLoop = window.setInterval(update,16);
}

function reinit(){
  mainSquare = new square(possibleGridSizes[gridSize]-10,0,0);
  repaint();
}

function getDenominators(){
  var result = [];
  var max;
  if(width>height){
    max = height/2;
  } else {
    max = width/2;
  }
  for(var i=15;i<=max;i++){
    if(height%i == 0 && width%i==0){
      result.push(i);
    }
  }
  return result;
}

function keyDownHandler(evt){
  switch(evt.keyCode){
    case 37: //arrow left
      if (mainSquare.targetPos[0] != 0){
        mainSquare.startingPos[0] = mainSquare.currentPos[0];
        mainSquare.targetPos[0] -= 1;
        mainSquare.animationFrameX = 0;
      }
      break;

    case 38: //arrow up
      if (mainSquare.targetPos[1] != 0) {
        mainSquare.startingPos[1] = mainSquare.currentPos[1];
        mainSquare.targetPos[1] -= 1;
        mainSquare.animationFrameY = 0;
      };
      break;

    case 39: //arrow right
      if (mainSquare.targetPos[0] != width/possibleGridSizes[gridSize]-1) {
        mainSquare.startingPos[0] = mainSquare.currentPos[0];
        mainSquare.targetPos[0] += 1;
        mainSquare.animationFrameX = 0;
      };
      break;

    case 40: //arrow down
      if (mainSquare.targetPos[1] != height/possibleGridSizes[gridSize]-1) {
        mainSquare.startingPos[1] = mainSquare.currentPos[1];
        mainSquare.targetPos[1] += 1;
        mainSquare.animationFrameY = 0;
      };
      break;

    case 107: //numpad +
      if(gridSize != 0){
        gridSize--;
        reinit();
      }
      break;
      
    case 109: //numpad -
      if(gridSize != possibleGridSizes.length-1){
        gridSize++;
        reinit();
      }
      break;

    default:
      console.log(evt.keyCode);
  }
}

function update() { // the main loop function. gets called about 60 times per second i.e. every 16 ms
  timeSinceLastWall+=16;
  animateMainSquare();
  updateWalls();
  repaint();
  if(checkForCollisions()) gameOver();
}

function animateMainSquare() {
  if(mainSquare.animationFrameX != -1){
    if (mainSquare.animationFrameX == animationFrames-1) {
      mainSquare.currentPos[0] = mainSquare.targetPos[0];
      mainSquare.startingPos[0] = mainSquare.targetPos[0];
      mainSquare.animationFrameX = -1;
    } else {
      mainSquare.currentPos[0] += (mainSquare.targetPos[0] - mainSquare.startingPos[0])/animationFrames;
      mainSquare.animationFrameX++;
    }
  }

  if(mainSquare.animationFrameY != -1){
    if (mainSquare.animationFrameY == animationFrames-1) {
      mainSquare.currentPos[1] = mainSquare.targetPos[1];
      mainSquare.startingPos[1] = mainSquare.targetPos[1];
      mainSquare.animationFrameY = -1;
    } else {
      mainSquare.currentPos[1] += (mainSquare.targetPos[1] - mainSquare.startingPos[1])/animationFrames;
      mainSquare.animationFrameY++;
    }
  }
}

function updateWalls(){
  var x;
  if(timeSinceLastWall >= pauseBetweenWalls) {
    createNewWall();
    timeSinceLastWall = 0;
    pauseBetweenWalls = pauseBetweenWalls*0.95;
    if(pauseBetweenWalls<2.5) pauseBetweenWalls = 2.5;
    if(wallSpeed < 4) wallSpeed += 0.1;
  }
  for(var i=0; i<activeWalls.length; i++){
    if(activeWalls[i].animationState == 0){ // wall is in spawning animation
      if(activeWalls[i].animationFrame == 120) {
        activeWalls[i].animationState = 1;
        activeWalls[i].animationFrame = 0;
      }
    } else if(activeWalls[i].animationState == 1){ // wall is in moving animation
      activeWalls[i].pos += activeWalls[i].speed;
      if(activeWalls[i].orientation == 0){ //horizontal wall
        if(activeWalls[i].pos >= height){
          activeWalls.splice(i,1);
        }
      } else { //vertical wall
        if(activeWalls[i].pos >= width){
          activeWalls.splice(i,1);
        }
      }
    } else {
      console.log("Invalid animationState for wall " + i);
      continue;
    }
  }
}

function createNewWall(){
  var o, dir, gap; // orientation, direction and gap position
  var max;
  o = Math.round(Math.random());
  dir = Math.round(Math.random());
  if(o == 0) max = width/possibleGridSizes[gridSize];
  else max = height/possibleGridSizes[gridSize];
  gap = Math.floor(Math.random()*max);
  activeWalls.push(new wall(o,dir,gap,wallSpeed));
}

function checkForCollisions(){
  var wallPos;
  for(var i=0; i<activeWalls.length; i++){
    if(activeWalls[i].animationState == 0) continue;
    if(activeWalls[i].orientation == 0){ //horizontal wall
      if(activeWalls[i].direction == 0){
        wallPos = activeWalls[i].pos;
      } else {
        wallPos = height-activeWalls[i].pos-possibleGridSizes[gridSize];
      }
      if(mainSquare.currentPos[1]*possibleGridSizes[gridSize]+5+mainSquare.size > wallPos && mainSquare.currentPos[1]*possibleGridSizes[gridSize]+5 < wallPos+possibleGridSizes[gridSize]){
        // mainSquare could be touching the wall
        if(mainSquare.currentPos[0]*possibleGridSizes[gridSize]+5 < activeWalls[i].gapPos*possibleGridSizes[gridSize] || mainSquare.currentPos[0]*possibleGridSizes[gridSize]+5+mainSquare.size > activeWalls[i].gapPos*possibleGridSizes[gridSize]+possibleGridSizes[gridSize]){
          return true;
        }
      }
    } else { // vertical wall
      if(activeWalls[i].direction == 0){
        wallPos = activeWalls[i].pos;
      } else {
        wallPos = width-activeWalls[i].pos-possibleGridSizes[gridSize];
      }
      if(mainSquare.currentPos[0]*possibleGridSizes[gridSize]+5+mainSquare.size > wallPos && mainSquare.currentPos[0]*possibleGridSizes[gridSize]+5 < wallPos+possibleGridSizes[gridSize]){
        // mainSquare could be touching the wall
        if(mainSquare.currentPos[1]*possibleGridSizes[gridSize]+5 < activeWalls[i].gapPos*possibleGridSizes[gridSize] || mainSquare.currentPos[1]*possibleGridSizes[gridSize]+5+mainSquare.size > activeWalls[i].gapPos*possibleGridSizes[gridSize]+possibleGridSizes[gridSize]){
          return true;
        }
      }
    }
  }
  return false;
}

function gameOver(){
  window.clearInterval(mainLoop);
  alert("game over");
}

function repaint(){
  cont.fillStyle = bgColor;
  cont.fillRect(0,0,width,height);
  cont.fillStyle = squareColor;
  cont.fillRect(mainSquare.currentPos[0]*possibleGridSizes[gridSize]+5, mainSquare.currentPos[1]*possibleGridSizes[gridSize]+5, mainSquare.size, mainSquare.size);
  paintGrid(possibleGridSizes[gridSize]);
  paintWalls();
}

function paintWalls(){
  var xPos,yPos;
  cont.fillStyle = wallColor;
  for(var i=0; i<activeWalls.length; i++){
    if(activeWalls[i].animationState == 0){ // wall is in spawning animation
      var x = activeWalls[i].animationFrame;
      x = -1*(x-240)*x/14400;
      cont.globalAlpha = x; //uses a quadratic formula to make walls fade in over 2 seconds
    } else if(activeWalls[i].animationState != 1){
      console.log("Invalid animationState for wall " + i);
      continue;
    }

    /*i will hate myself later when i try to understand this part again*/
    if(activeWalls[i].orientation == 0){ //horizontal wall
      
      if(activeWalls[i].direction == 0){ // moving top to bottom
        yPos = activeWalls[i].pos;
      } else { //moving bottom to top
        yPos = height-activeWalls[i].pos-possibleGridSizes[gridSize];
      }
      cont.fillRect(0 , yPos , possibleGridSizes[gridSize]*activeWalls[i].gapPos , possibleGridSizes[gridSize]);
      cont.fillRect(possibleGridSizes[gridSize]*(activeWalls[i].gapPos+1) , yPos , possibleGridSizes[gridSize]*(width/possibleGridSizes[gridSize]-1-activeWalls[i].gapPos) , possibleGridSizes[gridSize]);
    
    } else { // vertical wall
      
      if(activeWalls[i].direction == 0){ // moving left to right
        xPos = activeWalls[i].pos;
      } else { // moving right to left
        xPos = width-activeWalls[i].pos-possibleGridSizes[gridSize];
      }
      cont.fillRect(xPos , 0 , possibleGridSizes[gridSize] , possibleGridSizes[gridSize]*activeWalls[i].gapPos);
      cont.fillRect(xPos , possibleGridSizes[gridSize]*(activeWalls[i].gapPos+1) , possibleGridSizes[gridSize] , possibleGridSizes[gridSize]*(height/possibleGridSizes[gridSize]-1-activeWalls[i].gapPos));
    }
    
    activeWalls[i].animationFrame++;
    cont.globalAlpha = 1;
  }
}

function paintGrid(size){
  if(width%size != 0 || height%size != 0){
    console.log("NOPE");
    return;
  }
  cont.strokeStyle = gridColor;
  //draw horizontal lines
  for (var i = 0; i < height/size; i++) {
    cont.beginPath();
    cont.moveTo(0,i*size);
    cont.lineTo(width,i*size);
    cont.stroke();
  };

  //draw vertical lines
  for (var i = 0; i < width/size; i++) {
    cont.beginPath();
    cont.moveTo(i*size,0);
    cont.lineTo(i*size,height);
    cont.stroke();
  };
}