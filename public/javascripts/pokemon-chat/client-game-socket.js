/**
 * Created by Ahmed on 3/19/2016.
 */

function onSocketConnected() {
    console.log("Connected to socket server");
    var gameStatusElement = $('#gameSocketStatus');
    var chatStatusElement = $('#chatSocketStatus');
    gameStatusElement.text(' (connected)');
    gameStatusElement.css('color', 'green');
    chatStatusElement.text(' (connected)');
    chatStatusElement.css('color', 'green');
};

function onYou(data) {
    console.log("Got Player Data from Server");
    localPlayer = new Player(data.id,data.x, data.y,data.nickName,data.roomId,data.shape,data.color);
    startAnimation();
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
    var gameStatusElement = $('#gameSocketStatus');
    var chatStatusElement = $('#chatSocketStatus');
    gameStatusElement.text(' (disconnected)');
    gameStatusElement.css('color', 'red');
    chatStatusElement.text(' (disconnected)');
    chatStatusElement.css('color', 'red');
};

function onMessage(data) {
    addMessageToUi(data.message, data.nickName, playerById(data.id));
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    var newPlayer = new Player(data.id,data.x, data.y,data.nickName,data.roomId,data.shape,data.color);
    addPlayerToStage(newPlayer);
    remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
    var movePlayer = playerById(data.id);
    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
    movePlayer.grant.x = data.x;
    movePlayer.grant.y = data.y;
    movePlayer.grant.gotoAndStop(data.frame);
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);
    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
    stage.removeChild(removePlayer.grant);
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

