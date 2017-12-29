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
		this.displayNode(deltaTime, this.node.nodeID, this.node.textureID, this.node.materialID);
		this.scene.setActiveShader(this.scene.defaultShader);
	}
	else {
		this.displayNode(deltaTime, this.node.nodeID, this.node.textureID, this.node.materialID);
	}
}

PickableElement.prototype.displayNode = function(deltaTime, nodeID, textureID, materialID) {
	this.scene.pushMatrix();
	var node = this.scene.graph.nodes[nodeID];
	if(node.materialID !== "null"){
        materialID = node.materialID;
    }
    this.newMaterial = this.scene.graph.materials[materialID];
    //updates the texture
    if(node.textureID !== "null"){
        textureID = node.textureID;
    }
    if(textureID === "clear"){ //removes texture
        this.newTexture = null;
    } else if(textureID !== "null"){
        this.newTexture = this.scene.graph.textures[textureID];
    }
    //applies the materials and textures
    if(this.newMaterial != null){
        if(this.newTexture != null){
            this.newMaterial.setTexture(this.newTexture[0]);
            console.log(this.newTexture[0]);
        }
        else {
            this.newMaterial.setTexture(null);
        }
        this.newMaterial.apply();
    }
    //multiplies the matrixes
    this.scene.multMatrix(node.transformMatrix);

    node.display();

    if(node.leaves.length > 0){
        for(var i = 0; i < node.leaves.length; i++){
            node.leaves[i].displayLeaf(this.newTexture);
        }
    }
    if(node.children.length > 0){
        for(var i = 0; i < node.children.length; i++){
            this.scene.pushMatrix();
            this.newMaterial = null;
            this.newTexture = null;
            //recursive call
            this.displayNode(deltaTime, node.children[i], textureID, materialID);
            this.scene.popMatrix();
        }
    }
    this.scene.popMatrix();
}