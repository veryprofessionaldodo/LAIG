var NUM_PAWNS_PLAYER = 10;
var NUM_KINGS_PLAYER = 1; 

function Board(scene){
	this.scene = scene;
}

Board.prototype = Object.create(Board.prototype);
Board.prototype.constructor = Board;