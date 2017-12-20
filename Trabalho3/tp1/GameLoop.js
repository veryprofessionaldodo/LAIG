function GameLoop() {
	this.stackedMoves = [];
}

var gameLoop = new GameLoop();

GameLoop.prototype.handleResponse = function(response) {
    console.log(response);
};

// Parses input

document.getElementById("send_button").addEventListener("click", function(event) {
    gameLoop.makeRequest("merda");
}, false);

GameLoop.prototype.getPrologRequest = function(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}
        
GameLoop.prototype.makeRequest = function(request) {
    // Get Parameter Values
    var requestString = document.querySelector("#query_field").value;               
                
    // Make Request
    this.getPrologRequest(requestString, this.handleReply);
}
            
//Handle the Reply
GameLoop.prototype.handleReply = function(data){
    var responseString = data.target.response;

    gameLoop.handleResponse(responseString)
}


function stringToResponse(responseString){
	var array;

	return array;

}