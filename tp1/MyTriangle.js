function MyTriangle(scene, args/*minS,maxS,minT,maxT*/) {
	CGFobject.call(this,scene);
	/*this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;*/

	this.initBuffers(args);
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function (args) {
	var values = args.split(" ");
	for(var i = 0; i < values.length; i++){
		values[i] = parseInt(values[i]);
	}
	this.vertices = values;
	this.indices = [
 		0, 1, 2,
 	];
 	this.normals = [
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
    ];

    //por agora
    this.texCoords = [
		0, 1,
		1, 1,
		0, 0,
		1, 0
    ];

	/*
	  this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
	  ];
*/
	this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};