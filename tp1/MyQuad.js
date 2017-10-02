 /**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor 
 */
function MyQuad(scene, args/*minS,maxS,minT,maxT*/) {
	CGFobject.call(this,scene);
	/*
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;
	*/
	this.initBuffers(args);
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function (args) {
	var values = args.split(" ");
	for(var i = 0; i < values.length; i++){
		values[i] = parseInt(values[i]);
	}
	this.vertices = [
		values[0], values[3], 0, //bottom right
		values[2], values[3], 0, 
		values[0], values[1], 0,
		values[2], values[1], 0
	];

 	this.indices = [
 		0, 1, 2,
 		1, 3, 2
 	];

 	this.primitiveType = this.scene.gl.TRIANGLES;

    this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
    ];

    //por agora
    this.texCoords = [
		0, 1,
		1, 1,
		0, 0,
		1, 0
    ];
    /*this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
      ];*/
    this.initGLBuffers();
};