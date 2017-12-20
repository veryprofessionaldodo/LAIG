var NUM_PAWNS_PLAYER = 10;
var NUM_KINGS_PLAYER = 1; 

function Board(scene){
	this.scene = scene;
	this.pieces = new Array();
	this.boardCells = new Array();
	this.gameMoves = new Array();
}

Board.prototype = Object.create(Board.prototype);
Board.prototype.constructor = Board;