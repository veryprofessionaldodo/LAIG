/**
	Keeps the pieces and boardCells used in the game
*/
function GameBoard(scene){
	Board.call(this, scene);
	this.scene = scene;
	this.pieces = new Array();
	this.boardCells = new Array();
}

GameBoard.prototype = Object.create(Board.prototype);
GameBoard.prototype.constructor = GameBoard;

/**
	Resets the pieces and boardCells arrays
*/
GameBoard.prototype.resetElements = function(){
	this.pieces = [];
	this.boardCells = [];
}
/**
	Returns the piece with the wanted id
*/
GameBoard.prototype.findPiece = function(id){
	for(var i = 0; i < this.pieces.length; i++){
		if(this.pieces[i].id === id){
			return this.pieces[i];
		}
	}
}
