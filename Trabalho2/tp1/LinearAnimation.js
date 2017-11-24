/**
	Linear Animation does the animation between several points, all with linear movement.
*/
function LinearAnimation(scene, velocity, points){
	Animation.call(this, scene);

	this.velocity = velocity;
	this.points = points;

	this.travelledDistanceInStage = 0;  
	this.distances = [];                // All the distance values between each two points of the animation.
	this.currentStage = 0;         // Index to know which points to use make the calculus
	this.stages = points.length;
	//calculus of the distances between all the points
	for (var i = 0; i < points.length - 1 ; i++) {
		var newDistance = Math.sqrt(Math.pow(points[i+1][0]-points[i][0], 2) + 
									Math.pow(points[i+1][1]-points[i][1], 2) + 
									Math.pow(points[i+1][2]-points[i][2], 2));
		this.distances.push(newDistance);
	}
	this.endAnimation = false;

	this.finalMatrix = [];

	//inital coordinates and directions
	this.x = this.points[this.currentStage][0];
	this.y = this.points[this.currentStage][1];
	this.z = this.points[this.currentStage][2];

	this.directionX = this.points[this.currentStage+1][0] - this.points[this.currentStage][0];
	this.directionY = this.points[this.currentStage+1][1] - this.points[this.currentStage][1];
	this.directionZ = this.points[this.currentStage+1][2] - this.points[this.currentStage][2];
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/**
	Updates the matrix with the curent position of the object in the duration of the animation.
*/
LinearAnimation.prototype.update = function(deltaTime) {

	if(this.endAnimation === true){
 		return this.finalMatrix;
 	}
	this.travelledDistanceInStage += this.velocity*deltaTime;
	if(this.travelledDistanceInStage >= this.distances[this.currentStage]){ //next stage
		this.travelledDistanceInStage -= this.distances[this.currentStage];		
		this.currentStage++; 

		if(this.currentStage + 1 < this.stages) {
			this.directionX = this.points[this.currentStage+1][0] - this.points[this.currentStage][0];
			this.directionY = this.points[this.currentStage+1][1] - this.points[this.currentStage][1];
			this.directionZ = this.points[this.currentStage+1][2] - this.points[this.currentStage][2];
		}
		else { //animation has ended
			this.endAnimation = true;
			return this.finalMatrix;
		}
	}
	
	this.angleXZ = Math.atan2(this.directionX, this.directionY);
	this.angleY = Math.atan2(this.directionX, this.directionZ);
	
	this.x += this.velocity * Math.sin(this.angleXZ) * deltaTime;
	this.y += this.velocity * Math.cos(this.angleY) * deltaTime;
	this.z += this.velocity * Math.cos(this.angleXZ) * deltaTime;

	var matrix = mat4.create();
	mat4.identity(matrix);
	mat4.translate(matrix, matrix, [this.x, this.y, this.z]);
	mat4.rotateY(matrix, matrix, this.angleY);

	this.finalMatrix = matrix.slice();
	return matrix;
}

/**
	Returns a clone of this animation.
*/
LinearAnimation.prototype.clone = function() {
	var clone = new LinearAnimation(this.scene, this.velocity, this.points);
	return clone;
}

