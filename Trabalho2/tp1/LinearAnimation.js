function LinearAnimation(scene, velocity, points){
	Animation.call(this);

	this.scene = scene;
	this.velocity = velocity;
	this.points = points;

	this.travelledDistanceInStage = 0;  
	this.distances = [];                // All the distance values between each two points of the animation.
	this.currentStage = 0;         // Between which points.
	this.stages = points.length;
	for (var i = 0; i < points.length - 1 ; i++) {
		var newDistance = Math.sqrt(Math.pow(points[i+1][0]-points[i][0], 2) + 
									Math.pow(points[i+1][1]-points[i][1], 2) + 
									Math.pow(points[i+1][2]-points[i][2], 2));
		this.distances.push(newDistance);
	}
	this.endAnimation = false;

	this.finalMatrix = [];


	this.x = this.points[this.currentStage][0];
	this.y = this.points[this.currentStage][1];
	this.z = this.points[this.currentStage][2];
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(deltaTime) {

	if(this.endAnimation === true){
 		return this.finalMatrix;
 	}
	this.travelledDistanceInStage += this.velocity*deltaTime;
	if(this.travelledDistanceInStage >= this.distances[this.currentStage]){ //next stage
		this.travelledDistanceInStage -= this.distances[this.currentStage];		
		this.currentStage++; 
	}
	if(this.currentStage + 1 >= this.stages){
		this.endAnimation = true;
		return this.finalMatrix;
	}
	else {
		this.directionX = this.points[this.currentStage+1][0] - this.points[this.currentStage][0];
		this.directionY = this.points[this.currentStage+1][1] - this.points[this.currentStage][1];
		this.directionZ = this.points[this.currentStage+1][2] - this.points[this.currentStage][2];
	}
	
	this.angle = Math.atan2(this.directionX, this.directionZ);
	
	this.x += this.velocity * deltaTime * this.directionX;
	this.y += this.velocity * deltaTime * this.directionY;
	this.z += this.velocity * deltaTime * this.directionZ;

	var matrix = mat4.create();
	mat4.identity(matrix);
	mat4.translate(matrix, matrix, [this.x, this.y, this.z]);
	mat4.rotateY(matrix, matrix, this.angle);

	this.finalMatrix = matrix.slice();
	console.log([this.x, this.y, this.z], 80*this.angle/Math.PI,this.travelledDistanceInStage, this.distances[this.currentStage]);
	return matrix;
}

LinearAnimation.prototype.clone = function() {
	var clone = new LinearAnimation(this.scene, this.velocity, this.points);
	return clone;
}

