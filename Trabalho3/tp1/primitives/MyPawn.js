var degToRad = Math.PI / 180.0;
/**
    Primitive of the pawn piece
*/
function MyPawn(scene){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.quad = new MyQuad(this.scene, "0 4 5 0");
    this.cylinder = new MyCylinder(this.scene, [30, 1, 1, 30, 30]);
    this.sphere = new MySphere(this.scene,"2 10 10");
    this.initBuffers();
}

MyPawn.prototype = Object.create(CGFobject.prototype);
MyPawn.prototype.constructor=MyPawn;
/**
    Displays the primitive
*/
MyPawn.prototype.display = function () {
    this.scene.pushMatrix();
        this.scene.scale(0.53,0.12,0.53);
        this.scene.translate(0,-5,0);
        
        this.scene.pushMatrix();
        this.scene.translate(-2.5,-2.5,2.5);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.5,-2.5,-2.5);
        this.scene.rotate(-90*degToRad, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.5,-2.5,2.5);
        this.scene.rotate(90*degToRad, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.5,-2.5,-2.5);
        this.scene.rotate(180*degToRad, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-90*degToRad, 1, 0, 0);
        this.scene.translate(-2.5,-2.5,1.5);
        this.scene.scale(1, 1.25, 1);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.5,-2.5,-2.5);
        
        this.scene.scale(1, 1.25, 1);
        this.quad.display();
        this.scene.popMatrix();

        
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
        this.scene.scale(0.5,0.5,0.5);
    
        // Middle bar 
        this.scene.pushMatrix();
            this.scene.rotate(90*degToRad, 1, 0, 0);
            this.scene.translate(0,0,-3.1);
            this.scene.scale(1.1, 1.1, 4);
            this.cylinder.display();
        this.scene.popMatrix();        

        // Top
        this.scene.pushMatrix();
            this.scene.rotate(90*degToRad, 1, 0, 0);
            this.scene.translate(0,0,-3.1);
            this.scene.scale(0.9, 0.9, 0.9);
            this.sphere.display();
        this.scene.popMatrix();        
    this.scene.popMatrix(); 
}