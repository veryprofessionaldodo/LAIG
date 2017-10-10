var degToRad = Math.PI / 180.0;

function MyCylinderWithCap(scene, args){
    CGFobject.call(this,scene);
    this.scene = scene;

    var values = args.split(" ");
    for(var i = 0; i < values.length; i++){
        values[i] = parseFloat(values[i]);
    }
    this.scene = scene;

    this.height = values[0];
    this.slices = values[4];
    this.stacks = values[3];
    this.topRadius = values[2];
    this.bottomRadius = values[1];
    this.topCap = values[5];
    this.bottomCap = values[6];

    this.cylinderArgs = [this.height, this.bottomRadius, this.topRadius, this.stacks, this.slices];

    this.cylinder = new MyCylinder(this.scene, this.cylinderArgs);
    this.bottomCircle = new MyCircle(this.scene, this.slices, this.bottomRadius);
    this.topCircle = new MyCircle(this.scene, this.slices, this.topRadius);
    this.initBuffers();
}

MyCylinderWithCap.prototype = Object.create(CGFobject.prototype);
MyCylinderWithCap.prototype.constructor=MyCylinderWithCap;

MyCylinderWithCap.prototype.display = function () {
    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();

    if(this.bottomCap === 1){
        this.scene.pushMatrix();
        this.scene.rotate(180*degToRad, 0, 1, 0);
        this.bottomCircle.display();
        this.scene.popMatrix();
    }

    if(this.topCap === 1){
        this.scene.pushMatrix();
        this.scene.translate(0,0, this.height);
        this.topCircle.display();
        this.scene.popMatrix();
    }
}