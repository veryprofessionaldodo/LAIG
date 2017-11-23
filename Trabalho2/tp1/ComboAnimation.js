function ComboAnimation(scene, animations){
	Animation.call(this);

	this.scene = scene;
	this.animations = animations.slice();
	this.currentAnimation = 0;
	this.finalMatrix= [];
}

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor = ComboAnimation;

ComboAnimation.prototype.update = function(deltaTime) {
	if(this.currentAnimation >= this.animations.length){
		return this.finalMatrix;
	}
	if(this.animations[this.currentAnimation].endAnimation === true){
		this.currentAnimation++;
	}
	if(this.currentAnimation >= this.animations.length){
		return this.finalMatrix;
	}
	this.finalMatrix = this.animations[this.currentAnimation].update(deltaTime);
	return this.finalMatrix;
}

ComboAnimation.prototype.clone = function() {
	return this;
}