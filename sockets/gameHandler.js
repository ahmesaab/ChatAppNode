var Service = require('../data/service.js');
var Player = require("../models/player.js").Player;
var Handler = function(socket,io)
{
    var user = socket.request.session.user;
    var chatId = socket.handshake.query.chatId;
    var startX= socket.handshake.query.startX;
    var startY= socket.handshake.query.startY;
    var service = new Service();
    if(typeof user !== 'undefined')
        console.log(user.nickName+' is trying to connect to GAME in chat '+chatId);
    if(validateParams(user,chatId,startX,startY))
        service.isMember(user.id,chatId, function(isMember)
        {
            if(isMember)
            {
                console.log(user.nickName+' connected to GAME in chat '+chatId+' id='+socket.id);
                socket.player = new Player(socket.id,chatId,startX,startY);
                var clients = findClientsSocket(chatId, '/game',io);
                var i, existingPlayer;
                for (i = 0; i < clients.length; i++) {
                    existingPlayer = clients[i].player;
                    if(existingPlayer!==socket.player)
                        socket.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
                };
                socket.join(chatId);
                socket.on("disconnect", onClientDisconnect);
                socket.on("move player", onMovePlayer);
                socket.to(chatId).emit("new player", {id: socket.player.id, x: socket.player.getX(), y: socket.player.getY()});
            }
            else
            {
                console.log(user.nickName+' connection failed to GAME in chat '+chatId+' because user is not a member');
                socket.disconnect();
            }
        });
    else
    {
        console.log('Invalid user/chatId/startX/startY params while trying to connect to GAME in chat '+chatId);
        socket.disconnect();
    }
}

function onClientDisconnect(data) {
    if(typeof this.player !=='undefined')
    {
        console.log("Player has disconnected: "+this.player.id);
        this.to(this.player.chatId).emit("remove player", {id: this.player.id});
    }
};

function onMovePlayer(data) {
    this.player.setX(data.x);
    this.player.setY(data.y);
    this.to(this.player.chatId).emit("move player", {id: this.player.id, x: this.player.getX(), y: this.player.getY()});
};

function validateParams(user,chatId,startX,startY)
{
   if(typeof user !== 'undefined' && typeof chatId !=='undefined' &&
       typeof startX !=='undefined' && typeof startY !=='undefined')
       return true;
    else
       return false;
}

function findClientsSocket(roomId, namespace,io) {
    var res = []
        , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms[roomId] ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}

module.exports = Handler;