/**
	Bezier Animation does the animation of a bezier curve
*/
function BezierAnimation(scene, velocity, points){
	Animation.call(this, scene);

	this.velocity = velocity;
	this.points = points;
	this.s = 0;

	this.newPoints = [];
	this.casteljau(this.points, 3);
	this.totalDistance = totalDistance(this.newPoints);



	this.totalTime = this.totalDistance/this.velocity;
	this.endAnimation = false;
	this.finalMatrix = [];
}

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;

/**
	Restart the animation to its starting point
*/	
BezierAnimation.prototype.restartAnimation = function() {
	this.endAnimation = false;
	this.s = 0;
}
/**
	Recursive algorithm that calculates the points needed to make the bezier curve. 
	Using 4 levels of recursivity. 
*/
BezierAnimation.prototype.casteljau = function(points, nTimes) {
	if(this.scene.graph.restartAnimation === true){
		this.restartAnimation();
	}
	var newPoints = [];
	if(nTimes < 0){
		this.newPoints = points.slice();
		return;
	}
	var i = 0;
	newPoints.push(points[0]);
	for(i; i < points.length - 1; i++){
		var newPoint = [(points[i + 1][0] + points[i][0])/2, (points[i + 1][1] + points[i][1])/2, (points[i + 1][2] + points[i][2])/2];
		newPoints.push(newPoint);
	}
	newPoints.push(points[i]);
	nTimes--;
	this.casteljau(newPoints, nTimes);
}
/**
	Calculates the total distance between all the points calculated in the casteljau function.
*/
function totalDistance(points){
	var totalDistance = 0;
	for(var i = 0; i < points.length - 1; i++){
		totalDistance += Math.sqrt(Math.pow(points[i+1][0]-points[i][0], 2) + 
									Math.pow(points[i+1][1]-points[i][1], 2) + 
									Math.pow(points[i+1][2]-points[i][2], 2));
	}
	return totalDistance;
}

/**
	Calculates the values of the bezier curve using its formula, based on the t value (mentioned as time).
*/
function bezier(time, points) {
    this.qx = Math.pow(1 - time, 3) * points[0][0] + 3 * time * Math.pow(1 - time, 2) * points[1][0] + 3 * Math.pow(time, 2) * (1 - time) * points[2][0] + Math.pow(time, 3) * points[3][0];
    this.qy = Math.pow(1 - time, 3) * points[0][1] + 3 * time * Math.pow(1 - time, 2) * points[1][1] + 3 * Math.pow(time, 2) * (1 - time) * points[2][1] + Math.pow(time, 3) * points[3][1];
    this.qz = Math.pow(1 - time, 3) * points[0][2] + 3 * time * Math.pow(1 - time, 2) * points[1][2] + 3 * Math.pow(time, 2) * (1 - time) * points[2][2] + Math.pow(time, 3) * points[3][2];
    this.qb = [];
    this.qb.push(this.qx, this.qy, this.qz);
    return this.qb;
}
/**
	Calculates the derivate of the bezier curve using its formula, based on the t value (mentioned as time).
*/
function derivateBezier(time, points) {
	this.qx = -3*Math.pow(1 - time, 2) * points[0][0] + (3 * Math.pow(1 - time, 2) - 6*time*(1-time)) * points[1][0] + (6 * time * (1 - time) - 3*Math.pow(time,2)) * points[2][0] + 3 * Math.pow(time, 2) * points[3][0];
    this.qy = -3*Math.pow(1 - time, 2) * points[0][1] + (3 * Math.pow(1 - time, 2) - 6*time*(1-time)) * points[1][1] + (6 * time * (1 - time) - 3*Math.pow(time,2)) * points[2][1] + 3 * Math.pow(time, 2) * points[3][1];
    this.qz = -3*Math.pow(1 - time, 2) * points[0][2] + (3 * Math.pow(1 - time, 2) - 6*time*(1-time)) * points[1][2] + (6 * time * (1 - time) - 3*Math.pow(time,2)) * points[2][2] + 3 * Math.pow(time, 2) * points[3][2];
    this.qb = [];
    this.qb.push(this.qx, this.qy, this.qz);

    return this.qb;
}
/**
	Updates the matrix with the curent position of the object in the duration of the animation.
*/
BezierAnimation.prototype.update = function(deltaTime) {
	this.s += deltaTime/this.totalTime;

	if(this.endAnimation === true){
		return this.finalMatrix;
	}
	if(this.s >= 1){
		this.endAnimation = true;
		return this.finalMatrix;
	}

	var qb = bezier(this.s, this.points);

	var derivateQb = derivateBezier(this.s, this.points);

	this.angle = Math.atan(derivateQb[2], derivateQb[0]);

	var matrix = mat4.create();
	mat4.identity(matrix);

	mat4.translate(matrix, matrix, [qb[0], qb[1], qb[2]]);
	//mat4.rotateY(matrix, matrix, this.angle);

	this.finalMatrix = matrix.slice();

	return matrix;
}

/**
	Returns a clone of this animation.
*/
BezierAnimation.prototype.clone = function() {
	var clone = new BezierAnimation(this.scene, this.velocity, this.points);
	return clone;
}