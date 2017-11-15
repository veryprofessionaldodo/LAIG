/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;
    
    // IDs of child nodes.
    this.children = [];

    // IDs of child nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    // The Animations ID.
    this.animations = [];

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}

MyGraphNode.prototype.display = function(deltaTime) {
    console.log('MyGraphNode Update');
    for(var i = 0; i < this.animations.length; i++){
        var matrix = this.animations[i].update(deltaTime);
      //  this.graph.scene.pushMatrix();
        this.graph.scene.multMatrix(matrix);
       // this.graph.scene.popMatrix();
        /*var matrix = this.animations[i].update(deltaTime);
        console.log(matrix);
        mat4.multiply(this.transformMatrix, this.transformMatrix, matrix);
        console.log(this.transformMatrix);*/
    }
    /*if(this.leaves.length > 0){
        for(var i = 0; i < this.leaves.length; i++){
            this.leaves[i].displayLeaf(texture);
        }
    }*/
}

/*
MyGraphNode.prototype.display = function(currTime){
    console.log(currTime);
    for(var i = 0; i < this.animations.length; i++){
            var matrix = this.animations[i].update(currTime);
            this.graph.scene.multMatrix(matrix);
    }
}*/