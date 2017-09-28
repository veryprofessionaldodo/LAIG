var degToRad = Math.PI / 180.0;

function MyTrap(scene){
    CGFobject.call(this,scene);
    this.scene = scene;
	
    this.prism = new MyUnitCubeQuad(this.scene);
    this.tri = new MyTriangularBase(this.scene);


    this.initBuffers();
}

MyTrap.prototype = Object.create(CGFobject.prototype);
MyTrap.prototype.constructor=MyTrap;

MyTrap.prototype.display = function () {
    
    this.scene.pushMatrix();
    	this.scene.translate(0,0,0.22);
    	this.scene.scale(0.1,1.64,0.4);
        this.prism.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,0,0.22);
        this.scene.translate(0,0.995,0);
    	this.scene.rotate(90*degToRad,0,1,0);
    	this.scene.scale(0.4,0.35,0.1);
		this.tri.display();
    this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0,0,0.22);
        this.scene.translate(0,-0.995,0);
    	this.scene.rotate(90*degToRad,0,1,0);
    	this.scene.rotate(180*degToRad,1,0,0);
    	this.scene.scale(0.4,0.35,0.1);
		this.tri.display();
    this.scene.popMatrix();
}