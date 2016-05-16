/**
 * Created by Ahmed on 3/19/2016.
 */

function client(url)
{
    this.socket = io.connect(url);

    // Socket Events
    this.socket.on("connect", onSocketConnected);
    this.socket.on("you", onYou);
    this.socket.on("disconnect", onSocketDisconnect);
    this.socket.on("new player", onNewPlayer);
    this.socket.on("move player", onMovePlayer);
    this.socket.on("message", onMessage);
    this.socket.on("remove player", onRemovePlayer);
    this.socket.on("map", onMap);
    this.socket.on("server message", onServerMessage);
    this.socket.on("stop player",onStopPlayer);

    function onSocketConnected() {
        console.log("Connected to socket server");
        ui.updateStatus(true);
    };

    function onYou(player) {
        console.log("Got Player Data from Server");
        game.localPlayer = player;
        //ui.getChatHistory(player.roomId,10);
    };

    function onMap(data)
    {
        console.log("Got Map Data from Server");
        ui.updateMapNameUi(data.name);
        game.map = data;
        game.start();
    }

    function onSocketDisconnect() {
        console.log("Disconnected from socket server");
        ui.updateStatus(false);
    };

    function onMessage(data) {
        console.log("Got Message from "+data.nickName+" saying "+data.message);
        game.addMessageToGame(data.message, data.nickName, game.getPlayerById(data.id));
        ui.addMessageToChatHistory(data.message,data.nickName,false);
    };

    function onNewPlayer(player) {
        console.log("Player "+player.socketId+" was connected")
        game.addPlayer(player);
        game.sort();
    };

    function onMovePlayer(data) {
        console.log("Player "+data.id+" moved");
        var movePlayer = game.getPlayerById(data.id);
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
            game.sort();
        }
    };

    function onStopPlayer(data) {
        console.log("Player "+data.id+" stopped");
        var movePlayer = game.getPlayerById(data.id);
        if (!movePlayer) {
            console.log("Player not found: "+data.id);
        }
        else
        {
            movePlayer.grant.gotoAndPlay(data.stationaryAnimationName);
        }
    }

    function onRemovePlayer(playerId) {
        game.removePlayer(game.getPlayerById(playerId));
    };

    function onServerMessage(serverMessage) {
        ui.alert(serverMessage);
    };

    this.changeRoom = function(x,y)
    {
        console.log("Changing room");
        this.socket.emit('change room',{x:x,y:y});
    }

    this.sendMessage = function(message)
    {
        if (message != "")
        {
            this.socket.emit('message',message );
            game.addMessageToGame(message, localPlayer.nickName, localPlayer);
            ui.addMessageToChatHistory(message,localPlayer.nickName,true);
        }
    }
}
