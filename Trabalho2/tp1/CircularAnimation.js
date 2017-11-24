var DEGREE_TO_RAD = Math.PI / 180;
/**
	Circular Animation does the animation of a circle
*/
function CircularAnimation(scene, velocity, centerx, centery,
                            centerz, radius, startang, rotang){
	Animation.call(this, scene);

	this.velocity = velocity;
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius;
	this.startang = startang;
	this.rotang = rotang;

	this.deltaAngle = this.startang*DEGREE_TO_RAD;
	this.endAnimation = false;

	this.w = this.velocity/this.radius;

	this.finalMatrix = [];
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
	Updates the matrix with the curent position of the object in the duration of the animation.
*/
CircularAnimation.prototype.update = function(deltaTime){

	var matrix = mat4.create();
	mat4.identity(matrix);

	if(this.endAnimation === true){
 		return this.finalMatrix;
 	}
 	this.deltaAngle += this.w*deltaTime;

 	if(this.deltaAngle > ((this.rotang + this.startang)*DEGREE_TO_RAD)){
 		this.deltaAngle = (this.rotang + this.startang)*DEGREE_TO_RAD;
 		this.endAnimation = true;
 	}
 		  
 	mat4.translate(matrix, matrix, [this.centerx, this.centery, this.centerz]);
 	mat4.rotateY(matrix, matrix, this.deltaAngle);
 	mat4.translate(matrix, matrix, [this.radius, 0, 0]);
 	mat4.rotateY(matrix, matrix, Math.PI/2);
 	this.finalMatrix = matrix.slice();
  	return matrix;
}

/**
	Returns a clone of this animation.
*/
CircularAnimation.prototype.clone = function() {
	var clone = new CircularAnimation(this.scene, this.velocity, this.centerx, this.centery, this.centerz, this.radius, this.startang, this.rotang);
	return clone;
}