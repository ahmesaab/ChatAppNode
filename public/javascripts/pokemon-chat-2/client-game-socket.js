/**
 * Created by Ahmed on 3/19/2016.
 */

var localPlayer;
var navigationMap;
var graphicsMap;
var assets;

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

};

function onMap(data)
{
    console.log("Got Map Data from Server");
    navigationMap = data.navMap;
    navigationMap.width = data.width;
    navigationMap.height = data.height;
    graphicsMap = data.draMap
    assets = data.assets;
    startAnimation();
}

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
    console.log("Got Message from "+data.nickName+" saying "+data.message);
    addMessageToUi(data.message, data.nickName, playerById(data.id));
};

function onNewPlayer(data) {
    console.log("Player "+data.id+" was connected")
    var newPlayer = new Player(data.id,data.x, data.y,data.nickName,data.roomId,data.shape,data.color);
    addPlayerToStage(newPlayer);
    remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
    console.log("Player "+data.id+" moved");
    var movePlayer = playerById(data.id);
    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
    movePlayer.grant.x = data.x*navigationMap.cellLength;
    movePlayer.grant.y = data.y*navigationMap.cellLength;
    movePlayer.grant.gotoAndStop(data.frame);
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
    console.log("Player "+data.id+" was disconnected");
    var removePlayer = playerById(data.id);
    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
    stage.removeChild(removePlayer.grant);
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

