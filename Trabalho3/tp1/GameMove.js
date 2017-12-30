/**
	Contains information about the piece to be moved, it's board cell and the board cell for which it is supposed
	to be moved
*/
function GameMove(board, pieceID, previousCellID, cellDestID, piece, previousCell, cellDest, outofBoard){
	this.board = board;
	this.pieceID = pieceID;
	this.cellDestID = cellDestID;
	this.previousCellID = previousCellID; 
	this.piece = piece;
	this.cellDest = cellDest;
	this.previousCell = previousCell;
	this.outofBoard = outofBoard;
}

GameMove.prototype = Object.create(GameMove.prototype);
GameMove.prototype.constructor = GameMove;
/**
	Executes the animation of the piece to the destination boardCell
*/
GameMove.prototype.execute = function(){
	this.piece.move(this.cellDest.x+0.5, this.cellDest.y, this.cellDest.z-0.35, this.cellDest);
}
/**
	Executes the animation of the piece to the destination boardCell, once in replay
*/		
GameMove.prototype.executeReplay = function() {
	var piece = this.board.findPiece(this.pieceID);
	piece.move(this.cellDest.x+0.5, this.cellDest.y, this.cellDest.z-0.35, this.cellDest);
}
/**
	Reverts the movement of the piece to it's previous position
*/
GameMove.prototype.reverse = function() {
	
	this.piece.move(this.previousCell.x+0.5, this.previousCell.y, this.previousCell.z-0.35, this.previousCell);
}
/**
	Returns true if the piece animation is over
*/
GameMove.prototype.isAnimationOver = function() {
	return (this.board.findPiece(this.pieceID).animation === null);
}