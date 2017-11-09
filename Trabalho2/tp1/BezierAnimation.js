function BezierAnimation(velocity, points){
	Animation.call(this);

	this.velocity = velocity;
	this.points = points;

}

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;