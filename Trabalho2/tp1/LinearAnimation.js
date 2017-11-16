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
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(deltaTime) {

	this.travelledDistanceInStage += this.velocity*deltaTime;
	if(this.travelledDistanceInStage >= this.distances[this.currentStage]){ //next stage
		this.travelledDistanceInStage -= this.distances[this.currentStage];		
		this.currentStage++; 
	}
	if(this.currentStage + 1 >= this.stages){
		this.endAnimation = true;
		return this.finalMatrix;
	}
	//this.travelledDistanceInStage += this.velocity*deltaTime;
	/*if(this.travelledDistanceInStage > this.distances[this.currentStage]){
		//this.travelledDistanceInStage = this.distances[this.currentStage];
		this.travelledDistanceInStage -= this.distances[this.currentStage];		
		this.currentStage++; 
	}
	if(this.currentStage + 1 >= this.stages){
		this.endAnimation = true;
	}*/
	this.angle = Math.atan2((this.points[this.currentStage + 1][0] - this.points[this.currentStage][0]),(this.points[this.currentStage + 1][2] - this.points[this.currentStage][2]));
	this.x = (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][0] - this.points[this.currentStage][0]);
	this.y = (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][1] - this.points[this.currentStage][1]);
	this.z = (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][2] - this.points[this.currentStage][2]);

	/*this.scene.translate(this.x, this.y, this.z);
	this.scene.translate(this.points[this.currentStage][0], this.points[this.currentStage][1], this.points[this.currentStage][2]);
	this.scene.rotate(this.angle, 0, 1, 0);*/

	var matrix = mat4.create();
	mat4.identity(matrix);
	mat4.translate(matrix, matrix, [this.x, this.y, this.z]);
	mat4.translate(matrix, matrix, [this.points[this.currentStage][0], this.points[this.currentStage][1], this.points[this.currentStage][2]]);
	mat4.rotateY(matrix, matrix, this.angle);

	this.finalMatrix = matrix.slice();
	return matrix;
}

