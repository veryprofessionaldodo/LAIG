/**
	Keeps the pieces that have been taken from the game board. 
*/
function AuxBoard(scene, z){
	Board.call(this, scene);
	this.scene = scene;
	this.pieces = new Array();
	this.boardCells = new Array();
	this.z = z+0.4;

	this.initBoard();
}

AuxBoard.prototype = Object.create(Board.prototype);
AuxBoard.prototype.constructor = AuxBoard;
/**
	Init the auxiliar board cells that will keep the pieces
*/
AuxBoard.prototype.initBoard = function() {
	var x = -1.5, y = 5.15, z = this.z;
	for(var i = 0; i < 2; i++){
		for(var j = 0; j < 5; j++){
			var boardCell = new AuxBoardCell(this.scene, 'AuxBoard'+i+''+j, x, y, z);
			this.boardCells.push(boardCell);
			x += 0.8;
		}
		x = -1.5, z += 1;
	}
}