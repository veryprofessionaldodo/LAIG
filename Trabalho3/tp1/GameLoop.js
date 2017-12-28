function GameLoop(scene) {
    this.scene = scene;
    this.stackedMoves = [];
    this.replayCurrentMove = 0;
    this.startedReplay = false;
    this.waitTime = 1;

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

    // Made to see whether it's AI (1) or human (0);
    this.player1Type;
    this.player2Type;

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
    if (this.stackedMoves.length > 0) {
        var moveToBeReversed = this.stackedMoves[this.stackedMoves.length-1];
        moveToBeReversed.reverse();

        this.reverseMoveOnProlog(moveToBeReversed);
        
        // Remove from stacked Moves
        this.stackedMoves.splice(this.stackedMoves.length-1, 1);

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
        this.PLAYER = 1- this.PLAYER;
        this.scene.updateCamera(this.PLAYER);

    }
    
}

GameLoop.prototype.reverseMoveOnProlog = function(gameMove) {
    var previousPositionString = gameMove.cellDest.id;
    var currentPositionString = gameMove.previousCell.id;

    var columnBefore = "" + (8-parseInt(previousPositionString[5]));
    var lineBefore =  ""+ (parseInt(previousPositionString[6])+1);

    var columnAfter = "" + (8-parseInt(currentPositionString[5]));
    var lineAfter =  ""+ (parseInt(currentPositionString[6])+1);

    this.currentPlayer = (this.currentPlayer)%2 + 1;

    var requestString = "[undo," + this.currentPlayer + "," + lineBefore + "," + columnBefore + "-" + lineAfter+"," + columnAfter+ "]";

    console.log("Sent" + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReply);  
};

GameLoop.prototype.revivePieceProlog = function(eliminationMove) {
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
        this.removeEliminatedPieces(responseString,5);
        return true;
    }
    else  {
        return false;
    }
}

GameLoop.prototype.AIStringToMove = function(responseString) {
    if (responseString[1] == 'o' && responseString[2] == 'k') {
        this.removeEliminatedPieces(responseString,15);

        var piecePosition = this.positionToCell(responseString[5],responseString[7]);
        var boardPosition = this.positionToCell(responseString[9],responseString[11]);   

        var piecePosInArray; 
        for (var i = 0; i < this.board.pieces.length; i++) {
            var cell = this.board.pieces[i].boardCell;
            if (parseInt(cell.id[5]) == piecePosition[1] && parseInt(cell.id[6]) == piecePosition[0]) {
                piecePosInArray = i;
                break;
            }
        }

        console.log("piece");
        console.log(this.board.pieces[piecePosInArray]);

        var cellDestPos;
        for (var i = 0; i < this.board.boardCells.length; i++) {
            var boardCell = this.board.boardCells[i];

            if(parseInt(boardCell.id[5]) == boardPosition[1] && parseInt(boardCell.id[6]) == boardPosition[0]) {
                cellDestPos = i;
                break;
            }
        }

        console.log("cellDest");
        console.log(this.board.boardCells[cellDestPos]);

        var gameMove = new GameMove(this.scene.board, this.board.pieces[piecePosInArray].id, this.board.pieces[piecePosInArray].boardCell.id,
                 this.board.boardCells[cellDestPos].id, this.board.pieces[piecePosInArray], this.board.pieces[piecePosInArray].boardCell,
                 this.board.boardCells[cellDestPos], 0);

        console.log(gameMove);

        return gameMove;

    }
    else // No valid moves, lost
        return null;
}

GameLoop.prototype.checkGameOver = function() {
    var requestString = "[is_game_over," + this.currentPlayer + "]";

    console.log("Sent " + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReply);

    console.log(responseString);
    if (responseString[1] == 'y')
        return true;
    else
        return false;
}

GameLoop.prototype.moveToString = function(moveArgs) {
    var cellBefore = this.IDtoPosition(moveArgs.piece.boardCell.id);
    var cellAfter = this.IDtoPosition(moveArgs.cellDest.id);

    var moveString = cellBefore[0] + cellBefore[1] + "-" + cellAfter[0] + cellAfter[1];

    return moveString;
}

GameLoop.prototype.removeEliminatedPieces = function(responseString, position) {
    var eliminatedString = [];

    for (var i = position; i < (responseString.length-2); i++) {
        eliminatedString[i-position] = responseString[i];
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

        var destinationCell;

        if (boardId[5] == (""+ (8 - parseInt(positionString[1]))) && boardId[6] == (""+ (parseInt(positionString[3]) - 1))){
            console.log("Piece to be removed is ");
            console.log(this.board.pieces[i]);

            if (this.board.pieces[i].id[0] == 'k') { // Is King
                console.log("END GAME");
                this.END_GAME = true;
            }   

            // Parsing the Id to see if it's red or black, to see to which aux we need to send him.
            else {
                var pieceNumberString = [];
                var pieceId = this.board.pieces[i].id;
                
                pieceNumberString[0] = pieceId[4];
                pieceNumberString[1] = pieceId[5];

                var pieceNumber = parseInt(pieceNumberString.join(""));

                
                if (pieceNumber > 10) { // Aux White
                    var numberString = this.auxWhitePosition.toString();

                    for (var k = 0; k < this.auxWhiteBoard.boardCells.length; k++) {
                        var tmpAuxCell = this.auxWhiteBoard.boardCells[k];

                        // Has not reached 10th capture
                        if (numberString.length == 1){
                            if (tmpAuxCell.id[9] == numberString[0]) {
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

                    for (var k = 0; k < this.auxRedBoard.boardCells.length; k++) {
                        var tmpAuxCell = this.auxRedBoard.boardCells[k];

                
                        // Has not reached 10th capture
                        if (numberString.length == 1){
                            if (tmpAuxCell.id[9] == numberString[0]) {
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


                    var previousBoardCell = this.board.pieces[i].boardCell;

                    var eliminationMove = new GameMove(this.scene.board, this.board.pieces[i].id, previousBoardCell.id, destinationCell.id,
                    this.board.pieces[i], previousBoardCell, destinationCell, 1);
                
                    this.stackedMoves.push(eliminationMove);
                    eliminationMove.execute();

                    break;
                }
            }
        }
    }
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
            this.player1Type = 0;
            this.player2Type = 0;
            this.gameType = 0;
            obj.picked = false;
        }
        else if(obj.id === 'humano_maquina'){
            this.player1Type = 1;
            this.player2Type = 0;
            this.gameType = 1;
            obj.picked = false;
        }
        else if(obj.id === 'maquina_maquina'){
            this.player1Type = 1;
            this.player2Type = 1;
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

        // Check to see what type of play is involved
        var type;

        if(this.player == 0) 
            type = this.player1Type;
        else 
            type = this.player2Type;

         // Is Human
        if (type == 0) {
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
            }
            if(this.pickedBoardCell !== null && this.pickedPiece !== null){
                var gameMove = new GameMove(this.scene.board, this.pickedPiece.id, this.pickedPiece.boardCell.id, this.pickedBoardCell.id,
                                            this.pickedPiece, this.pickedPiece.boardCell, this.pickedBoardCell, 0);
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

                    // Checks game over

                    this.END_GAME = (this.checkGameOver() || this.END_GAME);
                    if (this.END_GAME) {
                        console.log("End game");
                        this.resetGameWithOptions();
                    }
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
        // Is AI
        else {
            var requestString = "[get_ai_move," + this.currentPlayer + "," + (this.gameDifficulty+1) +"]";
            var responseString = this.getPrologRequest(requestString, this.handleReply);

            var gameMove = this.AIStringToMove(responseString);

            if (gameMove != null) {
                this.attemptMove(gameMove);
                gameMove.execute();
                this.stackedMoves.push(gameMove);
                this.MAKING_MOVE = true;
                this.scene.interface.removeCounter();
                this.counter = null;
            }
            else {
                // GAME OVER HERE
            }
        }
    }
    else if(this.MAKING_MOVE){
        console.log('A move is still being made, please wait.');
    }
    if(this.END_GAME){
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
    this.replayCurrentMove = 0;
    this.startedReplay = false;
    this.waitTime = 1;

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
    this.replayCurrentMove = 0;
    this.startedReplay = false;
    this.waitTime = 1;

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

GameLoop.prototype.replay = function(deltaTime) {
    if(!this.startedReplay){
        this.PLAYER = 0;
        this.startedReplay = true;
        this.stackedMoves[this.replayCurrentMove].executeReplay();
        this.MAKING_MOVE = true;
    }
    else {
        if(this.replayCurrentMove >= this.stackedMoves.length){
            console.log('Replay is Over');
            this.startedReplay = false;
            this.scene.replay = false;
            this.scene.setPickEnabled(true);
            //this.END_GAME = true;
            return;
        }
        if(this.MAKING_MOVE){
            if(this.stackedMoves[this.replayCurrentMove].isAnimationOver()){
                this.MAKING_MOVE = false;
                this.PLAYER = 1 - this.PLAYER;
                this.scene.updateCamera(this.PLAYER);
                this.waitTime = 1;
            }
        }
        if(this.scene.cameraAnimation === null && !this.MAKING_MOVE){
            if(this.waitTime <= 0){
                this.replayCurrentMove += 1;
                if(this.replayCurrentMove < this.stackedMoves.length){
                    this.stackedMoves[this.replayCurrentMove].executeReplay();
                    this.MAKING_MOVE = true;
                }
            }
            else {
                this.waitTime -= deltaTime;
            }
        }
    }
}

// Necessary for 
GameLoop.prototype.positionToCell = function(ColumnLetter, LineNumber) {
    var column;
    var line = 8-parseInt(LineNumber);

    if (ColumnLetter == 'a') 
        column = 0;
    else if (ColumnLetter == 'b') 
        column = 1;
    else if (ColumnLetter == 'c') 
        column = 2;
    else if (ColumnLetter == 'd') 
        column = 3;
    else if (ColumnLetter == 'e') 
        column = 4;
    else if (ColumnLetter == 'f') 
        column = 5;
    else if (ColumnLetter == 'g') 
        column = 6;
    else if (ColumnLetter == 'h') 
        column = 7;
    else if (ColumnLetter == 'i') 
        column = 8;
    else if (ColumnLetter == 'j') 
        column = 9;

    return [column,line];
}

GameLoop.prototype.IDtoPosition = function(cellId) {
    var column = cellId[6];
    var columnLetter;

    if (parseInt(column)+1 == 1)
        columnLetter = 'a';
    else if (parseInt(column)+1 == 2)
        columnLetter = 'b';
    else if (parseInt(column)+1 == 3)
        columnLetter = 'c';
    else if (parseInt(column)+1 == 4)
        columnLetter = 'd';
    else if (parseInt(column)+1 == 5)
        columnLetter = 'e';
    else if (parseInt(column)+1 == 6)
        columnLetter = 'f';
    else if (parseInt(column)+1 == 7)
        columnLetter = 'g';
    else if (parseInt(column)+1 == 8)
        columnLetter = 'h';
    else if (parseInt(column)+1 == 9)
        columnLetter = 'i';
    else if (parseInt(column)+1 == 10)
        columnLetter = 'j';

    var line = 7 - parseInt(cellId[5]);

    return [columnLetter,1+parseInt(line)];
}

//Handle the Reply
GameLoop.prototype.handleReply = function(data){
    var responseString = data.target.response;

    console.log("RESPONSE " + responseString);
}
