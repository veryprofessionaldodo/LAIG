function ComboAnimation(scene, animations){
	Animation.call(this);

	this.scene = scene;
	this.animations = animations.slice();
	console.log(this.animations);
	this.currentAnimation = 0;
	this.finalMatrix= [];
}

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor = ComboAnimation;

ComboAnimation.prototype.update = function(deltaTime) {
	if(this.currentAnimation >= this.animations.length){
		var matrix = mat4.create();
		mat4.identity(matrix);
		return matrix;
	}
	if(this.animations[this.currentAnimation].endAnimation === true){
		this.currentAnimation++;
	}
	
	return this.animations[this.currentAnimation].update(deltaTime);
}

ComboAnimation.prototype.clone = function() {
	return this;
}