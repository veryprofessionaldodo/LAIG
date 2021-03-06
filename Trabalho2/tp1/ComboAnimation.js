/**
	Combo Animation contains another animations and goes through them sequentially
*/
function ComboAnimation(scene, animations){
	Animation.call(this, scene);

	this.animations = animations.slice();
	this.currentAnimation = 0;
	this.finalMatrix = [];
}

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor = ComboAnimation;

/**
	Restart the animation to its starting point, restarting its animations
*/	
ComboAnimation.prototype.restartAnimation = function() {
	this.currentAnimation = 0;
	for(var i = 0; i < this.animations.length; i++){
		this.animations[i].restartAnimation();
	}
}

/**
	Goes through the animation sequentially and, when reaches the end of the alst animation, returns the last matrix calculated
*/
ComboAnimation.prototype.update = function(deltaTime) {
	if(this.scene.graph.restartAnimation === true){
		this.restartAnimation();
	}
	//ComboAnimation end
	if(this.currentAnimation >= this.animations.length){
		return this.finalMatrix;
	}
	//Goes to the next animation
	if(this.animations[this.currentAnimation].endAnimation === true){
		this.currentAnimation++;
	}
	//Check if it is not on the end of the comboAnimation
	if(this.currentAnimation >= this.animations.length){
		return this.finalMatrix;
	}
	//calls the function update of the animation, which returns the animation matrix
	this.finalMatrix = this.animations[this.currentAnimation].update(deltaTime);
	return this.finalMatrix;
}

/**
	Returns this animation
*/
ComboAnimation.prototype.clone = function() {
	return this;
}