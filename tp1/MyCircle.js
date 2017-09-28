function MyCircle(scene, slices) {
	CGFobject.call(this,scene);
	  this.slices = slices;
	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor=MyCircle;

MyCircle.prototype.initBuffers = function () {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    var last = 0;
    var angle = (2*Math.PI)/this.slices;

    this.vertices.push(0,0,0);
    this.normals.push(0,0,1);
    this.texCoords.push(0.5,0.5);
    for(var i = 0; i < this.slices; i++){
        this.vertices.push(Math.cos(last),Math.sin(last),0);
        this.indices.push(i, i+1, 0);   
        this.normals.push(0,0,1);
        this.texCoords.push(0.5+0.5*Math.cos(last),0.5-0.5*Math.sin(last));
        last += angle;
    }
    this.indices.push(this.slices, 1, 0);
    this.initGLBuffers();
}