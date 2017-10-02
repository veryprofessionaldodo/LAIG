function MyCylinder(scene, args/*slices, stacks*/) {
    CGFobject.call(this,scene);
   	var values = args.split(" ");
	for(var i = 0; i < values.length; i++){
		values[i] = parseInt(values[i]);
	}

	this.height = values[0];
    this.slices = values[4];
    this.stacks = values[3];
    this.topRadius = values[2];
    this.bootomRadius = values[1];
 
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
 	indice = 0;

 	for(var s = 0; s <= this.height*this.stacks; s++)
	{
		this.vertices.push(1, 0, s / this.stacks);
		this.normals.push(1, 0, 0);
		this.texCoords.push(0, s / this.stacks);
		indice += 1;

		for(i = 1; i <= this.slices; i++)
		{
			last += angle;
			this.vertices.push(this.topRadius*Math.cos(last), this.topRadius*Math.sin(last), s / this.stacks);
			this.normals.push(this.topRadius*Math.cos(last), this.topRadius*Math.sin(last), 0);
			this.texCoords.push(i / this.slices, s / this.stacks);
			indice++;

			if(s > 0 && i > 0)
			{
				this.indices.push(indice-1, indice-2, indice-this.slices-2);
				this.indices.push(indice-this.slices-3, indice-this.slices-2, indice-2);
			}
		}
		last = 0;
	}
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};