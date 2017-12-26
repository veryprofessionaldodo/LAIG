function GameMove(scene, piece, cellDest, outofBoard){
	this.scene = scene;
	this.piece = piece;
	this.cellDest = cellDest;
	this.outofBoard = outofBoard;
}

GameMove.prototype = Object.create(GameMove.prototype);
GameMove.prototype.constructor = GameMove;

GameMove.prototype.execute = function(){
	this.piece.move(this.cellDest.x+0.5, this.cellDest.y, this.cellDest.z-0.35, this.cellDest);
}