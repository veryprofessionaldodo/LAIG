function LinearAnimation(scene, points, velocity){
	Animation.call(this);

	this.scene = scene;
	
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

