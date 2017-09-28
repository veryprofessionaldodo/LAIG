function MyCylinder(scene) {
    CGFobject.call(this,scene);

  
};

MyCylinder.prototype
MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;


MyCylinder.prototype.setParams = function(values) {
	this.height = values[0];
	this.bottomRadius = values[1];
	this.topRadius = values[2];
	this.stacks = values[3];
	this.slices = values[4];

	this.initBuffers();
}

MyCylinder.prototype.initBuffers = function() {
 	var angle = (2*Math.PI)/this.slices;
 	var last = 0;

    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];
 	indice = 0;

 	for(s = 0; s <= this.stacks; s++)
	{
		this.vertices.push(1, 0, s / this.stacks);
		this.normals.push(1, 0, 0);
		this.texCoords.push(0, s / this.stacks);
		indice += 1;

		// TODO USAR AQUI BOTTOM RADIUS E TOP RADIUS 

		for(i = 1; i <= this.slices; i++)
		{
			last += angle;
			this.vertices.push(Math.cos(last), Math.sin(last), s / this.stacks);
			this.normals.push(Math.cos(last), Math.sin(last), 0);
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