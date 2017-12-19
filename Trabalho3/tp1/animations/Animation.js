function Animation(scene) {
	this.scene = scene;
}

/**
	Restart the animation to its starting point
*/	
Animation.prototype.restartAnimation = function(){};
/**
	Returns a matrix with the updated position of the animation
*/	
Animation.prototype.update = function (deltaTime){};
/**
	Returns a clone of the animation
*/
Animation.prototype.clone = function() {};