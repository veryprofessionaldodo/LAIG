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

	this.deltaAngle = this.startang*DEGREE_TO_RAD;
	this.endAnimation = false;

	this.w = this.velocity/this.radius;

	this.finalMatrix = [];
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

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

	/*this.scene.translate(this.centerx, this.centery, this.centerz);
	this.scene.rotate(this.deltaAngle*DEGREE_TO_RAD, 0, 1, 0);
	this.scene.translate(this.radius, 0, 0);
	this.scene.rotate(Math.PI/2, 0, 1, 0);*/

}

CircularAnimation.prototype.clone = function() {
	var clone = new CircularAnimation(this.scene, this.velocity, this.centerx, this.centery, this.centerz, this.radius, this.startang, this.rotang);
	return clone;
}