function MyTriangle(scene,minS,maxS,minT,maxT) {
	CGFobject.call(this,scene);
	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.setParams = function(values) {
	// Extract values from string
	this.vertices = [];
	var index = 0;
	var tmpString = '';
	var floor = Math.floor; // Used to convert string to int
	var i = 0;
	console.log(tmpString);
	while(i < 9) {
		console.log(tmpString);
		if(values[i] === ' ') { // If it is a space
			this.vertices[index] = parseInt(tmpString);
			index = index + 1;
		}
		tmpString = tmpString + values[i];
		i++;
	}
	console.log(values);
	console.log(this.vertices[0]);
	console.log(this.vertices[1]);
	console.log(this.vertices[2]);
	console.log(this.vertices[3]);
	console.log(this.vertices[4]);
	console.log(this.vertices[5]);
	console.log(this.vertices[6]);
	console.log(this.vertices[7]);
	console.log(this.vertices[8]);

	

 	this.indices = [
 		0, 1, 2,
 	];

	 this.normals = [
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
      ];

      this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
      ];

	this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers(); 
}

MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
 		-0.5, -0.5, 0,
 		0.5, -0.5, 0,
 		-0.5, 0.5, 0,
 	];

 	this.indices = [
 		0, 1, 2,
 	];

	 this.normals = [
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
      ];

      this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
      ];

	this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};