/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, args) {
    CGFobject.call(this,scene);
   	var values = args.split(" ");
	for(var i = 0; i < values.length; i++){
		values[i] = parseFloat(values[i]);
	}

	this.radius = values[0];
    this.slices = values[2];
    this.stacks = values[1];
 
    this.initBuffers();
 };
 
 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;
 
 MySphere.prototype.initBuffers = function() {
 
    var angle = Math.PI/this.stacks;
    var angle2 = 2*Math.PI/this.slices;

    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];
	this.tempTexCoords = [];
 	indice = 0;
 	var last = 0;
 	var last2 = 0;

 	for(var i = 0; i <= this.stacks; ++i){
 		for(var j = 0; j <= this.slices; ++j){
 			this.vertices.push(this.radius*Math.sin(angle*i)*Math.cos(angle2*j), this.radius*Math.sin(angle*i)*Math.sin(angle2*j), this.radius*Math.cos(angle * i));
 			this.normals.push(Math.sin(angle*i)*Math.cos(angle2*j), Math.sin(angle*i)*Math.sin(angle2*j),Math.cos(angle * i));
 			this.tempTexCoords.push(j/this.slices, 1 - i/this.stacks);
 		}
 	}
 	for(var i = 0; i < this.stacks; ++i){
 		for(var j = 0; j < this.slices; ++j){
 			this.indices.push(i*(this.slices + 1) + j, (i + 1)*(this.slices + 1) + j, (i + 1)*(this.slices + 1) + j + 1);
 			this.indices.push(i*(this.slices + 1) + j, (i + 1)*(this.slices + 1) + j + 1, i * (this.slices + 1) + j + 1);	
 		}
 	}

 	this.texCoords = this.tempTexCoords.slice();

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };