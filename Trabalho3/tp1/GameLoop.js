function GameLoop(scene) {
    this.scene = scene;
	this.stackedMoves = [];

    this.currentPlayer = 2;

    this.BEGIN_PHASE = true;
    this.GAME_LOOP = false;
    this.PLAYER = 0;
    this.PICKING_PIECE = false;
    this.PICKING_BOARD = false;
    this.MAKING_MOVE = false;
    this.END_GAME = false;

    this.gameDifficulty = null; // 0 - facil, 1 - dificil
    this.gameType = null; // 0 - humano/humano, 1 - humano/maquina

    this.pickedPiece = null;
    this.pickedBoardCell = null;
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

GameLoop.prototype.loop = function(obj) {
    if(this.BEGIN_PHASE){ //choose difficulty
        if(obj.id === 'facil'){
            this.gameDifficulty = 0;
            obj.picked = false;
        }
        else if(obj.id === 'dificil'){
            this.gameDifficulty = 1;
            obj.picked = false;        
        }
        else if(obj.id === 'humano_humano'){
            this.gameType = 0;
            obj.picked = false;
        }
        else if(obj.id === 'humano_maquina'){
            this.gameType = 0;
            obj.picked = false;
        }
        if(this.gameDifficulty !== null && this.gameType !== null){
            this.BEGIN_PHASE = false;
            this.GAME_LOOP = true;
            this.PICKING_PIECE = true;
            this.scene.updateCamera(this.PLAYER);
        }
    }
    else if(this.GAME_LOOP){ //make a play
        if(this.PICKING_PIECE){
            if(idIsPawnOrKing(obj.id)){
                //check if obj corresponds to the correct player
                this.pickedPiece = obj;
                this.PICKING_PIECE = false;
                this.PICKING_BOARD = true;
            }
            else {
                console.log('Pick a Valid Piece');
            }
        }
        else if(this.PICKING_BOARD){
            if(idIsBoard(obj.id)){
                this.pickedBoardCell = obj;

                var gameMove = new GameMove(this.scene, this.pickedPiece, this.pickedBoardCell, 0);

                if (this.attemptMove(gameMove)){
                    console.log('Move is valid!');
                    gameMove.execute();

                    this.pickedPiece.picked = false;
                    this.pickedBoardCell.picked = false;

                    this.stackedMoves.push(gameMove);
                    this.MAKING_MOVE = true;
                    this.PICKING_BOARD = false;
                }
                else {
                    console.log("Invalid move!");
                    this.PICKING_BOARD = false;
                    this.PICKING_PIECE = true;
                }

            }
        }
    }
    else if(this.MAKING_MOVE){
        console.log('A move is still being made, please wait.');
    }
    else if(this.END_GAME){
        console.log('End game');
        //make a scene to restart or not
        this.scene.updateCamera('Beggining');
    }
}

GameLoop.prototype.update = function() {
    if(this.MAKING_MOVE){
        if(this.pickedPiece.animation.endAnimation){
            this.MAKING_MOVE = false;
            this.PLAYER = 1 - this.PLAYER;
            this.PICKING_PIECE = true;
            this.scene.updateCamera(this.PLAYER);
        }
    }
}