function ComboAnimation(scene, animations){
	Animation.call(this);

	this.scene = scene;
	this.animations = animations.slice();
	this.currentAnimation = 0;
}

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor = ComboAnimation;

ComboAnimation.prototype.update = function(deltaTime) {
	if(this.currentAnimation >= this.animations.length){
		var matrix = mat4.create();
		mat4.identity(matrix);
		return matrix;
	}
	if(this.animations[this.currentAnimation].endAnimation === 1){
		this.currentAnimation++;
	}
	
	this.animations[this.currentAnimation].update(deltaTime);
}