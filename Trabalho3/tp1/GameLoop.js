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
            console.log("Boards are ");
            console.log(this.auxWhiteBoard);
            console.log(this.auxRedBoard);

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

            }

            var eliminationMove = new GameMove(this.scene, this.board.pieces[i], destinationCell, 1);
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