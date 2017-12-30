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

    // if this node is a piece model or a pickable item
    this.pieceNode = false;

    // The Animations.
    this.animation = null;
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
/**
    If the node is a model of a piece, displays its leaf
*/
MyGraphNode.prototype.displayPiece = function() {
    this.graph.scene.multMatrix(this.transformMatrix);
    for(var i = 0; i < this.leaves.length; i++){
        this.leaves[i].displayLeaf(this.graph.textures[this.textureID]);
    }
}

