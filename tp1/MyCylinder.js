function MyCylinder(scene, args) {
    CGFobject.call(this,scene);
	this.scene = scene;

	this.height = args[0];
    this.slices = args[4];
    this.stacks = args[3];
    this.topRadius = args[2];
    this.bottomRadius = args[1];

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
 	var angle = (2*Math.PI)/this.slices;
 	var last = 0;

    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];
	this.tempTexCoords = [];
 	indice = 0;

 	var diff = this.bottomRadius - this.topRadius;
 	var inc = 0;

 	if(diff > 0) {
 		inc = - (diff/(this.height*this.stacks));
 	} else if(diff < 0) {
 		inc = (Math.abs(diff)/(this.height*this.stacks));
 	}
 	var radius = this.bottomRadius;

 	for(var s = 0; s <= this.height*this.stacks; s++)
	{	
		this.vertices.push(radius, 0, s / this.stacks);
		this.normals.push(1, 0, 0);
		this.texCoords.push(0, s / (this.height*this.stacks));
		indice += 1;

		for(i = 1; i <= this.slices; i++)
		{	
			last += angle;
			this.vertices.push(radius*Math.cos(last), radius*Math.sin(last), s / this.stacks);
			this.normals.push(radius*Math.cos(last), radius*Math.sin(last), 0);
			this.texCoords.push(i / this.slices, s / (this.height*this.stacks));
			indice++;

			if(s > 0 && i > 0)
			{
				this.indices.push(indice-1, indice-2, indice-this.slices-2);
				this.indices.push(indice-this.slices-3, indice-this.slices-2, indice-2);
			}
		}
		last = 0;
		radius += inc;
	}
	this.tempTexCoords = this.texCoords.slice();
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};