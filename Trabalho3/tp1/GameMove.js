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

GameMove.prototype.execute = function(){
	this.piece.move(this.cellDest.x+0.5, this.cellDest.y, this.cellDest.z-0.35, this.cellDest);
}

GameMove.prototype.executeReplay = function() {
	var cellDest = this.board.findCell(this.cellDestID);
	var piece = this.board.findPiece(this.pieceID);
	piece.move(cellDest.x+0.5, cellDest.y, cellDest.z-0.35, cellDest);
}

GameMove.prototype.reverse = function() {
	
	this.piece.move(this.previousCell.x+0.5, this.previousCell.y, this.previousCell.z-0.35, this.previousCell);
}

GameMove.prototype.isAnimationOver = function() {
	return (this.board.findPiece(this.pieceID).animation === null);
}