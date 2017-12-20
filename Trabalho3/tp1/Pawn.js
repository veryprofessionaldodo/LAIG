function Pawn(scene, id, node, boardCell, x, y, z){
	Piece.call(this, scene);
	this.scene = scene;
	this.node = node;
	this.id = 'pawn'+id;
	this.boardCell = boardCell;

	this.x = x;
	this.y = y;
	this.z = z;

	this.matrix = mat4.create();
	mat4.identity(this.matrix);
	mat4.translate(this.matrix, this.matrix, [this.x, this.y, this.z]);

	this.animation = null;
}

Pawn.prototype = Object.create(Pawn.prototype);
Pawn.prototype.constructor = Pawn;

Pawn.prototype.display = function(deltaTime) {
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

Pawn.prototype.move = function(x,y,z){
	console.log('a: ' + this.x + ' ' + this.y + ' ' + this.z);
	console.log('dest: ' + x + ' ' + y + ' ' + z);
	var points = new Array();
	points.push([this.x, this.y, this.z]);
	points.push([this.x, this.y + 10, this.z]);
	points.push([x, this.y + 10, z]);
	points.push([x, this.y, z]);

	this.animation = new BezierAnimation(this.scene, 5, points);
}

Pawn.prototype.returnBoardCell = function() {
	return this.boardCell;
}