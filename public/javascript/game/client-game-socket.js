/**
 * Created by Ahmed on 3/19/2016.
 */

var socket;
var remotePlayers=[];
var localPlayer;
var navigationMap;
var graphicsMap;
var assets;
var exits;

function onSocketConnected() {
    console.log("Connected to socket server");
    var gameStatusElement = $('#gameSocketStatus');
    gameStatusElement.text(' (connected)');
    gameStatusElement.css('color', 'green');
};

function onYou(player) {
    console.log("Got Player Data from Server");
    localPlayer = player;
    getChatHistory(player.roomId,10);
};

function onMap(data)
{
    console.log("Got Map Data from Server");
    navigationMap = data.navMap;
    navigationMap.width = data.width;
    navigationMap.height = data.height;
    graphicsMap = data.draMap
    assets = data.assets;
    exits = data.exits;
    updateMapNameUi(data.name);
    startAnimation();
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
    var gameStatusElement = $('#gameSocketStatus');
    gameStatusElement.text(' (disconnected)');
    gameStatusElement.css('color', 'red');
};

function onMessage(data) {
    console.log("Got Message from "+data.nickName+" saying "+data.message);
    addMessageToGame(data.message, data.nickName, playerById(data.id));
    addMessageToChatHistory(data.message,data.nickName,false);
};

function onNewPlayer(player) {
    console.log("Player "+player.socketId+" was connected")
    addPlayerToStage(player);
    stage.sortChildren(sortByY);
    remotePlayers.push(player);
};

function onMovePlayer(data) {
    console.log("Player "+data.id+" moved");
    var movePlayer = playerById(data.id);
    if (!movePlayer) {
        console.log("Player not found: "+data.id);
    }
    else
    {
        var newX = data.x*navigationMap.cellLength;
        var newY = data.y*navigationMap.cellLength;
        var oldX = movePlayer.grant.x;
        var oldY = movePlayer.grant.y;
        if(!movePlayer.playing) {
            if (newX > oldX) {
                movePlayer.grant.gotoAndPlay("right");
                movePlayer.playing = true;
            }
            else if (oldX > newX) {
                movePlayer.grant.gotoAndPlay("left");
                movePlayer.playing = true;
            }
            else if (newY > oldY) {
                movePlayer.grant.gotoAndPlay("down");
                movePlayer.playing = true;
            }
            else if (oldY > newY) {
                movePlayer.grant.gotoAndPlay("up");
                movePlayer.playing = true;
            }
        }
        movePlayer.grant.x = newX;
        movePlayer.grant.y = newY;
        movePlayer.grant.yBase = newY;
        movePlayer.x = data.x;
        movePlayer.y = data.y;
        stage.sortChildren(sortByY);
    }
};

function onStopPlayer(data) {
    console.log("Player "+data.id+" stopped");
    var movePlayer = playerById(data.id);
    if (!movePlayer) {
        console.log("Player not found: "+data.id);
    }
    else
    {
        movePlayer.grant.gotoAndPlay(data.stationaryAnimationName);
    }
}

function onRemovePlayer(playerId) {
    console.log("Player "+playerId+" was disconnected");
    var removePlayer = playerById(playerId);
    if (!removePlayer) {
        console.log("Player not found: "+playerId);
        return;
    };
    stage.removeChild(removePlayer.grant);
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onServerMessage(serverMessage) {
    $("#serverMessage").text(serverMessage);
    $("#serverModal").modal('show')
};

function setEventHandlers()
{
    // Keyboard Events
    this.document.onkeydown = keyPressed;
    this.document.onkeyup = keyReleased;

    // Socket Events
    socket.on("connect", onSocketConnected);
    socket.on("you", onYou);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("message", onMessage);
    socket.on("remove player", onRemovePlayer);
    socket.on("map", onMap);
    socket.on("server message", onServerMessage);
    socket.on("stop player",onStopPlayer);
};

function main(gameSocketUrl)
{
    socket = io.connect(gameSocketUrl);
    setEventHandlers();
    $('html, body').animate({
        scrollTop: $("#world-name").offset().top
    }, 500);
}
