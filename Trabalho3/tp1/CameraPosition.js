function CameraPosition(name, position, target){
	this.name = name;
	this.position = position;
	this.target = target;
}

CameraPosition.prototype = Object.create(CameraPosition.prototype);
CameraPosition.prototype.constructor = CameraPosition;
