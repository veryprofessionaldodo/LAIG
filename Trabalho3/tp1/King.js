function King(scene, id, node, boardCell, x, y, z){
	Piece.call(this, scene);
	this.scene = scene;
	this.node = node;
	this.id = 'king'+id;
	this.boardCell = boardCell;

	this.x = x;
	this.y = y;
	this.z = z;

	this.matrix = mat4.create();
	mat4.identity(this.matrix);
	mat4.translate(this.matrix, this.matrix, [this.x, this.y, this.z]);

	this.animation = null;
}

King.prototype = Object.create(King.prototype);
King.prototype.constructor = King;

King.prototype.display = function(deltaTime) {
	if(this.animation !== null){
		if(this.animation.endAnimation === true){
			this.animation = null;
		}
		else
			this.matrix = this.animation.update(deltaTime).slice();
	}

	this.scene.pushMatrix();
	this.scene.multMatrix(this.matrix);
	//this.scene.translate(this.x,this.y,this.z);
	this.node.displayPiece();
	this.scene.popMatrix();
}

King.prototype.move = function(x,y,z){
	var points = new Array();
	points.push([this.x, this.y, this.z]);
	points.push([this.x, this.y + 10, this.z]);
	points.push([x, this.y + 10, z]);
	points.push([x, this.y, z]);

	this.animation = new BezierAnimation(this.scene, 5, points);
}

King.prototype.returnBoardCell = function() {
	return this.boardCell;
}