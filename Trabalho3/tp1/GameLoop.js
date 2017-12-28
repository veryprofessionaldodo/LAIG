 function GameLoop(scene) {
    this.scene = scene;
    this.stackedMoves = [];
    this.replayCurrentMove = 0;
    this.startedReplay = false;
    this.waitTime = 1;
    this.waitTimeAI = 5;

    this.board = scene.board;
    this.auxWhiteBoard = scene.auxWhiteBoard;
    this.auxRedBoard = scene.auxRedBoard;

    this.auxRedPosition = 0;
    this.auxWhitePosition = 0;

    this.BEGIN_PHASE = true;
    this.GAME_LOOP = false;
    this.PLAYER = 1; // 1 - White, 0 - Red
    this.MAKING_MOVE = false;
    this.END_GAME = false;

    this.gameDifficulty = null; // 0 - facil, 1 - dificil
    this.gameType = null; // 0 - humano/humano, 1 - humano/maquina, 2 - maquina/maquina

    this.pickedPiece = null;
    this.pickedBoardCell = null;

    // Made to see whether it's AI (1) or human (0);
    this.player1Type;
    this.player2Type;

    this.currentMoveAI = null;

    this.counter = null;
}

GameLoop.prototype.getPrologRequest = function(requestString, onSuccess, gameLoop) {
    var requestPort = 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);


    request.onload = function(data){
        console.log("Request successful. Reply: " + data.target.response);
        onSuccess(data, gameLoop);
    }; 

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();

    return request.response;
}

GameLoop.prototype.makeRequest = function(request) {
    // Get Parameter Values
    console.log("MADE REQUEST");
    console.log(request);
    this.getPrologRequest(request, this.handleReply, this);
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

GameLoop.prototype.checkGameOver = function() {
    var requestString = "[is_game_over," + this.PLAYER + "]";

    console.log("Sent " + requestString);

    return this.getPrologRequest(requestString, this.handleReplyGameOver,this);
}

GameLoop.prototype.handleReplyGameOver = function(data,gameLoop){
    var responseString = data.target.response;

    console.log("Response ");
    console.log(responseString);
    if (responseString[1] == 'y')
        return true;
    else
        return false;
}

GameLoop.prototype.reverseMoveOnProlog = function(gameMove) {
    var previousPositionString = gameMove.cellDest.id;
    var currentPositionString = gameMove.previousCell.id;

    var columnBefore = "" + (8-parseInt(previousPositionString[5]));
    var lineBefore =  ""+ (parseInt(previousPositionString[6])+1);

    var columnAfter = "" + (8-parseInt(currentPositionString[5]));
    var lineAfter =  ""+ (parseInt(currentPositionString[6])+1);

    //this.currentPlayer = (this.PLAYER + 1)%2 + 1;

    var requestString = "[undo," + (this.PLAYER + 1) + "," + lineBefore + "," + columnBefore + "-" + lineAfter+"," + columnAfter+ "]";

    console.log("Sent" + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReplyReverse, this);  
};

GameLoop.prototype.handleReplyReverse = function(data, gameLoop){
    var responseString = data.target.response;

    console.log("Response ");
    console.log(responseString);

    return responseString;
}

GameLoop.prototype.revivePieceProlog = function(eliminationMove) {
    var positionString = eliminationMove.previousCell.id;

    var column = "" + (8-parseInt(positionString[5]));
    var line =  ""+ (parseInt(positionString[6])+1);

    var requestString = "[revive," + (this.PLAYER + 1) + "," + line + "," + column +"]";

    console.log("Sent" + requestString);

    var responseString = this.getPrologRequest(requestString, this.handleReplyRevive, this); 
}

GameLoop.prototype.handleReplyRevive = function(data, gameLoop){
    var responseString = data.target.response;

    console.log("Response ");
    console.log(responseString);

    return responseString;
}

GameLoop.prototype.attemptMove = function() {
    var gameMove = new GameMove(this.scene.board, this.pickedPiece.id, this.pickedPiece.boardCell.id, this.pickedBoardCell.id,
        this.pickedPiece, this.pickedPiece.boardCell, this.pickedBoardCell, 0);
        
    var moveString = this.moveToString(gameMove);
    var requestString = "[move," + (this.PLAYER + 1) + "," + moveString + "]";

    console.log("Sent " + requestString);

    return this.getPrologRequest(requestString, this.handleReplyAttemptToMove, this);  
}

GameLoop.prototype.handleReplyAttemptToMove = function(data, gameLoop){
    
    var responseString = data.target.response;

    console.log("Response ");
    console.log(responseString);


    if (responseString[1] == 'o' && responseString[2] == 'k') {
        //this.PLAYER = (this.PLAYER + 1)%2 + 1;
        gameLoop.removeEliminatedPieces(responseString,5);
        var gameMove = new GameMove(gameLoop.scene.board, gameLoop.pickedPiece.id, gameLoop.pickedPiece.boardCell.id, gameLoop.pickedBoardCell.id,
            gameLoop.pickedPiece, gameLoop.pickedPiece.boardCell, gameLoop.pickedBoardCell, 0);
        
          
        console.log('Move is valid!');
        gameMove.execute();

        gameLoop.pickedPiece.picked = false;
        gameLoop.pickedBoardCell.picked = false;

        gameLoop.stackedMoves.push(gameMove);
        gameLoop.MAKING_MOVE = true;
        //this.PICKING_BOARD = false;
        gameLoop.scene.interface.removeCounter();
        gameLoop.counter = null;

        //this.END_GAME = (this.checkGameOver() || this.END_GAME);
                
        if (gameLoop.END_GAME) {
            console.log("End game");
            gameLoop.resetGameWithOptions();
        }
        return true;
    }
    else {
        console.log("Invalid move!");
        //this.PICKING_BOARD = false;
        //this.PICKING_PIECE = true;
        gameLoop.pickedPiece.picked = false;
        gameLoop.pickedBoardCell.picked = false;
        gameLoop.pickedPiece = null;
        gameLoop.pickedBoardCell = null;
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

        return splitEliminated;
    }
}

GameLoop.prototype.removeByPosition = function(positionString) {
    for (var i = 0; i < this.board.pieces.length; i++) {
        var boardId = this.board.pieces[i].boardCell.id;

        var destinationCell;

        if (boardId[5] == (""+ (8 - parseInt(positionString[1]))) && boardId[6] == (""+ (parseInt(positionString[3]) - 1))){
            console.log("Piece to be removed is ");
            console.log(this.board.pieces[i]);

            // Parsing the Id to see if it's red or black, to see to which aux we need to send him.
            var pieceNumberString = [];
            var pieceId = this.board.pieces[i].id;
            
            pieceNumberString[0] = pieceId[4];
            pieceNumberString[1] = pieceId[5];

            var pieceNumber = parseInt(pieceNumberString.join(""));
            
            if (this.board.pieces[i].id[0] == 'k') { // Is King
                console.log("END GAME");
                this.END_GAME = true;
            }   
            
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
            this.scene.setPickEnabled(false);
        }
        if(this.gameDifficulty !== null && this.gameType !== null){
            this.BEGIN_PHASE = false;
            this.GAME_LOOP = true;
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
        }
        if(this.pickedBoardCell !== null && this.pickedPiece !== null){
            this.WAITING = true;
            console.log('Waiting for Response');
            this.attemptMove();
            
        }
    }
    else if(this.WAITING) {

    }
    else if(this.MAKING_MOVE){
    }
    else if(this.END_GAME){
        console.log('End game');
        //make a scene to restart or not
        this.scene.updateCamera('Beggining');
    }
}

GameLoop.prototype.update = function(deltaTime) {
    var type;
    if(this.PLAYER === 0)
        type = this.player1Type;
    else
        type = this.player2Type;
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
    this.enableAndDisablePick();
    
    if(this.GAME_LOOP && (this.scene.cameraAnimation === null)){
        if((this.gameType === 1 || this.gameType === 2) && type === 1){
            this.updateAIMove(deltaTime);
        }
    }
}

GameLoop.prototype.updateAIMove = function(deltaTime) {
    if(this.currentMoveAI === null){
        var requestString = "[get_ai_move," + (this.PLAYER + 1) + "," + (this.gameDifficulty+1) +"]";
        var responseString = this.getPrologRequest(requestString, this.handleReplyUpdateAIMove, this);
    }
    else if(this.waitTimeAI <= 0){
        this.currentMoveAI.execute();
        this.stackedMoves.push(this.currentMoveAI);
        this.currentMoveAI = null;

        this.pickedPiece.picked = false;
        this.pickedBoardCell.picked = false;    

        this.MAKING_MOVE = true;
        this.scene.interface.removeCounter();
        this.waitTimeAI = 5;
    }
    else {
        this.waitTimeAI -= deltaTime;
    }
}

GameLoop.prototype.handleReplyUpdateAIMove = function(data, gameLoop){
    var responseString = data.target.response;

    console.log("Response ");
    console.log(responseString);

    gameLoop.currentMoveAI = this.AIStringToMove(responseString);

    if (gameLoop.currentMoveAI !== null) {
        if(gameLoop.attemptMove(gameLoop.currentMoveAI)){
            gameLoop.pickedPiece = gameLoop.currentMoveAI.piece;
            gameLoop.pickedBoardCell = gameLoop.currentMoveAI.cellDest;
            gameLoop.pickedPiece.picked = true;
            gameLoop.pickedBoardCell.picked = true; 
        }   
        else {
            gameLoop.currentMoveAI = null;
        }
    }
    else  // GAME OVER HERE
        gameLoop.END_GAME = true;
    
    return responseString;
}

GameLoop.prototype.enableAndDisablePick = function() {
    var type;
    if(this.PLAYER === 0)
        type = this.player1Type;
    else
        type = this.player2Type;
    if(this.gameType === 1 && type === 1)
        this.scene.setPickEnabled(false);
    else 
        this.scene.setPickEnabled(true);
}

GameLoop.prototype.resetGame = function() {
    this.stackedMoves = [];
    this.replayCurrentMove = 0;
    this.startedReplay = false;
    this.waitTime = 1;

    this.auxRedPosition = 0;
    this.auxWhitePosition = 0;

    this.BEGIN_PHASE = false;
    this.GAME_LOOP = true;
    this.PLAYER = 0;
    this.MAKING_MOVE = false;
    this.END_GAME = false;

    this.pickedPiece = null;
    this.pickedBoardCell = null;

    this.currentMoveAI = null;

    this.counter = null;
}

GameLoop.prototype.resetGameWithOptions = function() {
    this.stackedMoves = [];
    this.replayCurrentMove = 0;
    this.startedReplay = false;
    this.waitTime = 1;

    this.auxRedPosition = 0;
    this.auxWhitePosition = 0;

    this.BEGIN_PHASE = true;
    this.GAME_LOOP = false;
    this.PLAYER = 0;
    this.MAKING_MOVE = false;
    this.END_GAME = false;

    this.gameDifficulty = null; // 0 - facil, 1 - dificil
    this.gameType = null; // 0 - humano/humano, 1 - humano/maquina, 2 - maquina/maquina

    this.pickedPiece = null;
    this.pickedBoardCell = null;

    this.currentMoveAI = null;

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

