function Pawn(scene, id, node, x, y, z){
	Piece.call(this, scene);
	this.scene = scene;
	this.node = node;
	this.id = id;

	this.x = x;
	this.y = y;
	this.z = z;
}

Pawn.prototype = Object.create(Pawn.prototype);
Pawn.prototype.constructor = Pawn;

Pawn.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.translate(this.x,this.y,this.z);
	this.node.displayPiece();
	this.scene.popMatrix();
}