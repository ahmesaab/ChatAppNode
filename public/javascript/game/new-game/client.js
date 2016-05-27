/**
 * Created by Ahmed on 3/19/2016.
 */

function createClient(url,game)
{

    // Initialization
    var _socket = io.connect(url);
    var _game = game;
    // Socket Events
    _socket.on("connect", _onSocketConnected);
    _socket.on("you", _onYou);
    _socket.on("disconnect", _onSocketDisconnect);
    _socket.on("new player", _onNewPlayer);
    _socket.on("move player", _onMovePlayer);
    _socket.on("message", _onMessage);
    _socket.on("remove player", _onRemovePlayer);
    _socket.on("map", _onMap);
    _socket.on("server message", _onServerMessage);
    _socket.on("move bullet",_onMoveBullet);
    _socket.on("remove bullet",_onRemoveBullet);

    // private functions
    function _onSocketConnected(){
        console.log("Connected to socket server");
        ui.log("You have been connected")
        ui.updateStatus(true);
    };

    function _onYou(player) {
        console.log("Got Player Data from Server");
        _game.setLocalPlayer(player);
    };

    function _onMap(data) {
        console.log("Got Map Data from Server");
        var cellLength = ui.scaleGameCanvas(data.width,data.height);
        ui.updateMapNameUi(data.name);
        ui.repositionSideBar();
        ui.log("You have joined room "+data.name);
        _game.setMap(data,cellLength);
        _game.start();
    }

    function _onSocketDisconnect() {
        console.log("Disconnected from socket server");
        ui.log("You have been disconnected")
        ui.updateStatus(false);
    };

    function _onMessage(data) {
        console.log("Got Message from "+data.nickName+" saying "+data.message);
        _game.addMessage(data.id, data.message);
        ui.addMessageToChatHistory(data.message,data.nickName,false);
    };

    function _onNewPlayer(player) {
        console.log("Player "+player.socketId+" was connected")
        ui.log("Player "+player.nickName+" joined the room")
        _game.addPlayer(player);
    };

    function _onMovePlayer(data) {
        _game.movePlayer(data.id,data.x,data.y)
    };


    function _onRemovePlayer(playerId) {
        _game.removePlayer(playerId);
    };

    function _onServerMessage(serverMessage) {
        ui.alert(serverMessage);
    };

    function _onMoveBullet(data) {
        _game.moveBullet(data.id,data.x,data.y);
    };

    function _onRemoveBullet(bulletId) {
        _game.removeBullet(bulletId);
    }

    // public functions
    return {
        emitSendMessage:function(message)
        {
            if (message != "")
            {
                _socket.emit('message',message );
                _game.addMessage(_game.getLocalPlayer().socketId, message);
                ui.addMessageToChatHistory(message,_game.getLocalPlayer().nickName,true);
            }
        },

        emitMovePlayer:function(direction)
        {
            _socket.emit('move player',direction);
        },

        emitFireBullet:function(x,y,direction)
        {
            _socket.emit("fire bullet",{x:x,y:y,direction:direction})
        }
    }
}
