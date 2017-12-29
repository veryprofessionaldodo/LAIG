var degToRad = Math.PI / 180.0;

function ScoreTile(scene, id, x, y, z){
	this.scene = scene;
	this.id = id;
	this.currentScore = 11;

	this.quad = new MyQuad(this.scene, "0 4 5 0");

	this.x = x;
	this.y = y;
	this.z = z;
}

ScoreTile.prototype = Object.create(ScoreTile.prototype);
ScoreTile.prototype.constructor = ScoreTile;

ScoreTile.prototype.update = function(){
	this.currentScore -= 1;
}

ScoreTile.prototype.revive = function(){
	this.currentScore += 1;
}

ScoreTile.prototype.display = function(deltaTime) {
	this.scene.pushMatrix();

	switch(this.currentScore){
		case 0:
			this.scene.number0.apply();
			break;
		case 1:
			this.scene.number1.apply();
			break;
		case 2:
			this.scene.number2.apply();
			break;
		case 3:
			this.scene.number3.apply();
			break;
		case 4:
			this.scene.number4.apply();
			break;
		case 5:
			this.scene.number5.apply();
			break;
		case 6:
			this.scene.number6.apply();
			break;
		case 7:
			this.scene.number7.apply();
			break;
		case 8:
			this.scene.number8.apply();
			break;
		case 9:
			this.scene.number9.apply();
			break;
		case 10:
			this.scene.number10.apply();
			break;
		case 11:
			this.scene.number11.apply();
			break;
	}
	this.scene.translate(this.x,this.y,this.z);
	this.scene.rotate(90*degToRad, 0, 1, 0);
	this.scene.scale(0.5,0.5,0.5);
	this.quad.display();
	this.scene.materialDefault.apply();
	this.scene.popMatrix();
}