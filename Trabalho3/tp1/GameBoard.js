function GameBoard(scene){
	Board.call(this, scene);
	this.scene = scene;
	this.pieces = new Array();
	this.boardCells = new Array();
	//this.gameMoves = new Array();
}

GameBoard.prototype = Object.create(Board.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.resetElements = function(){
	this.pieces = [];
	this.boardCells = [];
}

GameBoard.prototype.findPiece = function(id){
	for(var i = 0; i < this.pieces.length; i++){
		if(this.pieces[i].id === id){
			return this.pieces[i];
		}
	}
}

GameBoard.prototype.findCell = function(id){
	for(var i = 0; i < this.boardCells.length; i++){
		if(this.boardCells[i].id === id){
			return this.boardCells[i];
		}
	}
}

GameBoard.prototype.moveToInitPieces = function() {
	var x = -4.5, y = 5.2, z = -3.1;
	for(var i = 0; i < 10; i++){
		this.pieces[i].boardCell = this.boardCells[i];
		this.pieces[i].x = x;
		this.pieces[i].y = y;
		this.pieces[i].z = z;
		x += 1;
	}
	var boardCellsInd = this.boardCells.length - 10;
	x = -4.5; z = 2.5;
	for(var i = 10; i < 20; i++){
		this.pieces[i].boardCell = this.boardCells[boardCellsInd];
		this.pieces[i].x = x;
		this.pieces[i].y = y;
		this.pieces[i].z = z;
		x += 1;
	}
	this.pieces[this.pieces.length - 2].x = 0.5;
	this.pieces[this.pieces.length - 2].y = 5.5;
	this.pieces[this.pieces.length - 2].z = -2.25;

	this.pieces[this.pieces.length - 2].x = 1.5;
	this.pieces[this.pieces.length - 2].y = 5.5;
	this.pieces[this.pieces.length - 1].z = 1.75;
}