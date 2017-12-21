function Pawn(scene, id, node, boardCell, x, y, z, texture, material){
	Piece.call(this, scene);
	this.scene = scene;
	this.node = node;
	this.id = 'pawn'+id;
	this.boardCell = boardCell;
	this.picked = false;

	this.x = x;
	this.y = y;
	this.z = z;
	this.materialID = material;
	this.textureID = texture;

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

	var texture = this.scene.graph.textures[this.textureID];
	var material = this.scene.graph.materials[this.materialID];

	this.scene.pushMatrix();
	material.setTexture(texture[0]);
	material.apply();
	this.scene.multMatrix(this.matrix);
	//this.scene.translate(this.x,this.y,this.z);
	if(this.picked)
		this.scene.setActiveShader(this.scene.pickedElement);
	this.node.displayPiece();
	this.scene.setActiveShader(this.scene.defaultShader);
	this.scene.popMatrix();
}

Pawn.prototype.move = function(x,y,z){
	console.log('a: ' + this.x + ' ' + this.y + ' ' + this.z);
	console.log('dest: ' + x + ' ' + y + ' ' + z);
	var points = new Array();
	points.push([this.x, this.y, this.z]);
	points.push([this.x, this.y + 4, this.z]);
	points.push([x, this.y + 4, z]);
	points.push([x, y, z]);

	this.animation = new BezierAnimation(this.scene, 5, points);
}

Pawn.prototype.returnBoardCell = function() {
	return this.boardCell;
}