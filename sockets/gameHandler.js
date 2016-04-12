var Service = require('../data/service.js');
var Player = require("../models/player.js").Player;
var io;
var service;
var Handler = function(socket,serverIo)
{
    var user = socket.request.session.user;
    if(validate(user))
    {
        service = new Service();
        io = serverIo;
        service.getUser(user.id,function(updatedUser)
        {
            console.log(user.nickName+' connected to GAME with id='+socket.id+' in room '+updatedUser.roomId);
            socket.player = new Player(updatedUser,socket.id);

            emitYou(socket);
            service.getMap(socket.player.roomId,function(map){
                socket.world = map;
                socket.emit("map",socket.world);
                emitPlayers(socket,io);
                socket.join(socket.player.roomId);
                socket.on("disconnect", onClientDisconnect);
                socket.on("move player", onMovePlayer);
                socket.on("change room", onChangeRoom);
                socket.on('message', onMessage);
                broadcastNewPlayer(socket);
                //printMapInConsole(map);;
            })
        });
    }
    else
    {
        console.log('Invalid user trying to connect to GAME');
        socket.disconnect();
    }
}

function onClientDisconnect()
{
    service.updatePosition(this.request.session.user.id,Math.round(this.player.x),Math.round(this.player.y));
    service.close();
    if(typeof this.player !=='undefined')
    {
        console.log("Player has disconnected: "+this.player.socketId);
        this.to(this.player.roomId).emit("remove player", {id: this.player.socketId});
    }
};

function onMovePlayer(data)
{
    var navMap = this.world.navMap;
    try
    {
        if(navMap[Math.round(data.x+1)][Math.round(data.y+1)]==true)
        {
            this.player.x = data.x;
            this.player.y = data.y;
            this.to(this.player.roomId).emit("move player", {id: this.player.socketId, x: this.player.x,
                y: this.player.y, frame: data.frame});
        }
        else
        {
            socket.disconnect();
            console.log("Trying to access false block, player disconnected for violation");
        }
    }
    catch(err)
    {
        this.disconnect();
        console.log(err);
    }

};

function onMessage(message)
{
    if(message!=null)
    {
        var data = { 'message' : message, nickName : this.player.nickName, id: this.player.socketId };
        service.addMessage(this.request.session.user.id,this.player.roomId,message);
        this.to(this.player.roomId).emit('message', data);
        console.log("user " + this.player.nickName + " send this : " + message+" to broadcast "+this.player.roomId);
    }
};

function onChangeRoom(data)
{
    for(var i=0;i<this.world.exits.length;i++)
    {
        var exit = this.world.exits[i];
        if(exit.entranceX == data.x && exit.entranceY == data.y)
        {
            var newRoomId = exit.destination;
            service.updateUserCurrentMap(this.request.session.user.id,newRoomId);

            broadcastRemovePlayer(this);

            this.join(newRoomId);
            this.leave(this.player.roomId);

            this.player.roomId = newRoomId;
            this.player.x = exit.exitX;
            this.player.y = exit.exitY-1;

            emitYou(this);
            var that = this;
            service.getMap(this.player.roomId,function(map) {
                that.world = map;
                that.emit("map", that.world);
                emitPlayers(that,io);
                broadcastNewPlayer(that);
            });
        }
    }
};

function validate(user)
{
    if(typeof user !== 'undefined')
        return true;
    else
        return false;
}

function printMapInConsole(map)
{
    for(var i=0;i<map.height;i++)
    {
        process.stdout.write(i+' - ');
        for(var j=0;j<map.width;j++)
        {
            process.stdout.write(map.navMap[j][i]+" - ")
        }
        console.log();
    }
}

function emitYou(socket)
{
    socket.emit("you", socket.player);
}

function emitPlayers(socket,io)
{
    try
    {
        for (var existingPlayerSocketId in io.of('/game').adapter.rooms[socket.player.roomId].sockets)
        {
            if (existingPlayerSocketId !== socket.id)
            {
                var existingPlayer = io.of('/game').sockets[existingPlayerSocketId].player;
                console.log(existingPlayer.nickName + " is already in room" + socket.player.roomId);
                socket.emit("new player", existingPlayer);
            }
        }
    }
    catch(err)
    {
        console.log("No previous members in room "+socket.player.roomId);
        console.log(err);
    }
}

function broadcastNewPlayer(socket)
{
    socket.to(socket.player.roomId).emit("new player", socket.player);
}

function broadcastRemovePlayer(socket)
{
    socket.to(socket.player.roomId).emit("remove player", socket.player.socketId);
}

module.exports = Handler;