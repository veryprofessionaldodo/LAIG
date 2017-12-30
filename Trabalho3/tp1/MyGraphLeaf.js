/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

function MyGraphLeaf(graph, type, args) {
	this.graph = graph;
	this.type = type;
	this.args = args;
	this.obj = null;

	if(this.type === 'patch'){
		this.obj = new MyPatch(this.graph.scene, this.args);
	} 
	else if(this.type === 'triangle'){
		this.obj = new MyTriangle(this.graph.scene,this.args);
	} 
	else if(this.type === 'rectangle') {
		this.obj = new MyQuad(this.graph.scene,this.args);
	} 
	else if(this.type === 'cylinder') {
		this.obj = new MyCylinderWithCap(this.graph.scene,this.args);
	} 
	else if(this.type === 'sphere') {
		this.obj = new MySphere(this.graph.scene,this.args);
	}
	else if(this.type === 'pawn_primitive'){
		this.obj = new MyPawn(this.graph.scene);
	}
	else if(this.type === 'king_primitive'){
		this.obj = new MyKing(this.graph.scene);
	}
}
/**
	Displays the primitive 
*/
MyGraphLeaf.prototype.displayLeaf = function(texture) {
	if(texture != null && (this.type === 'triangle' || this.type === 'rectangle')){
		this.obj.updateTexCoords(texture[1], texture[2]); //updates the textures according to the amp factors
	}
	this.obj.display();
}

