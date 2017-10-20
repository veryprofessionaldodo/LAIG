function MyPatch(scene, info) {
	CGFobject.call(this,scene);
	this.scene = scene;

	var args = info.args;

	//degrees
	this.divs = new Array();
	var values = args.split(" ");
	for(var i = 0; i < values.length; i++){
		this.divs.push(parseInt(values[i]));
	}
	//cplines
	this.controlVertexes = new Array();
	for(var i = 0; i < info.cpline.length; i++){
		this.cplines = new Array();
		for(var j = 0; j < info.cpline[i].children.length; j++){
			this.cpoints = new Array();
			for(var k = 0; k < info.cpline[i].children[j].attributes.length; k++){
				this.cpoints.push(parseFloat(info.cpline[i].children[j].attributes[k].value)); //has 4 attributes: xx, yy, z and w
			}
		this.cplines.push(this.cpoints);
		}
		this.controlVertexes.push(this.cplines);
	}
	this.degrees = new Array();
	this.degrees[0] = this.controlVertexes.length - 1;
	this.degrees[1] = this.controlVertexes[0].length - 1;
	this.initBuffers();
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.getKnotsVector = function(degree){
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}


MyPatch.prototype.initBuffers = function() {

	var knots1 = this.getKnotsVector(this.degrees[0]); 
	var knots2 = this.getKnotsVector(this.degrees[1]);

	var nurbsSurface = new CGFnurbsSurface(this.degrees[0], this.degrees[1], knots1, knots2, this.controlVertexes);
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
	console.log(this.nurbsSurface);

	this.patch = new CGFnurbsObject(this.scene, getSurfacePoint, this.divs[0], this.divs[1]);
};
