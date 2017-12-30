/**
	Contains information about the pawn piece. Contains its position, current board cell, texture and material ID
	and the its graph node. 
*/
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

/**
	Displays the node, updates the animation if there is one, and activates the shader if the pawn was picked
*/
Pawn.prototype.display = function(deltaTime) {
	if(this.animation !== null){
		if(this.animation.endAnimation){
			this.animation = null;
		}
		else
			this.matrix = this.animation.update(deltaTime);
	}

	var texture = this.scene.graph.textures[this.textureID];
	var material = this.scene.graph.materials[this.materialID];

	this.scene.pushMatrix();
	material.setTexture(texture[0]);
	material.apply();
	this.scene.multMatrix(this.matrix);
	if(this.picked)
		this.scene.setActiveShader(this.scene.pickedElement);
	this.node.displayPiece();
	this.scene.setActiveShader(this.scene.defaultShader);
	this.scene.popMatrix();
}
/**
	Creates a bezier animation that starts at the current position and ends on the chosen board cell position, and 
	updates its board cell to the new one
*/
Pawn.prototype.move = function(x,y,z, newBoardCell){
	this.boardCell = newBoardCell;

	var points = new Array();
	points.push([this.x, this.y, this.z]);
	points.push([this.x, this.y + 2, this.z]);
	points.push([x, this.y + 2, z]);
	points.push([x, this.y, z]);

	this.x = x;
	this.z = z;

	this.animation = new BezierAnimation(this.scene, 2, points);
}
/**
	Returns the pawn's current board cell
*/
Pawn.prototype.returnBoardCell = function() {
	return this.boardCell;
}