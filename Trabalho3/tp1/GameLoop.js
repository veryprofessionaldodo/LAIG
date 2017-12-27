function GameLoop(scene) {
    this.scene = scene;
    this.stackedMoves = [];

    this.board = scene.board;
    this.auxWhiteBoard = scene.auxWhiteBoard;
    this.auxRedBoard = scene.auxRedBoard;

    this.auxRedPosition = 0;
    this.auxWhitePosition = 0;

    this.currentPlayer = 2;

    this.BEGIN_PHASE = true;
    this.GAME_LOOP = false;
    this.PLAYER = 0; // 0 - White, 1 - Red
    this.MAKING_MOVE = false;
    this.END_GAME = false;

    this.gameDifficulty = null; // 0 - facil, 1 - dificil
    this.gameType = null; // 0 - humano/humano, 1 - humano/maquina, 2 - maquina/maquina

    this.pickedPiece = null;
    this.pickedBoardCell = null;

    this.counter = null;
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
    console.log("MADE REQUEST");
    console.log(request);
    this.getPrologRequest(request, this.handleReply);
}


GameLoop.prototype.reverseMove = function() {
    console.log("Stacked Moves");
    console.log(this.stackedMoves)
    if (this.stackedMoves.length > 0) {
        var moveToBeReversed = this.stackedMoves[this.stackedMoves.length-1];
        moveToBeReversed.reverse();

        console.log("Antes da chamada");
        console.log(moveToBeReversed);
        this.reverseMoveOnProlog(moveToBeReversed);
        
        // Remove from stacked Moves
        this.stackedMoves.splice(this.stackedMoves.length-1, 1);

        console.log(moveToBeReversed);

        // in case it has eliminated some piece(s)
        var check = true;
        var i = 1;
        while (check) {
            if (this.stackedMoves.length > i) {
                if (this.stackedMoves[this.stackedMoves.length-i].outofBoard == 0) {
                    check = false;
                    break;
                }
                else {
                    this.stackedMoves[this.stackedMoves.length-i].reverse();
                    this.revivePieceProlog(this.stackedMoves[this.stackedMoves.length-i]);
                    this.stackedMoves.splice(this.stackedMoves.length-i, 1);
                    i--;
                }
            }
            else {
                check = false;
            }
            i++;
        }

    }
    
}

GameLoop.prototype.reverseMoveOnProlog = function(gameMove) {
    console.log("GameMove to Be Reversed");
    console.log(gameMove);

    var previousPositionString = gameMove.previousCell.id;
    var currentPositionString = gameMove.previousCell.id;

    var columnBefore = "" + (8-parseInt(previousPositionString[5]));
    var lineBefore =  ""+ (parseInt(previousPositionString[6])+1);

    var columnAfter = "" + (8-parseInt(currentPositionString[5]));
    var lineAfter =  ""+ (parseInt(currentPositionString[6])+1);

    var requestString = "[undo," + this.currentPlayer + "," + lineBefore + "," + columnBefore + "-" + lineAfter+"," + columnAfter+ "]";

    console.log("Sent" + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReply);  

    console.log("response from server");
    console.log(responseString);
};

GameLoop.prototype.revivePieceProlog = function(eliminationMove) {
    console.log("Elimination Move to Be Reversed");
    console.log(eliminationMove);

    var positionString = eliminationMove.previousCell.id;

    var column = "" + (8-parseInt(positionString[5]));
    var line =  ""+ (parseInt(positionString[6])+1);

    var requestString = "[revive," + this.currentPlayer + "," + line + "," + column +"]";

    console.log("Sent" + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReply);  

    console.log("response from server");
    console.log(responseString);
}

GameLoop.prototype.attemptMove = function(moveArgs) {
    var moveString = this.moveToString(moveArgs);
    var requestString = "[move," + this.currentPlayer + "," + moveString + "]";

    console.log("Sent " + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReply);  

    console.log("Received " + responseString);

    if (responseString[1] == 'o' && responseString[2] == 'k') {
        this.currentPlayer = (this.currentPlayer)%2 + 1;
        this.removeEliminatedPieces(responseString);
        return true;
    }
    else  {
        return false;
    }
}

GameLoop.prototype.moveToString = function(moveArgs) {
    var cellBefore = this.IDtoPosition(moveArgs.piece.boardCell.id);
    var cellAfter = this.IDtoPosition(moveArgs.cellDest.id);

    var moveString = cellBefore[0] + cellBefore[1] + "-" + cellAfter[0] + cellAfter[1];

    return moveString;
}

GameLoop.prototype.removeEliminatedPieces = function(responseString) {
    var eliminatedString = [];

    for (var i = 5; i < (responseString.length-2); i++) {
        eliminatedString[i-5] = responseString[i];
    }

    console.log(eliminatedString);

    if (eliminatedString.length > 1) {
        var splitEliminated = "" + eliminatedString.join("").split(",");  

        this.removeByPosition(splitEliminated);
    }
}

GameLoop.prototype.removeByPosition = function(positionString) {
    for (var i = 0; i < this.board.pieces.length; i++) {
        var boardId = this.board.pieces[i].boardCell.id;

        if (boardId[5] == (""+ (8 - parseInt(positionString[1]))) && boardId[6] == (""+ (parseInt(positionString[3]) - 1))){
            console.log("Piece to be removed is ");
            console.log(this.board.pieces[i]);

            // Parsing the Id to see if it's red or black, to see to which aux we need to send him.
            var pieceNumberString = [];
            var pieceId = this.board.pieces[i].id;
            
            pieceNumberString[0] = pieceId[4];
            pieceNumberString[1] = pieceId[5];

            var pieceNumber = parseInt(pieceNumberString.join(""));

            var destinationCell;
            
            if (pieceNumber > 10) { // Aux White
                var numberString = this.auxWhitePosition.toString();
                console.log("white ");
                console.log(numberString);

                for (var k = 0; k < this.auxWhiteBoard.boardCells.length; k++) {
                    var tmpAuxCell = this.auxWhiteBoard.boardCells[k];

                    console.log(tmpAuxCell.id[9]);
                    // Has not reached 10th capture
                    if (numberString.length == 1){
                        if (tmpAuxCell.id[9] == numberString[0]) {
                            copnsole.log("entrou em ");
                            console.log(tmpAuxCell);
                            destinationCell = this.auxWhiteBoard.boardCells[k];
                            this.auxWhitePosition++;
                        }
                    }
                    else {
                        if (tmpAuxCell.id[8] == '1') {
                            destinationCell = this.auxWhiteBoard.boardCells[k];
                            this.auxWhitePosition++;
                        }   
                    }   
                }
                this.scene.scoreWhite.update();
            }
            else { // Aux Red
                var numberString = this.auxRedPosition.toString();
                console.log("red ");
                console.log(numberString);

                for (var k = 0; k < this.auxRedBoard.boardCells.length; k++) {
                    var tmpAuxCell = this.auxRedBoard.boardCells[k];

                    console.log(tmpAuxCell.id[9]);

                    // Has not reached 10th capture
                    if (numberString.length == 1){
                        if (tmpAuxCell.id[9] == numberString[0]) {
                            console.log("entrou em ");
                            console.log(tmpAuxCell);
                            destinationCell = this.auxRedBoard.boardCells[k];
                            this.auxRedPosition++;
                        }
                    }
                    else {
                        if (tmpAuxCell.id[8] == '1') {
                            destinationCell = this.auxRedBoard.boardCells[k];
                            this.auxRedPosition++;
                        }   
                    }  
                }
                this.scene.scoreRed.update();
            }

            var eliminationMove = new GameMove(this.scene, this.board.pieces[i], this.board.pieces[i].boardCell, destinationCell, 1);
            console.log("ELIMINATION ");
            console.log(eliminationMove);

            this.stackedMoves.push(eliminationMove);
            eliminationMove.execute();

            break;
        }
    }
}


GameLoop.prototype.IDtoPosition = function(cellId) {
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
            this.gameType = 1;
            obj.picked = false;
        }
        else if(obj.id === 'maquina_maquina'){
            this.gameType = 2;
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
        if(idIsPawnOrKing(obj.id)){
            //check if obj corresponds to the correct player
            if(this.pickedPiece !== null){
                this.pickedPiece.picked = false;
                if(this.pickedPiece.id === obj.id){ //picking the same element is the same as unchoosing it
                    this.pickedPiece = null;
                }
                else
                    this.pickedPiece = obj;
            }
            else
                this.pickedPiece = obj;
        }
        else if(idIsBoard(obj.id)){
            if(this.pickedBoardCell !== null){
                this.pickedBoardCell.picked = false;
                if(this.pickedBoardCell === obj){//picking the same element is the same as unchoosing it
                    this.pickedBoardCell = null;
                }
                else
                    this.pickedBoardCell = obj;
            }
            else
                this.pickedBoardCell = obj;


            if(this.pickedBoardCell !== null && this.pickedPiece !== null){
                var gameMove = new GameMove(this.scene, this.pickedPiece, this.pickedPiece.boardCell, this.pickedBoardCell, 0);
                if (this.attemptMove(gameMove)){
                    console.log('Move is valid!');
                    gameMove.execute();

                    this.pickedPiece.picked = false;
                    this.pickedBoardCell.picked = false;

                    this.stackedMoves.push(gameMove);
                    this.MAKING_MOVE = true;
                    //this.PICKING_BOARD = false;

                    this.scene.interface.removeCounter();
                    this.counter = null;
                }
                else {
                    console.log("Invalid move!");
                    //this.PICKING_BOARD = false;
                    //this.PICKING_PIECE = true;
                    this.pickedPiece.picked = false;
                    this.pickedBoardCell.picked = false;
                    this.pickedPiece = null;
                    this.pickedBoardCell = null;
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

GameLoop.prototype.update = function(deltaTime) {
    if(this.MAKING_MOVE){
        if(this.pickedPiece.animation.endAnimation){
            this.MAKING_MOVE = false;
            this.PLAYER = 1 - this.PLAYER;

            this.pickedPiece = null;
            this.pickedBoardCell = null;
            this.GAME_LOOP = true;
            this.scene.updateCamera(this.PLAYER);
        }
    }
    /*else if(this.GAME_LOOP && this.counter === null && this.scene.cameraAnimation === null){
        this.counter = 10;
        this.scene.interface.addCounter(this.counter, this);
    }
    else if(this.counter !== null){
        this.counter -= deltaTime;
        if(this.counter <= 0){
            this.scene.interface.removeCounter();
            this.counter = null;
            this.PLAYER = 1 - this.PLAYER;
            this.GAME_LOOP = true;
            //this.PICKING_PIECE = true;
            this.scene.updateCamera(this.PLAYER);
        }
        else {
            this.scene.interface.updateCounter();
        }
    }*/
}

GameLoop.prototype.resetGame = function() {
    this.stackedMoves = [];

    this.auxRedPosition = 0;
    this.auxWhitePosition = 0;

    this.currentPlayer = 2;

    this.BEGIN_PHASE = false;
    this.GAME_LOOP = true;
    this.PLAYER = 0;
    this.MAKING_MOVE = false;
    this.END_GAME = false;

    this.pickedPiece = null;
    this.pickedBoardCell = null;

    this.counter = null;
}

GameLoop.prototype.resetGameWithOptions = function() {
    this.stackedMoves = [];

    this.auxRedPosition = 0;
    this.auxWhitePosition = 0;

    this.currentPlayer = 2;

    this.BEGIN_PHASE = true;
    this.GAME_LOOP = false;
    this.PLAYER = 0;
    this.MAKING_MOVE = false;
    this.END_GAME = false;

    this.gameDifficulty = null; // 0 - facil, 1 - dificil
    this.gameType = null; // 0 - humano/humano, 1 - humano/maquina, 2 - maquina/maquina

    this.pickedPiece = null;
    this.pickedBoardCell = null;

    this.counter = null;
}