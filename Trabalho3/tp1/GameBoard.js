function GameBoard(scene){
	Board.call(this, scene);
	this.scene = scene;
	this.pieces = new Array();
	this.boardCells = new Array();
	//this.gameMoves = new Array();
}

GameBoard.prototype = Object.create(Board.prototype);
GameBoard.prototype.constructor = GameBoard;