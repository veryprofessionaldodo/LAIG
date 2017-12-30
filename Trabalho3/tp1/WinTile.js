var degToRad = Math.PI / 180.0;

function WinTile(scene, id, x, y, z){
	this.scene = scene;
	this.id = id;

	this.quad = new MyQuad(this.scene, "0 4 5 0");

	this.x = x;
	this.y = y;
	this.z = z;
	this.winner = null;
}

WinTile.prototype = Object.create(WinTile.prototype);
WinTile.prototype.constructor = WinTile;

WinTile.prototype.update = function(winner){
	this.winner = winner;
	console.log("tentei "  + this.winner);
}

WinTile.prototype.display = function(deltaTime) {
	if (this.winner != null) {
		this.scene.pushMatrix();

		switch(this.winner){
			case 1:
				this.scene.winPlayer1.apply();
				break;
			case 2:
				this.scene.winPlayer2.apply();
				break;
		}
		this.scene.translate(this.x,this.y,this.z);
		this.scene.rotate(90*degToRad, 0, 1, 0);
		this.scene.scale(1.5,0.8,0.5);
		this.quad.display();
		this.scene.materialDefault.apply();
		this.scene.popMatrix();
	}

}