/*TODO: esc zum menü aufrufen
		paused variable evtl umbenennen, weil sie zur Zeit anders genutz wird
*/

/*~~~~~~~~~~VARIABLEN~~~~~~~~~~*/
	var paddleSpeed = 5;
	var leftPaddlePos = 225;
	var rightPaddlePos = 225;
	var ballPosX = 395;
	var ballPosY = 295;
	var leftV = 0;
	var rightV = 0;
	var ballVtotal = 7;
	var ballVx = 4;
	var ballVy = 3;
	var leftScore = 0;
	var rightScore = 0;
	var paused = 1;
	var pauseTimer = 2000;
	var gameStarted = 0;
	var gameVisible = 0;
	var gameFps = 60;
	var canvas;
	var timerStatus;

/*~~~~~~~~~~Event Listener~~~~~~~~~~*/
	document.addEventListener('DOMContentLoaded', initListeners)
	function initListeners(){
		window.addEventListener('keydown', function(e) {
			if (e.keyCode == 38) {
				rightV = -paddleSpeed;
			} else if (e.keyCode == 40) {
				rightV = paddleSpeed;
			} else if (e.keyCode == 87) {
				leftV = -paddleSpeed;
			} else if (e.keyCode == 83) {
				leftV = paddleSpeed;
			} else if (e.keyCode == 32) {
				if (gameStarted == 0 && gameVisible == 1) {
					init();
					gameStarted = 1;
				}
			};
		}, false);

		window.addEventListener('keyup', function(e){
			if (e.keyCode == 38) {
				if(rightV == -paddleSpeed) rightV = 0;
			} else if (e.keyCode == 40) {
				if(rightV == paddleSpeed) rightV = 0;
			} else if (e.keyCode == 87) {
				if(leftV == -paddleSpeed) leftV =0;
			} else if (e.keyCode == 83) {
				if(leftV == paddleSpeed) leftV = 0;
			};
		}, false);

		document.getElementById("newGameButton").addEventListener('click', function(e){
			document.getElementById("menu").style.display = "none";
			document.getElementById("game").style.display ="block";
			gameVisible = 1;
		});

		document.getElementById("optionsButton").addEventListener('click', function(e){
			document.getElementById("menu").style.display = "none";
			document.getElementById("options").style.display ="block";
		});

		document.getElementById("creditsButton").addEventListener('click', function(e){
			document.getElementById("menu").style.display = "none";
			document.getElementById("credits").style.display ="block";
		});
	}



/*~~~~~~~~~~Funktionen~~~~~~~~~~*/

	function init(){
		canvas = document.getElementById("canvas");
		/*-----FPS-----*/
		window.setInterval("update()",1000/gameFps);
	}

	function paddleMove(){
		if ((rightV > 0 && rightPaddlePos<450)||(rightV<0 && rightPaddlePos>0)) {
			rightPaddlePos += rightV;
		};
		if ((leftV > 0 && leftPaddlePos<450)||(leftV<0 && leftPaddlePos>0)) {
			leftPaddlePos += leftV;
		};
	}

	function manageTimer(){
		pauseTimer -= 1000/gameFps;
		timerStatus = Math.ceil((pauseTimer*3)/2000);
		if (pauseTimer <= 0) {
			paused = 0;
			pauseTimer = 2000;
		}
	}

	function manageCollisions(){
		//Ball trifft Paddel (rechts)
		if (ballPosX>=750 && ballPosX<=780 && rightPaddlePos<(ballPosY+9) && (rightPaddlePos+150)>ballPosY) {
			ballVtotal += 0.3;
			ballVy = ((ballPosY - rightPaddlePos)/150)*1.6*ballVtotal-0.8*ballVtotal; //<--kompliziert
			ballVx = -1*Math.sqrt(ballVtotal*ballVtotal - ballVy*ballVy);
			updateBallColor();
		}

		//Ball trifft Paddel (links)
		if (ballPosX<=40 && ballPosX>=10 && leftPaddlePos<(ballPosY+9) && (leftPaddlePos+150)>ballPosY) {
			ballVtotal += 0.3;
			ballVy = ballVy = ((ballPosY - leftPaddlePos)/150)*1.6*ballVtotal-0.8*ballVtotal;
			ballVx = Math.sqrt(ballVtotal*ballVtotal - ballVy*ballVy);
			updateBallColor();
		}

		//Ball trifft obere oder untere Wand
		if (ballPosY>=590 || ballPosY<=0) {
			ballVy *= -1;
			ballVtotal +=0.1;
			updateBallColor();
		};
	}

	function draw(){
		var buffer = document.createElement("canvas");
		buffer.width = canvas.width;
		buffer.height = canvas.height;
		var buffer_ctx = buffer.getContext("2d");
		buffer_ctx.fillStyle = "#000000";
		buffer_ctx.fillRect(0,0,800,600);
		buffer_ctx.fillStyle ="#FFFFFF";
		buffer_ctx.strokeStyle ="#FFFFFF";

		if(paused==1){
			drawTimer();
		}
		drawPaddle(20, leftPaddlePos, buffer_ctx);
		drawPaddle(760, rightPaddlePos, buffer_ctx);
		drawScore(buffer_ctx);
		drawBall(buffer_ctx);
		
		var ctx = canvas.getContext("2d");
		ctx.fillStyle ="black";
		ctx.fill();
		ctx.drawImage(buffer,0,0);
		/*document.getElementById("lp").style.top = leftPaddlePos;
		document.getElementById("rp").style.top = rightPaddlePos;
		document.getElementById("b").style.top = ballPosY;
		document.getElementById("b").style.left = ballPosX;
		document.getElementById("rs").innerHTML = rightScore;	
		document.getElementById("ls").innerHTML = leftScore;*/
	}

	function drawPaddle( paddleX, paddleY, buffer_ctx){
		buffer_ctx.beginPath();
		buffer_ctx.lineWidth=10;
		buffer_ctx.lineJoin="round";
		buffer_ctx.moveTo(paddleX+5,paddleY+5);
		buffer_ctx.lineTo(paddleX+15,paddleY+5);
		buffer_ctx.lineTo(paddleX+15,paddleY+145);
		buffer_ctx.lineTo(paddleX+5,paddleY+145);
		buffer_ctx.lineTo(paddleX+5,paddleY+5);
		buffer_ctx.lineTo(paddleX+10,paddleY+5);
		buffer_ctx.stroke();
	}

	function drawBall(buffer_ctx){
		buffer_ctx.beginPath();
		buffer_ctx.arc(ballPosX,ballPosY,5,0,2*Math.PI);
		buffer_ctx.fill();
	}

	function drawTimer(buffer_ctx){

	}

	function drawScore(){

	}

	function manageBall(){
		//Ball geht ins Aus (links)
		if(ballPosX<=0){
			reset();
			rightScore += 1;
		
		//Ball geht ins Aus (rechts)
		} else if(ballPosX>=790){
			reset();
			leftScore += 1;

		//Ballbewegung
		} else {
			ballPosX += ballVx;
		};
		ballPosY += ballVy;
	}

	function update(){
		
		/*------Paddelbewegung------*/
		paddleMove();

		if (paused == 1) {
			manageTimer();
		} else {
			/*------Kollisionsabfragen------*/
			manageCollisions();

			/*-------Ball----------------*/
 			manageBall();
		}
			/*------Positionen updaten------*/
			draw();
	}

	function updateBallColor(){
		var result = "";
		var red = Math.round((ballVtotal - 7)*25);
		var blue = Math.round(255-(ballVtotal-7)*25);
		if(blue < 0) blue = 0;
		if(red > 255) red = 255;
		if (red < 16) {
			result+="0";
		};
		result += red.toString(16)+"00";
		if (blue < 16) {
			result += "0";
		};
		result += blue.toString(16);
		//document.getElementById("b").style.backgroundColor = "#"+result;
	}

	function reset(){
		ballPosX = 395;
		ballPosY = 295;
		ballVtotal = 6;
		ballVy = Math.floor(Math.random()*4)+1;
		ballVx = Math.sqrt(ballVtotal*ballVtotal - ballVy*ballVy);
		ballVy *= Math.random() < 0.5 ? -1 : 1;
		ballVx *= Math.random() < 0.5 ? -1 : 1;
		ballVtotal = 7;
		updateBallColor();
		paused = 1;
	}