/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,
	remotePlayers,
	socket;	// Local player


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	remotePlayers = [];
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Initialise the local player
	socket = io.connect("http://localhost:2000/game");

	// Start listening for events
	setEventHandlers();

};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	socket.on("connect", onSocketConnected);
	socket.on("you", onYou);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("message", onMessage);
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");
	var gameStatusElement = $('#gameSocketStatus');
	gameStatusElement.text(' (connected)');
	gameStatusElement.css('color', 'green');
	var chatStatusElement = $('#chatSocketStatus');
	chatStatusElement.text(' (connected)');
	chatStatusElement.css('color', 'green');
};

function onYou(data) {
	console.log("Got Player Data from Server");
	localPlayer = new Player(data.id,data.x, data.y,data.nickName,data.roomId,data.shape,data.color);
	animate();
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
	var statusElement = $('#gameSocketStatus');
	statusElement.text(' (disconnected)');
	statusElement.css('color', 'red');
	var statusElement = $('#chatSocketStatus');
	statusElement.text(' (disconnected)');
	statusElement.css('color', 'red');
};

function onMessage(data) {
	addMessage(data.message, data.nickName);
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    var newPlayer = new Player(data.id,data.x, data.y,data.nickName,data.roomId,data.shape,data.color);
	remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);
	if (!movePlayer) {
	    console.log("Player not found: "+data.id);
	    return;
	};
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);
	if (!removePlayer) {
	    console.log("Player not found: "+data.id);
	    return;
	};
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);    
};



function addMessage(msg, pseudo) {
	$("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sentMessage(socket) {
	if ($('#messageInput').val() != "")
	{
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), localPlayer.nickName, new Date().toISOString(), true);
		$('#messageInput').val('');
	}
}

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};




/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	if (localPlayer.update(keys,canvas)) {
	    socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx);

	var i;
	for (i = 0; i < remotePlayers.length; i++) {
	    remotePlayers[i].draw(ctx);
	};

};


/**************************************************
 ** MAIN
 **************************************************/

window.onload = function() {

	init();

	$(function () {
		$('#chatControls').show();
		$("#submit").click(function () {
			sentMessage(socket);
		});
	});

	$("#messageInput").keyup(function (event) {
		if (event.keyCode == 13) {
			$("#submit").click();
		}
	});

	//prepareCanvas(document.getElementById("canvasDiv"), window.innerWidth, 220);

	startPokemon();
}