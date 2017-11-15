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
	this.startang = startang;
	this.rotang = rotang;

	this.currAngle = this.startang;
	this.endAnimation = false;

	this.w = this.velocity/this.radius;
	this.finalMatrix = [];
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(deltaTime){

	console.log('CircularAnimation ' + deltaTime);
	var matrix = mat4.create();
	mat4.identity(matrix);
	if(this.endAnimation === true){
		return this.finalMatrix;
	}
	var deltaAngle = DEGREE_TO_RAD*this.startang + this.w*deltaTime;
	if(deltaAngle/DEGREE_TO_RAD > this.rotang){
		deltaAngle = this.rotang*DEGREE_TO_RAD;
		console.log('Here');
		this.endAnimation = true;
	}
	this.currAngle = deltaAngle;

	

	mat4.translate(matrix, matrix, [this.centerx, this.centery, this.centerz]);
	mat4.rotateY(matrix, matrix, deltaAngle);
	mat4.translate(matrix, matrix, [this.radius, 0, 0]);
	mat4.rotateY(matrix, matrix, DEGREE_TO_RAD*90);
	
	this.finalMatrix = matrix.slice();
	return matrix;

	/*this.scene.translate(this.centerx, this.centery, this.centerz);
	this.scene.rotate(deltaAngle, 0, 1, 0);
	this.scene.translate(this.radius, 0, 0);
	this.scene.rotate(DEGREE_TO_RAD*90, 0, 1, 0);*/

	//this.finalMatrix = matrix.slice();
	/*console.log(matrix);
	return matrix;*/
}