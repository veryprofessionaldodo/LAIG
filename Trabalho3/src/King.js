/**
	Contains information about the king piece. Contains its position, current board cell, texture and material ID
	and the its graph node. 
*/
function King(scene, id, node, boardCell, x, y, z, texture, material){
	Piece.call(this, scene);
	this.scene = scene;
	this.node = node;
	this.id = 'king'+id;
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

King.prototype = Object.create(King.prototype);
King.prototype.constructor = King;

/**
	Displays the node, updates the animation if there is one, and activates the shader if the king was picked
*/
King.prototype.display = function(deltaTime) {
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
King.prototype.move = function(x,y,z, newBoardCell){
	this.boardCell = newBoardCell;

	var points = new Array();
	points.push([this.x, this.y, this.z]);
	points.push([this.x, this.y + 4, this.z]);
	points.push([x, this.y + 4, z]);
	points.push([x, this.y, z]);

	this.x = x;
	this.z = z;

	this.animation = new BezierAnimation(this.scene, 3, points);
}
/**
	Returns the king's current board cell
*/
King.prototype.returnBoardCell = function() {
	return this.boardCell;
}