var degToRad = Math.PI / 180.0;

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
/*
AuxBoardCell.prototype.display = function(deltaTime) {
	this.scene.pushMatrix();
	this.scene.translate(this.x,this.y,this.z);
	this.scene.rotate(-90*degToRad, 1, 0, 0);
	this.scene.scale(0.15,0.15,0.15);
	this.quad.display();
	this.scene.popMatrix();
}*/