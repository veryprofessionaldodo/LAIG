var degToRad = Math.PI / 180.0;

function MyKing(scene){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.quad = new MyQuad(this.scene, "0 4 5 0");
    this.initBuffers();
}

MyKing.prototype = Object.create(CGFobject.prototype);
MyKing.prototype.constructor=MyKing;

MyKing.prototype.display = function () {
    this.scene.pushMatrix();
        this.scene.scale(0.5,1,0.5);

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
        this.scene.rotate(90*degToRad, 1, 0, 0);
        this.scene.scale(1, 1.25, 1);
        this.quad.display();
        this.scene.popMatrix();

    this.scene.popMatrix();

}