function BezierAnimation(scene, velocity, points){
	Animation.call(this);

	this.scene = scene;
	this.velocity = velocity;
	this.points = points;

}

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;