function CameraPosition(scene, name, position, target){
	this.scene = scene;
	this.name = name;
	this.position = position;
	this.target = target;
}

CameraPosition.prototype = Object.create(CameraPosition.prototype);
CameraPosition.prototype.constructor = CameraPosition;