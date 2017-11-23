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
    this.currentAnimation = 0;
    this.animationFinalMatrix = [];

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
    if(this.animations.length === 0){
        return this.transformMatrix;
    }
    if(this.currentAnimation >= this.animations.length){
        this.graph.scene.multMatrix(this.animationFinalMatrix);
        return;
    }
    if(this.animations[this.currentAnimation].endAnimation === true){
        this.currentAnimation++;
    }
    if(this.currentAnimation >= this.animations.length){
        this.graph.scene.multMatrix(this.animationFinalMatrix);
        return;
    }

    var matrix = this.animations[this.currentAnimation].update(deltaTime);
    this.graph.scene.multMatrix(matrix);
    this.animationFinalMatrix = matrix.slice();
}
