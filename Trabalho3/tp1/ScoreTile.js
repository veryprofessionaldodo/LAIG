var degToRad = Math.PI / 180.0;

function ScoreTile(scene, id, x, y, z){
	this.scene = scene;
	this.id = id;
	this.currentScore = 11;

	this.quad = new MyQuad(this.scene, "0 4 5 0");

	this.materialDefault = new CGFappearance(this.scene);

	this.number0 = new CGFappearance(this.scene);
	this.number0.loadTexture("scenes/images/0.jpg");
	this.number1 = new CGFappearance(this.scene);
	this.number1.loadTexture("scenes/images/1.jpg");
	this.number2 = new CGFappearance(this.scene);
	this.number2.loadTexture("scenes/images/2.jpg");
	this.number3 = new CGFappearance(this.scene);
	this.number3.loadTexture("scenes/images/3.jpg");
	this.number4 = new CGFappearance(this.scene);
	this.number4.loadTexture("scenes/images/4.jpg");
	this.number5 = new CGFappearance(this.scene);
	this.number5.loadTexture("scenes/images/5.jpg");
	this.number6 = new CGFappearance(this.scene);
	this.number6.loadTexture("scenes/images/6.jpg");
	this.number7 = new CGFappearance(this.scene);
	this.number7.loadTexture("scenes/images/7.jpg");
	this.number8 = new CGFappearance(this.scene);
	this.number8.loadTexture("scenes/images/8.jpg");
	this.number9 = new CGFappearance(this.scene);
	this.number9.loadTexture("scenes/images/9.jpg");
	this.number10 = new CGFappearance(this.scene);
	this.number10.loadTexture("scenes/images/10.jpg");
	this.number11 = new CGFappearance(this.scene);
	this.number11.loadTexture("scenes/images/11.png");

	this.x = x;
	this.y = y;
	this.z = z;
}

ScoreTile.prototype = Object.create(ScoreTile.prototype);
ScoreTile.prototype.constructor = ScoreTile;

ScoreTile.prototype.update = function(){
	this.currentScore -= 1;
}

ScoreTile.prototype.display = function(deltaTime) {
	this.scene.pushMatrix();

	switch(this.currentScore){
		case 0:
			this.number0.apply();
			break;
		case 1:
			this.number1.apply();
			break;
		case 2:
			this.number2.apply();
			break;
		case 3:
			this.number3.apply();
			break;
		case 4:
			this.number4.apply();
			break;
		case 5:
			this.number5.apply();
			break;
		case 6:
			this.number6.apply();
			break;
		case 7:
			this.number7.apply();
			break;
		case 8:
			this.number8.apply();
			break;
		case 9:
			this.number9.apply();
			break;
		case 10:
			this.number10.apply();
			break;
		case 11:
			this.number11.apply();
			break;
	}
	this.scene.translate(this.x,this.y,this.z);
	this.scene.rotate(90*degToRad, 0, 1, 0);
	this.scene.scale(0.5,0.5,0.5);
	this.quad.display();
	this.materialDefault.apply();
	this.scene.popMatrix();
}