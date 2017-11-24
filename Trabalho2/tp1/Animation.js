function Animation(scene) {
	this.scene = scene;
}

/**
	Returns a matrix with the updated position of the animation
*/	
Animation.prototype.update = function (deltaTime){};
/**
	Returns a clone of the animation
*/
Animation.prototype.clone = function() {};