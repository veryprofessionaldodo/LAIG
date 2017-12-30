var degToRad = Math.PI / 180.0;
/**
	Board Cell of the auxiliary boards. Keeps the piece information and the ut's position
*/
function AuxBoardCell(scene, id, x, y, z){
	this.scene = scene;
	this.id = id;

	this.quad = new MyQuad(this.scene, "0 4 5 0");
	this.piece = null;
	this.picked = false;

	this.x = x;
	this.y = y;
	this.z = z;
}

AuxBoardCell.prototype = Object.create(AuxBoardCell.prototype);
AuxBoardCell.prototype.constructor = AuxBoardCell;