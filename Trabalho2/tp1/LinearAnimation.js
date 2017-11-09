function LinearAnimation(velocity, points){
	Animation.call(this);

	var d = new Date();
	this.time = d.getTime();
	this.velocity = velocity;
	this.points = points;

	this.travelledDistanceInStage = 0;  
	this.totalDistance;            // Total distance of the entire animation.
	this.distances = [];                // All the distance values between each two points of the animation.
	this.currentStage = 0;         // Between which points.

	for (var i = 0; i < points.length - 1 ; i) {
		var newDistance = Math.sqrt(Math.pow(points[i+1][0]-points[i][0], 2) + 
			Math.pow(points[i+1][1]-points[i][1], 2) + 
			Math.pow(points[i+1][2]-points[i][2], 2));
		this.totalDistance += newDistance;
		this.distances.push(newDistance);
	}
	
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	var deltaTime = currTime - this.time;
	this.time = currTime;

	var matrix = new Mat4();
	matrix.identity();

	var currentPointMatrix = this.points[currentStage];
	var deltaTransformMatrix;

	var rotate = (Math.atan2(this.points[currentStage+1][0] - this.points[currentStage][0], 
									this.points[currentStage+1][2] - this.points[currentStage][2])); 

	if ((this.velocity * deltaTime + this-travelledDistanceInStage) > this.distances[currentStage] &&
			this.currentStage < this.distances.length){ // Surpassed distance of it's stage
		this.travelledDistanceInStage = this.velocity * deltaTime + this.travelledDistanceInStage - this.distances[currentStage]
		currentStage++;

		rotate = (Math.atan2(this.points[currentStage+1][0] - this.points[currentStage][0], 
									this.points[currentStage+1][2] - this.points[currentStage][2])); 

		currentPointMatrix = this.points[currentStage];
		var x = currentPointMatrix[0] +
			 (this.travelledDistanceInStage / this.distances[currentStage]) * (this.points[currentStage+1][0] - this.points[currentStage][0]);
		var y = currentPointMatrix[1] +
			 (this.travelledDistanceInStage / this.distances[currentStage]) * (this.points[currentStage+1][1] - this.points[currentStage][1]);
		var z = currentPointMatrix[2] +
			 (this.travelledDistanceInStage / this.distances[currentStage]) * (this.points[currentStage+1][2] - this.points[currentStage][2]);

		deltaTransformMatrix = [x,y,z];
	} 
	else if ((this.velocity * deltaTime + this-travelledDistanceInStage) > this.distances[currentStage]){ // Is final Stage
		deltaTransformMatrix = this.points[this.points.length-1] - this.points[currentStage];
	}


	mat4.rotate(matrix, matrix, rotate, [0,1,0]);
	mat4.translate(matrix, matrix, [currentPointMatrix[0],currentPointMatrix[1],currentPointMatrix[2]]);
	mat4.translate(matrix, matrix, [deltaTransformMatrix[0],deltaTransformMatrix[1],deltaTransformMatrix[2]]);

	return matrix;
}

