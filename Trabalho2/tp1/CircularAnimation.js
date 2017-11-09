var DEGREE_TO_RAD = Math.PI / 180;

function CircularAnimation(velocity, points, centerx, centery,
                            centerz, radius, startang, rotang){
	Animation.call(this);
	this.velocity = velocity;
	this.points = points;
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius;
	this.startang = startang;
	this.rotang = rotang;

	var d = Date();
	this.time = d.getTime();

	this.w = this.velocity/this.radius;

}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(currTime){
	var deltaTime = currTime - this.time;
	this.time = currTime;

	var deltaAngle = this.startang + this.w*deltaTime;
	if(deltaAngle > this.rotang){
		deltaAngle = this.rotang;
	}

	var matrix = mat4.create();
	mat4.identity(matrix);

	mat4.translate(matrix, matrix, [centerx, centery, centerz]);
	mat4.rotateY(matrix, matrix, DEGREE_TO_RAD*deltaAngle);
	mat4.translate(matrix, matrix, [this.radius, 0, 0]);
	mat4.rotateY(matrix, matrix, DEGREE_TO_RAD*90);

	return matrix;
}