 /**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor 
 */
function MyQuad(scene, args) {
	CGFobject.call(this,scene);
	this.initBuffers(args);
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function (args) {
	this.values = args.split(" ");
	for(var i = 0; i < this.values.length; i++){
		this.values[i] = parseFloat(this.values[i]);
	}
	this.vertices = [
		this.values[0], this.values[3], 0, //bottom left
		this.values[2], this.values[3], 0, //bottom right
		this.values[0], this.values[1], 0, //top left
		this.values[2], this.values[1], 0  //top right
	];

 	this.indices = [
 		0, 1, 2,
 		3, 2, 1
 	];

 	this.primitiveType = this.scene.gl.TRIANGLES;

    this.normals = [
	    0, 0, 1,
	    0, 0, 1,
	    0, 0, 1,
	    0, 0, 1
    ];

    this.texCoords = [
		0, 1,
		1, 1,
		0, 0,
		1, 0
    ];
    this.initGLBuffers();
};

MyQuad.prototype.updateTexCoords = function(ampS, ampT) {
	var deltaX = this.values[2] - this.values[0];
	var deltaY = this.values[1] - this.values[3];
	this.texCoords = [
		0, deltaY/ampT,
		deltaX/ampS, deltaY/ampT,
		0, 0,
		deltaX/ampS, 0
    ];
	this.updateTexCoordsGLBuffers();
}