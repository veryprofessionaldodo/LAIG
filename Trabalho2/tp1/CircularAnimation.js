var DEGREE_TO_RAD = Math.PI / 180;

function CircularAnimation(scene, velocity, centerx, centery,
                            centerz, radius, startang, rotang){
	Animation.call(this);

	this.scene = scene; //colocar isto na classe Animation
	this.velocity = velocity;
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius;
	this.startang = startang*DEGREE_TO_RAD;
	this.rotang = rotang*DEGREE_TO_RAD;

	this.currAngle = this.startang;
	this.angleInterval = 0;
	this.endAnimation = false;

	this.w = this.velocity/this.radius;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(deltaTime){

	console.log('CircularAnimation ' + deltaTime);
	/*var matrix = mat4.create();
	mat4.identity(matrix);*/
	if(this.endAnimation === true){
		return;
	}
	var deltaAngle = this.w*deltaTime;
	this.angleInterval += deltaAngle;
	console.log('angleInterval: ' + this.angleInterval/DEGREE_TO_RAD);
	console.log('Rotang: ' + this.rotang/DEGREE_TO_RAD);
	if(this.angleInterval >= this.rotang){
		//deltaAngle = this.rotang;
		console.log('Here');
		this.endAnimation = true;
	}
	/*this.currAngle = this.startang + deltaAngle;
	console.log(this.currAngle);*/
	/*
	mat4.translate(matrix, matrix, [this.centerx, this.centery, this.centerz]);
	mat4.rotateY(matrix, matrix, deltaAngle);
	mat4.translate(matrix, matrix, [this.radius, 0, 0]);
	mat4.rotateY(matrix, matrix, DEGREE_TO_RAD*90);
	
	this.finalMatrix = matrix.slice();
	return matrix;*/

	this.scene.translate(this.centerx, this.centery, this.centerz);
	this.scene.rotate(deltaAngle, 0, 1, 0);
	this.scene.translate(this.radius, 0, this.radius);
	this.scene.rotate(DEGREE_TO_RAD*90, 0, 1, 0);

	//this.finalMatrix = matrix.slice();
	/*console.log(matrix);
	return matrix;*/
}