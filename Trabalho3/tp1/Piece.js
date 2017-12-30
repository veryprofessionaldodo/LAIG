/**
	Mother class of King a Pawn classes
*/
function Piece(scene){
	this.scene = scene;
}

Piece.prototype.display = function(){};

Piece.prototype.move = function(x,y,z, newBoardCell){};

Piece.prototype.returnBoardCell = function() {};
