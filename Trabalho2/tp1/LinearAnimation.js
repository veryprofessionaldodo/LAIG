function LinearAnimation(scene, velocity, points){
	Animation.call(this);
	console.log('Constructor');
	/*var d = new Date();
	this.time = d.getTime();*/
	this.scene = scene;
	this.velocity = velocity;
	this.points = points;

	/*this.x = 0;
	this.z = 0;*/

	this.travelledDistanceInStage = 0;  
	this.totalDistance;            // Total distance of the entire animation.
	this.distances = [];                // All the distance values between each two points of the animation.
	this.currentStage = 0;         // Between which points.
	this.stages = points.length;
	for (var i = 0; i < points.length - 1 ; i++) {
		var newDistance = Math.sqrt(Math.pow(points[i+1][0]-points[i][0], 2) + 
									Math.pow(points[i+1][1]-points[i][1], 2) + 
									Math.pow(points[i+1][2]-points[i][2], 2));
		this.totalDistance += newDistance;
		this.distances.push(newDistance);
	}

	this.finalMatrix = [];
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(deltaTime) {

	console.log('LinearAnimation ' + deltaTime);
	console.log(this.currentStage);
	var matrix = mat4.create();
	mat4.identity(matrix);

	/*if(this.currentStage + 1 >= this.stages){
		
	}

	this.angle = Math.atan2((this.points[this.currentStage + 1][0] - this.points[this.currentStage][0]),(this.points[this.currentStage + 1][2] - this.points[this.currentStage][2]));
	console.log('Angle: ' + this.angle*180/Math.PI);
	var vx = this.velocity*Math.cos(this.angle);
	var vz = this.velocity*Math.sin(this.angle);

	this.x += deltaTime*vx;
	this.z += deltaTime*vz;
	console.log('Pontos: ' + this.x + ' - ' + this.z);

	mat4.translate(matrix, matrix, [this.x, this.points[this.currentStage][1], this.z]);
	mat4.translate(matrix, matrix, [this.points[this.currentStage][0], this.points[this.currentStage][1], this.points[this.currentStage][2]]);
	mat4.rotateY(matrix, matrix, this.angle);

	if(this.x >= this.points[this.currentStage + 1][0] && this.z >= this.points[this.currentStage + 1][2])
		this.currentStage++;

	console.log('currentStage: ' + this.currentStage);
	this.finalMatrix = matrix.slice();
	return matrix;*/

	if(this.currentStage + 1 > this.stages){
		return this.finalMatrix;
	}
	var currentPointMatrix = this.points[this.currentStage];
	var deltaTransformMatrix = [];


	var rotate = (Math.atan2(this.points[this.currentStage+1][0] - this.points[this.currentStage][0], 
									this.points[this.currentStage+1][2] - this.points[this.currentStage][2])); 

	if ((this.velocity * deltaTime + this.travelledDistanceInStage) > this.distances[this.currentStage] &&
			this.currentStage < this.distances.length){ // Surpassed distance of it's stage
		this.travelledDistanceInStage = this.velocity * deltaTime + this.travelledDistanceInStage - this.distances[this.currentStage];
		this.currentStage++;

		currentPointMatrix = this.points[this.currentStage];
		var x = currentPointMatrix[0] +
			 (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][0] - this.points[this.currentStage][0]);
		var y = currentPointMatrix[1];//+
			 /*(this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][1] - this.points[this.currentStage][1]);*/
		var z = currentPointMatrix[2] +
			 (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][2] - this.points[this.currentStage][2]);

		deltaTransformMatrix = [x,y,z];
	} 
	else if ((this.velocity * deltaTime + this.travelledDistanceInStage) > this.distances[this.currentStage]){ // Is final Stage
		deltaTransformMatrix = this.points[this.points.length-1] - this.points[this.currentStage];
	}
	else {
		this.travelledDistanceInStage = this.velocity * deltaTime + this.travelledDistanceInStage;
		var x = currentPointMatrix[0] +
			 (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][0] - this.points[this.currentStage][0]);
		var y = currentPointMatrix[1];// +
			/* (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][1] - this.points[this.currentStage][1]);*/
		var z = currentPointMatrix[2] +
			 (this.travelledDistanceInStage / this.distances[this.currentStage]) * (this.points[this.currentStage+1][2] - this.points[this.currentStage][2]);
		deltaTransformMatrix = [x, y, z];
		console.log(deltaTransformMatrix);
	}

	/*this.scene.rotate(rotate, 0, 1, 0);
	this.scene.translate(currentPointMatrix[0],currentPointMatrix[1],currentPointMatrix[2]);
	this.scene.translate(deltaTransformMatrix[0],deltaTransformMatrix[1],deltaTransformMatrix[2]);*/

	mat4.translate(matrix, matrix, [deltaTransformMatrix[0],deltaTransformMatrix[1],deltaTransformMatrix[2]]);
	mat4.translate(matrix, matrix, [currentPointMatrix[0],currentPointMatrix[1],currentPointMatrix[2]]);
	mat4.rotate(matrix, matrix, rotate, [0,1,0]);

	this.finalMatrix = matrix.slice();
	return matrix;
/*
	console.log(matrix);
	return matrix;*/

	/*console.log('Final Matrix');
	console.log(this.finalMatrix);*/
}

