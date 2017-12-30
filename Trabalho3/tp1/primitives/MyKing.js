var degToRad = Math.PI / 180.0;

/**
    Primitive of the king piece
*/
function MyKing(scene){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.quad = new MyQuad(this.scene, "0 4 5 0");
    this.initBuffers();
}

MyKing.prototype = Object.create(CGFobject.prototype);
MyKing.prototype.constructor=MyKing;
/**
    Displays the primitive
*/
MyKing.prototype.display = function () {
    this.scene.pushMatrix();
        this.scene.translate(-0,-0.9,-0.3);
        this.scene.scale(0.5,0.2,0.5);

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

    this.scene.pushMatrix();
        this.scene.translate(-0,0,-0.3);
        this.scene.scale(0.3,0.7,0.3);

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

    this.scene.pushMatrix();
        this.scene.translate(-0,1.2,-0.3);
        this.scene.scale(0.4,0.2,0.4);

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