/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
    this.graph = graph;
    this.xmlelem = xmlelem;
}

function displayLeaf() {
    if(this.xmlelem.type === "rectangle"){
        console.log("HALO");
        var obj = new MyUnitCubeQuad(this.scene);
        obj.display();
    }
}

