function GameLoop() {
	this.stackedMoves = [];

    this.currentPlayer = 2;
}

GameLoop.prototype.getPrologRequest = function(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

    request.onload = onSuccess ||  function(data){console.log("Request successful. Reply: " + data.target.response);};

    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();

    var test = request.response;

    return test;
}
        
GameLoop.prototype.makeRequest = function(request) {
    // Get Parameter Values
    var requestString = document.querySelector("#query_field").value;               


    // Make Request
    this.getPrologRequest(requestString, this.handleReply);
}

GameLoop.prototype.attemptMove = function(moveArgs) {
    var moveString = moveToString(moveArgs);
    
    var requestString = "[move," + this.currentPlayer + "," + moveString + "]";
    
    console.log("Sent " + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReply);  

    console.log("Received " + responseString);

    if (responseString[1] == 'o' && responseString[2] == 'k') {
        this.currentPlayer = (this.currentPlayer)%2 + 1;
        return true;
    }
    else  {
        return false;
    }

    /*
        if (this.succeeded)
        this.currentPlayer = (this.currentPlayer+1%2) + 1;


    if (responseString[1] == 'o' && responseString[2] == 'k') {
        console.log("DEU CARALHO, QUAL É A CENA");
        this.succeeded = true;
    }
    else  {
        console.log("FODASSE");
        this.succeeded = true;
    }*/
}

function moveToString(moveArgs) {
    var cellBefore = IDtoPosition(moveArgs.piece.boardCell.id);
    var cellAfter = IDtoPosition(moveArgs.cellDest.id);

    var moveString = cellBefore[0] + cellBefore[1] + "-" + cellAfter[0] + cellAfter[1];

    return moveString;
}

function IDtoPosition(cellId) {
    var column = cellId[6];
    var columnLetter;

    if (parseInt(column)+1 == 1)
        columnLetter = 'a';
    if (parseInt(column)+1 == 2)
        columnLetter = 'b';
    if (parseInt(column)+1 == 3)
        columnLetter = 'c';
    if (parseInt(column)+1 == 4)
        columnLetter = 'd';
    if (parseInt(column)+1 == 5)
        columnLetter = 'e';
    if (parseInt(column)+1 == 6)
        columnLetter = 'f';
    if (parseInt(column)+1 == 7)
        columnLetter = 'g';
    if (parseInt(column)+1 == 8)
        columnLetter = 'h';
    if (parseInt(column)+1 == 9)
        columnLetter = 'i';
    if (parseInt(column)+1 == 10)
        columnLetter = 'j';

    var line = 7 - parseInt(cellId[5]);

    return [columnLetter,1+parseInt(line)];
}
            
//Handle the Reply
GameLoop.prototype.handleReply = function(data){
    var responseString = data.target.response;

    console.log("RESPONSE " + responseString);


}


function stringToResponse(responseString){
	var array;

	return array;
}