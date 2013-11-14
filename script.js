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

/*~~~~~~~~~~Event Listener~~~~~~~~~~*/

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
			if (gameStarted == 0) {
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




/*~~~~~~~~~~Funktionen~~~~~~~~~~*/

	function init(){
		document.getElementById("t").innerHTML = "";
		document.getElementById("t").style.left = "385px";
		/*-----FPS-----*/
		window.setInterval("update()",16);
	}


	function update(){
		
		/*------Paddelbewegung------*/
		if ((rightV > 0 && rightPaddlePos<450)||(rightV<0 && rightPaddlePos>0)) {
			rightPaddlePos += rightV;
		};
		if ((leftV > 0 && leftPaddlePos<450)||(leftV<0 && leftPaddlePos>0)) {
			leftPaddlePos += leftV;
		};
		if (paused == 1) {
			pauseTimer -= 16;
			document.getElementById("t").innerHTML = Math.ceil((pauseTimer*3)/2000);
			if (pauseTimer <= 0) {
				paused = 0;
				pauseTimer = 2000;
				document.getElementById("t").style.display = "none";
			}
		} else {
			/*------Kollisionsabfragen------*/
			//Ball trifft Paddel (rechts)
			if (ballPosX>=750 && ballPosX<=780 && rightPaddlePos<(ballPosY+9) && (rightPaddlePos+150)>ballPosY) {
				ballVtotal += 0.3;
				ballVy = ((ballPosY - rightPaddlePos)/150)*1.6*ballVtotal-0.8*ballVtotal; //<--kompliziert
				ballVx = -1*Math.sqrt(ballVtotal*ballVtotal - ballVy*ballVy);
				console.log("x: "+ballVx);
				console.log("y: "+ballVy);
				console.log("total: "+ballVtotal);
			};

			//Ball trifft Paddel (links)
			if (ballPosX<=40 && ballPosX>=10 && leftPaddlePos<(ballPosY+9) && (leftPaddlePos+150)>ballPosY) {
				ballVtotal += 0.3;
				ballVy = ballVy = ((ballPosY - leftPaddlePos)/150)*1.6*ballVtotal-0.8*ballVtotal;
				ballVx = Math.sqrt(ballVtotal*ballVtotal - ballVy*ballVy);
			};

			//Ball trifft obere oder untere Wand
			if (ballPosY>=590 || ballPosY<=0) {
				ballVy *= -1;
				ballVtotal +=0.1;
			}

			//Ball geht ins Aus (links)
			if(ballPosX<=0){
				reset();
				rightScore += 1;
				document.getElementById("rs").innerHTML = rightScore;
			
			//Ball geht ins Aus (rechts)
			} else if(ballPosX>=790){
				reset();
				leftScore += 1;
				document.getElementById("ls").innerHTML = leftScore;

			/*------Ballbewegung------*/
			} else {
				ballPosX += ballVx;
			};
			ballPosY += ballVy; 
		}

			/*------Positionen updaten------*/
			document.getElementById("lp").style.top = leftPaddlePos;
			document.getElementById("rp").style.top = rightPaddlePos;
			document.getElementById("b").style.top = ballPosY;
			document.getElementById("b").style.left = ballPosX;	
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
		paused = 1;
		document.getElementById("t").style.display = "block";
	}