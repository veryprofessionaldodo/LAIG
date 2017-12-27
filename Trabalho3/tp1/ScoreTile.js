var degToRad = Math.PI / 180.0;

function BoardCell(scene, id, x, y, z){
	this.scene = scene;
	this.id = id;

	this.quad = new MyQuad(this.scene, "0 4 5 0");
	this.piece = null;
	this.picked = false;

	this.x = x;
	this.y = y;
	this.z = z;
}

BoardCell.prototype = Object.create(BoardCell.prototype);
BoardCell.prototype.constructor = BoardCell;

BoardCell.prototype.display = function(deltaTime) {
	this.scene.pushMatrix();
	this.scene.translate(this.x,this.y,this.z);
	this.scene.rotate(90*degToRad, 0, 1, 0);
	//this.scene.scale(0.2,0.2,0.15);
	this.quad.display();
	this.scene.popMatrix();
}