var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;

    this.lightValues = {};
    this.selectables = {};
    this.playAnimations = false;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);
    
    this.initCameras();

    this.enableTextures(true);
    this.setPickEnabled(true);
    
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    
    this.axis = new CGFaxis(this);
    this.lastTime = 0;

    this.board = new Board(this);
    this.environment = new Environment(this);
    this.pawnModel = null;
    this.kingModel = null;

    this.boardCellsShader = new CGFshader(this.gl, "shaders/notDisplay.vert", "shaders/notDisplay.frag");

}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.
    
    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];
            
            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
            
            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
            this.lights[i].update();
            
            i++;
        }
    }
    
}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
}

XMLscene.prototype.initPieces = function() {
    var boardCellsInd = this.board.boardCells.length - 10;

    var id = 1;
    var x = -23, y = 1.5, z = -18;
    for(var i = 0; i < 10; i++){
        var pawn = new Pawn(this, id, this.pawnModel, this.board.boardCells[i], x, y, z);
        this.board.boardCells[i].piece = pawn;
        this.board.pieces.push(pawn); //red
        x += 5;
        id++;
    }
    x = -23; z = 10;
    for(var i = 0; i < 10; i++){
        var pawn = new Pawn(this, id, this.pawnModel, this.board.boardCells[boardCellsInd], x, y, z);
        this.board.boardCells[boardCellsInd].piece = pawn;
        this.board.pieces.push(pawn); //white
        x += 5;
        id++;
        boardCellsInd++;
    }

    var king = new King(this, id, this.kingModel, this.board.boardCells[boardCellsInd - 14], 2.5, 2, 6);
    this.board.boardCells[boardCellsInd - 14].piece = king;
    this.board.pieces.push(king); //white
    id++;

    king = new King(this, id, this.kingModel, this.board.boardCells[14], -2.5, 2, -14);
    this.board.boardCells[14].piece = king;
    this.board.pieces.push(king); //red
}

XMLscene.prototype.initBoardCells = function() {
    var x = -25, y = 1.25, z = -16;
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 10; j++){
            this.board.boardCells.push(new BoardCell(this, i +''+ j, x, y, z));
            x += 5;
        }
        x = -25, z += 4;
    }
}

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() 
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);
    
    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
    
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    
    this.initLights();
    this.initBoardCells();
    this.initPieces();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);
    this.interface.addSelectablesGroup(this.graph.selectables, this.graph);

    this.setUpdatePeriod(1/60);
}


XMLscene.prototype.logPicking = function ()
{
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i=0; i< this.pickResults.length; i++) {
                var obj = this.pickResults[i][0];
                if (obj)
                {
                    var customId = this.pickResults[i][1];              
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                }
            }
            this.pickResults.splice(0,this.pickResults.length);
        }       
    }
}

XMLscene.prototype.displayPickableItems = function() {
    var n = 1;
    for(var i = 0; i < this.board.pieces.length; i++){
        this.registerForPick(n, this.board.pieces[i].id);
        n++;
        this.board.pieces[i].display();
    } 
    for(var i = 0; i < this.board.boardCells.length; i++){
        this.registerForPick(n, this.board.boardCells[i].id);
        n++;
        this.setActiveShader(this.boardCellsShader);
        this.board.boardCells[i].display();
        this.setActiveShader(this.defaultShader);
    } 
}



/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup
    
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    
    this.pushMatrix();
    
    if (this.graph.loadedOk) 
    {        
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

        // Draw axis
        this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        // Displays the scene.
        this.graph.displayScene(this.deltaTime);

        this.logPicking();
        this.clearPickRegistration();
        this.displayPickableItems();
        this.clearPickRegistration();
    }
	else
	{
		// Draw axis
		this.axis.display();
	}
    

    this.popMatrix();
    
    // ---- END Background, camera and axis setup  
}

/**
    Updates de deltaTime, which is the time difference between the last interruption and the current one
*/
XMLscene.prototype.update = function(currTime) {

    if(this.lastTime === 0){
        this.lastTime = currTime;
    }
    this.deltaTime = (currTime - this.lastTime);
    this.lastTime = currTime;
}