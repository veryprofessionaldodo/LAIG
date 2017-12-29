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
    this.environments = ['scene1.xml', 'scene2.xml'];
    this.currentEnvironment = 'scene1.xml';
    this.playAnimations = false;

    this.cameraPositions = new Array();
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);
    
    this.initCameras();
    this.initScoreTextures();
    this.initWinTextures();

    this.enableTextures(true);
    this.setPickEnabled(true);
    
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL)
    
    this.axis = new CGFaxis(this);
    this.lastTime = 0;
    this.replay = false;
    this.loadedInterface = false;

    this.board = new GameBoard(this);
    this.auxRedBoard = new AuxBoard(this, -6);
    this.auxWhiteBoard = new AuxBoard(this, 5);
    this.environment = new Environment(this);
    this.pawnModel = null;
    this.kingModel = null;
    this.pickableElements = new Array();
    this.gameLoop = new GameLoop(this);

    this.scoreWhite = new ScoreTile(this, 0, -5.8, 6, 2.5);
    this.scoreRed = new ScoreTile(this, 1, -5.8, 6, -1);
    this.winTile = new WinTile(this, 0, -5.5, 5.7, 2.8);

    this.gameLoop.makeRequest("reset");

    document.getElementById("send_button").addEventListener("click", function(event) {
        var loop = new GameLoop(this);
        var requestString = document.querySelector("#query_field").value;               
        loop.makeRequest(requestString);
    }, false);

    this.boardCellsShader = new CGFshader(this.gl, "shaders/notDisplay.vert", "shaders/notDisplay.frag");
    this.pickedElement = new CGFshader(this.gl, "shaders/picked.vert", "shaders/picked.frag");
    this.totalTime = 0;
    this.scaleFactor = 0;
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

    this.cameraPositions = [];
    if(this.currentEnvironment === 'scene1.xml')
        this.cameraPositions[0] = new CameraPosition('Beggining', vec3.fromValues(-1, 1, 17), vec3.fromValues(-1, -2, 0));
    else if (this.currentEnvironment === 'scene2.xml')
        this.cameraPositions[0] = new CameraPosition('Beggining', vec3.fromValues(-5, 3, -11), vec3.fromValues(-35, 1, -12));
    this.cameraPositions[1] = new CameraPosition('Player 1', vec3.fromValues(-1, 15, -15), vec3.fromValues(-1, 0, 0));
    this.cameraPositions[2] = new CameraPosition('Player 2', vec3.fromValues(-1, 15, 15), vec3.fromValues(-1, 0, 0));

    //this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
    this.camera = new CGFcamera(0.4,0.1,500,this.cameraPositions[0].position,this.cameraPositions[0].target);
    this.currentCameraID = this.cameraPositions[0].name;
    this.cameraAnimation = null;
}

XMLscene.prototype.initPieces = function() {
    var boardCellsInd = this.board.boardCells.length - 10;

    var id = 1;
    var x = -4.5, y = 5.3, z = -3.1;
    for(var i = 0; i < 10; i++){
        var pawn = new Pawn(this, id, this.pawnModel, this.board.boardCells[i], x, y, z, "redWood", "redWoodMaterial");
        this.board.boardCells[i].piece = pawn;
        this.board.pieces.push(pawn); //red
        x += 1;
        id++;
    }
    x = -4.5; z = 2.5;
    for(var i = 0; i < 10; i++){
        var pawn = new Pawn(this, id, this.pawnModel, this.board.boardCells[boardCellsInd], x, y, z, "banco", "steelMaterial");
        this.board.boardCells[boardCellsInd].piece = pawn;
        this.board.pieces.push(pawn); //white
        x += 1;
        id++;
        boardCellsInd++;
    }

    var king = new King(this, id, this.kingModel, this.board.boardCells[14], -0.5, 5.5, -2.25, "redWood", "redWoodMaterial");
    this.board.boardCells[14].piece = king;
    this.board.pieces.push(king); //red
    id++;

    king = new King(this, id, this.kingModel, this.board.boardCells[boardCellsInd - 15], 0.5, 5.5, 1.75, "banco", "steelMaterial");
    this.board.boardCells[boardCellsInd - 15].piece = king;
    this.board.pieces.push(king); //white
}

XMLscene.prototype.initBoardCells = function() {
    var x = -5, y = 5.15, z = -2.7;
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 10; j++){
            this.board.boardCells.push(new BoardCell(this, 'board'+ i +''+ j, x, y, z));
            x += 1;
        }
        x = -5, z += 0.8;
    }
}

XMLscene.prototype.initScoreTextures = function() {
    this.materialDefault = new CGFappearance(this);
    this.number0 = new CGFappearance(this);
    this.number0.loadTexture("scenes/images/0.jpg");
    this.number1 = new CGFappearance(this);
    this.number1.loadTexture("scenes/images/1.jpg");
    this.number2 = new CGFappearance(this);
    this.number2.loadTexture("scenes/images/2.jpg");
    this.number3 = new CGFappearance(this);
    this.number3.loadTexture("scenes/images/3.jpg");
    this.number4 = new CGFappearance(this);
    this.number4.loadTexture("scenes/images/4.jpg");
    this.number5 = new CGFappearance(this);
    this.number5.loadTexture("scenes/images/5.jpg");
    this.number6 = new CGFappearance(this);
    this.number6.loadTexture("scenes/images/6.jpg");
    this.number7 = new CGFappearance(this);
    this.number7.loadTexture("scenes/images/7.jpg");
    this.number8 = new CGFappearance(this);
    this.number8.loadTexture("scenes/images/8.jpg");
    this.number9 = new CGFappearance(this);
    this.number9.loadTexture("scenes/images/9.jpg");
    this.number10 = new CGFappearance(this);
    this.number10.loadTexture("scenes/images/10.jpg");
    this.number11 = new CGFappearance(this);
    this.number11.loadTexture("scenes/images/11.png");
}

XMLscene.prototype.initWinTextures = function() {
    this.winPlayer1 = new CGFappearance(this);
    this.winPlayer1.loadTexture("scenes/images/win_player1.jpg");
    this.winPlayer2 = new CGFappearance(this);
    this.winPlayer2.loadTexture("scenes/images/win_player2.jpg");
}

XMLscene.prototype.updateCamera = function(cameraID){
    if(this.currentCameraID === 'Beggining'){
        this.cameraAnimation = new CameraAnimation(this, 0, this.camera, this.cameraPositions[cameraID+1]);
        this.currentCameraID = cameraID + 1;
    }
    else if(cameraID === 'Beggining'){
        this.cameraAnimation = new CameraAnimation(this, 0, this.camera, this.cameraPositions[0]);
        this.currentCameraID = 'Beggining';
    }
    else{
        this.cameraAnimation = new CameraAnimation(this, 1, this.camera, this.cameraPositions[cameraID+1]);
        this.currentCameraID = cameraID + 1;
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

    // Adds lights group.
    if(!this.loadedInterface){
        this.interface.addLightsGroup(this.graph.lights);
        this.interface.addEnvironmentGroup(this.environments, this);
        this.interface.addGameOptions();
        this.interface.addUndoButton(this.gameLoop);
        this.loadedInterface = true;
    }
    this.initBoardCells();
    this.initPieces();
     
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
                    console.log("Picked object: " + obj.id + ", with pick id " + customId + " pickResults ");
                    obj.picked = ~obj.picked;
                    
                    this.gameLoop.loop(obj);
                }
            }
            this.pickResults.splice(0,this.pickResults.length);
        }       
    }
}

function idIsPawnOrKing(id) {
    if (id[0] == 'p' && id[1] == 'a' && id[2] == 'w' && id[3] == 'n')
        return true;
    if (id[0] == 'k' && id[1] == 'i' && id[2] == 'n' && id[3] == 'g'){
        return true;
    }

    return false;
}

function idIsBoard(id) {
    if (id[0] == 'b' && id[1] == 'o' && id[2] == 'a' && id[3] == 'r' && id[4] == 'd')
        return true;

    return false;
}

XMLscene.prototype.displayPickableItems = function(deltaTime) {
    var n = 1;
    for(var i = 0; i < this.board.pieces.length; i++){
        this.registerForPick(n, this.board.pieces[i]);
        n++;
        this.board.pieces[i].display(deltaTime);
    } 
    for(var i = 0; i < this.board.boardCells.length; i++){
        this.registerForPick(n, this.board.boardCells[i]);
        n++;
        if(!this.board.boardCells[i].picked)
            this.setActiveShader(this.boardCellsShader);
        this.board.boardCells[i].display(deltaTime);
        this.setActiveShader(this.defaultShader);
    } 
    // insert here some flag if the beggining or not of the game
    // reduces the number of pickable elements
    for(var i = 0; i < this.pickableElements.length; i++){
        this.registerForPick(n, this.pickableElements[i]);
        this.pickableElements[i].display(deltaTime);
        n++;
    }
}

XMLscene.prototype.changeEnvironment = function(filename) {
    if(filename !== this.currentEnvironment){
        this.currentEnvironment = filename;
        this.setPickEnabled(true);
        this.board.resetElements();
        this.gameLoop.makeRequest("reset");
        this.gameLoop.resetGameWithOptions();
        new MySceneGraph(filename, this);
        this.initCameras();
    }
}

XMLscene.prototype.updateScaleFactor=function(v) {
    this.pickedElement.setUniformsValues({normScale: this.scaleFactor});
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

    this.totalTime += this.deltaTime/1000;
    this.scaleFactor = (1+Math.sin(5*this.totalTime)) * 0.5;
    this.updateScaleFactor();

    if(!this.replay)
        this.gameLoop.update(this.deltaTime/1000);
    else
        this.gameLoop.replay(this.deltaTime/1000);

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
        this.scoreWhite.display();
        this.scoreRed.display();
        this.winTile.display();
        //this.auxWhiteBoard.display(this.deltaTime/1000);
        //this.auxRedBoard.display(this.deltaTime/1000);

        if(!this.replay){
            this.logPicking();
            this.clearPickRegistration();
            this.displayPickableItems(this, this.deltaTime/1000);
            this.clearPickRegistration();
        }
        else {
            this.displayPickableItems(this.deltaTime/1000);
        }
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

    if(this.cameraAnimation !== null){
        this.animateCamera(this.deltaTime/1000);
    }
}

XMLscene.prototype.animateCamera = function(deltaTime){
    if(this.cameraAnimation.endAnimation)
        this.cameraAnimation = null;
    else
        this.cameraAnimation.update(deltaTime);
}

XMLscene.prototype.resetGame = function(){
    this.setPickEnabled(true);
    this.gameLoop.resetGame();
    this.board.resetElements();
    this.gameLoop.makeRequest("reset");
    this.initBoardCells();
    this.initPieces();
    this.camera = new CGFcamera(0.4,0.1,500,this.cameraPositions[1].position,this.cameraPositions[1].target);
    this.currentCameraID = this.cameraPositions[1].name;
    this.cameraAnimation = null;
}

XMLscene.prototype.resetGameOptions = function(){
    this.setPickEnabled(true);
    this.board.resetElements();
    this.gameLoop.makeRequest("reset");
    this.gameLoop.resetGameWithOptions();
    this.initBoardCells();
    this.initPieces();
    this.camera = new CGFcamera(0.4,0.1,500,this.cameraPositions[0].position,this.cameraPositions[0].target);
    this.currentCameraID = this.cameraPositions[0].name;
    this.cameraAnimation = null;
}

XMLscene.prototype.replayGame = function(){
    console.log('Replay');
    this.setPickEnabled(false);
    this.board.pieces = [];
    this.initPieces();
    //this.board.moveToInitPieces();
    this.replay = true;
    this.camera = new CGFcamera(0.4,0.1,500,this.cameraPositions[1].position,this.cameraPositions[1].target);
}
