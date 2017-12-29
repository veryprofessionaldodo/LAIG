var degToRad = Math.PI / 180.0;

function PickableElement(scene, node){
	this.scene = scene;
	this.node = node;
	this.id = this.node.nodeID;
	this.picked = false;

	this.newTexture = null;
	this.newMaterial = null;
}

PickableElement.prototype = Object.create(PickableElement.prototype);
PickableElement.prototype.constructor = PickableElement;

PickableElement.prototype.display = function(deltaTime) {
	if(this.picked){
		this.scene.setActiveShader(this.scene.pickedElement);
		this.newMaterial = this.scene.graph.materials[this.node.materialID];
		this.newTexture = this.scene.graph.textures[this.node.textureID];
		this.newMaterial.setTexture(this.newTexture[0]);
		this.newMaterial.apply();
		this.displayNode(deltaTime, this.node.nodeID);
		this.scene.setActiveShader(this.scene.defaultShader);
	}
	else {
		this.newMaterial = this.scene.graph.materials[this.node.materialID];
		this.newTexture = this.scene.graph.textures[this.node.textureID];
		this.newMaterial.setTexture(this.newTexture[0]);
		this.newMaterial.apply();
		this.displayNode(deltaTime, this.node.nodeID);
	}
}

PickableElement.prototype.displayNode = function(deltaTime, nodeID) {
	this.scene.pushMatrix();
	var node = this.scene.graph.nodes[nodeID];
    //multiplies the matrixes
    this.scene.multMatrix(node.transformMatrix);

    if(node.leaves.length > 0){
        for(var i = 0; i < node.leaves.length; i++){
            node.leaves[i].displayLeaf(this.newTexture);
        }
    }
    if(node.children.length > 0){
        for(var i = 0; i < node.children.length; i++){
            this.scene.pushMatrix();
            //recursive call
            this.displayNode(deltaTime, node.children[i]);
            this.scene.popMatrix();
        }
    }
    this.scene.popMatrix();
}