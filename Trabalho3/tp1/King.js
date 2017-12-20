function King(scene, id, node, boardCell, x, y, z){
	Piece.call(this, scene);
	this.scene = scene;
	this.node = node;
	this.id = 'king'+id;
	this.boardCell = boardCell;

	this.x = x;
	this.y = y;
	this.z = z;
}

King.prototype = Object.create(King.prototype);
King.prototype.constructor = King;

King.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.translate(this.x,this.y,this.z);
	this.node.displayPiece();
	this.scene.popMatrix();
}