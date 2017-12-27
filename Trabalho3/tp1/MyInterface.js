 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui
    
    this.message = 'dat.gui';


    this.gui = new dat.GUI();
    this.playTimeController = null;

    // add a group of controls (and open/expand by defult)
    
    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {
    
    var group = this.gui.addFolder("Lights");
    //group.open();
    
    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
}

 /*
MyInterface.prototype.addSelectablesGroup = function(selectables, graph) {
    this.gui.add(this.scene, "selectables", selectables).onChange(function(v) { 
            for (var i = 0; i < selectables.length; i++) {
                if (selectables[i] == v) {
                    graph.activeSelectable = i; 
                }
            }
     });

}*/

MyInterface.prototype.addCounter = function(count, gameLoop){
    this.playTimeController = this.gui.add(gameLoop, "counter", 0, count).name("Time to Play");
}

MyInterface.prototype.updateCounter = function(){
    var update = function(){};
    requestAnimationFrame(update);

    // Iterate over all controllers
    for (var i in this.gui.__controllers) {
        this.gui.__controllers[i].updateDisplay();
    }
    update();
}

MyInterface.prototype.removeCounter = function() {
    if(this.playTimeController !== null){
        this.gui.remove(this.playTimeController);
    }
}

MyInterface.prototype.addUndoButton = function(gameLoop) {
    this.gui.add(gameLoop, 'reverseMove').name("Undo");
}

MyInterface.prototype.addEnvironmentGroup = function(environments){
    this.gui.add(this.scene, "environments", environments).onChange(function(v) { 
            for (var i = 0; i < environments.length; i++) {
                if (environments[i] == v) {
                    scene.changeEnvironment(environments[i]); 
                }
            }
    });
}

