function MyTriangle(scene, args) {
	CGFobject.call(this,scene);
	this.initBuffers(args);
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function (args) {
	values = args.split(" ");
	for(var i = 0; i < values.length; i++){
		values[i] = parseFloat(values[i]);
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
	this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function(ampS, ampT) {
	var x3 = this.vertices[0],
		y3 = this.vertices[1],
		z3 = this.vertices[2],
		x2 = this.vertices[3],
		y2 = this.vertices[4],
		z2 = this.vertices[5],
		x1 = this.vertices[6],
		y1 = this.vertices[7],
		z1 = this.vertices[8];

	var a = Math.sqrt(Math.pow((x1-x3),2) + Math.pow((y1-y3),2) + Math.pow((z1-z3),2));
	var b = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2) + Math.pow((z2-z1),2));
	var c = Math.sqrt(Math.pow((x3-x2),2) + Math.pow((y3-y2),2) + Math.pow((z3-z2),2));

	//var angBC = Math.acos((-Math.pow(a,2) + Math.pow(b,2) + Math.pow(c,2))/(2*b*c));
	var angAC = Math.acos((Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2))/(2*a*c));
	//var angBA = Math.acos((Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2))/(2*a*b));

	//var p0x = c - a*Math.cos(angAC);
	var p0y = a*Math.sin(angAC);

	this.texCoords = [
		0, p0y/ampT,
		c/ampS, p0y/ampT,
		0, 0,
		c/ampS, 0
	];
	this.updateTexCoordsGLBuffers();
}