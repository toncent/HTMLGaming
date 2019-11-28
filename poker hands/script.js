function updateHandList(hand){
	if (royalStraightFlush(hand)) return;
	if (fourOfAKind(hand)) return; 
	if (fullHouse(hand)) return;
	if (threeOfAKind(hand)) return;
	if (oneTwoPair(hand)) return;
	handList[0]++;
}

function royalStraightFlush(hand){
	var highCardAce = hand[4] % 13 == 12;
	var straight;
	if (highCardAce) {
		//A2345 check
		straight = hand[0] % 13 == 0 && hand[1] % 13 == 1 && hand[2] % 13 == 2 && hand[3] % 13 == 3 && hand[4] % 13 == 12;
		if(straight) highCardAce = false;
		else straight = (hand[0] + 1) % 13 == hand[1] % 13 && (hand[1] + 1) % 13 == hand[2] % 13 && (hand[2] + 1) % 13 == hand[3] % 13 && (hand[3] + 1) % 13 == hand[4] % 13;
	} else {
		straight = (hand[0] + 1) % 13 == hand[1] % 13 && (hand[1] + 1) % 13 == hand[2] % 13 && (hand[2] + 1) % 13 == hand[3] % 13 && (hand[3] + 1) % 13 == hand[4] % 13;
	}
	var suit = Math.floor(hand[0]/13);
	var flush = Math.floor(hand[1]/13) == suit && Math.floor(hand[2]/13) == suit && Math.floor(hand[3]/13) == suit && Math.floor(hand[4]/13) == suit;  
	if(straight && flush){
		if (highCardAce) {
			//high card is an ace -> royal flush
			handList[9]++;
		} else {
			//high card not an ace -> straight flush
			handList[8]++;
		}
		return true;
	} else if (straight) {
		handList[4]++;
		return true;
	} else if (flush) {
		handList[5]++;
		return true;
	}
	return false;
}

function fourOfAKind(hand){
	if ((hand[0]) % 13 == (hand[1]) % 13 && (hand[0]) % 13 == (hand[2]) % 13 && (hand[0]) % 13 == (hand[3]) % 13){
		handList[7]++;
		return true;
	}
	if ((hand[1]) % 13 == (hand[2]) % 13 && (hand[1]) % 13 == (hand[3]) % 13 && (hand[1]) % 13 == (hand[4]) % 13){
		handList[7]++;
		return true;
	}
	return false;
}

function fullHouse(hand){
	if ((hand[0]) % 13 == (hand[1]) % 13 && (hand[0]) % 13 == (hand[2]) % 13 && (hand[3]) % 13 == (hand[4]) % 13){
		handList[6]++;
		return true;
	}
	if ((hand[0]) % 13 == (hand[1]) % 13 && (hand[2]) % 13 == (hand[3]) % 13 && (hand[2]) % 13 == (hand[4]) % 13){
		handList[6]++;
		return true;
	}
	return false;
}

function threeOfAKind(hand){
	if ((hand[0]) % 13 == (hand[1]) % 13 && (hand[0]) % 13 == (hand[2]) % 13){
		handList[3]++;
		return true;
	}
	if ((hand[1]) % 13 == (hand[2]) % 13 && (hand[1]) % 13 == (hand[3]) % 13){
		handList[3]++;
		return true;
	}
	if ((hand[2]) % 13 == (hand[3]) % 13 && (hand[2]) % 13 == (hand[4]) % 13){
		handList[3]++;
		return true;
	}
	return false;
}

function oneTwoPair(hand){
	if ((hand[0]) % 13 == (hand[1]) % 13){
		//one or two pair
		if ((hand[2]) % 13 == (hand[3]) % 13 || (hand[3]) % 13 == (hand[4]) % 13){
			//two pair
			handList[2]++;
			return true;
		}
		//one pair
		handList[1]++;
		return true;
	}
	if ((hand[1]) % 13 == (hand[2]) % 13){
		//one or two pair
		if ((hand[3]) % 13 == (hand[4]) % 13){
			//two pair
			handList[2]++;
			return true;
		}
		handList[1]++;
		return true;
	}
	if ((hand[2]) % 13 == (hand[3]) % 13){
		//one pair
		handList[1]++;
		return true;
	}
	if ((hand[3]) % 13 == (hand[4]) % 13){
		//one pair
		handList[1]++;
		return true;
	}
	return false;
}

function sort(hand){
	/*
		[[0,1],[3,4]]
		[[2,4]]
		[[2,3],[1,4]]
		[[0,3]]
		[[0,2],[1,3]]
		[[1,2]]
	*/
	var temp;
	if ((hand[0]) % 13 > (hand[1]) % 13) {
		temp = hand[0];
		hand[0] = hand[1];
		hand[1] = temp;
	}
	if ((hand[3]) % 13 > (hand[4]) % 13) {
		temp = hand[3];
		hand[3] = hand[4];
		hand[4] = temp;
	}
	if ((hand[2]) % 13 > (hand[4]) % 13) {
		temp = hand[2];
		hand[2] = hand[4];
		hand[4] = temp;
	}
		if ((hand[2]) % 13 > (hand[3]) % 13) {
		temp = hand[2];
		hand[2] = hand[3];
		hand[3] = temp;
	}
		if ((hand[1]) % 13 > (hand[4]) % 13) {
		temp = hand[1];
		hand[1] = hand[4];
		hand[4] = temp;
	}
		if ((hand[0]) % 13 > (hand[3]) % 13) {
		temp = hand[0];
		hand[0] = hand[3];
		hand[3] = temp;
	}
		if ((hand[0]) % 13 > (hand[2]) % 13) {
		temp = hand[0];
		hand[0] = hand[2];
		hand[2] = temp;
	}
	if ((hand[1]) % 13 > (hand[3]) % 13) {
		temp = hand[1];
		hand[1] = hand[3];
		hand[3] = temp;
	}
	if ((hand[1]) % 13 > (hand[2]) % 13) {
		temp = hand[1];
		hand[1] = hand[2];
		hand[2] = temp;
	}
	return hand;
}

var c1, c2, c3, c4, c5, count = 0;
var handList = [0,0,0,0,0,0,0,0,0,0];
for (c1 = 0; c1<48; c1++){
	for (c2 = c1+1; c2<49; c2++){
		for (c3 = c2+1; c3<50; c3++){
			for (c4 = c3+1; c4<51; c4++){
				for (c5 = c4+1; c5<52; c5++){
					updateHandList(sort([c1,c2,c3,c4,c5]));
					count++;
				}	
			}	
		}
	}	
}
var result = "highCard: " + handList[0] + " (" + handList[0]*100/count + "%)<br/>pair: " + handList[1] + " (" + handList[1]*100/count + "%)<br/>two pair: " + handList[2] + " (" + handList[2]*100/count + "%)<br/>three: " + handList[3]+ "(" + handList[3]*100/count + "%)<br/>straight: " + handList[4]+ " (" + handList[4]*100/count + "%)<br/>flush: " + handList[5] + " (" + handList[5]*100/count + "%)<br/>full house: " + handList[6] + " (" + handList[6]*100/count + "%)<br/>four: " + handList[7] + " (" + handList[7]*100/count + "%)<br/>straight flush: " + handList[8] + " (" + handList[8]*100/count + "%)<br/>royal flush: " + handList[9] + " (" + handList[9]*100/count + "%)";
document.getElementsByTagName("body")[0].innerHTML += result + "<br/>count: " + count;