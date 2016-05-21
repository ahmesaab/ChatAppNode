var Service = require('../data/service.js');
var Player = require("../models/player.js").Player;
var io;
var service;

var Handler = function(socket,serverIo)
{

    if(validate(socket.request.session.passport))
    {
        var userId = socket.request.session.passport.user;
        service = new Service();
        io = serverIo;
        service.getUser(userId,function(user)
        {
            if(true)//user.status==='offline')
            {
                service.connectUser(user.id);
                console.log(user.nickName+' connected to GAME with id='+socket.id+' in room '+user.roomId);
                socket.player = new Player(user,socket.id);
                socket.userId = user.id;

                emitYou(socket);
                service.getMap(socket.player.roomId,function(map){
                    socket.world = map;
                    socket.emit("map",socket.world);
                    emitPlayers(socket,io);
                    socket.join(socket.player.roomId);
                    socket.on("disconnect", onClientDisconnect);
                    socket.on("move player", onMovePlayer);
                    socket.on("stop player", onStopPlayer);
                    socket.on('message', onMessage);
                    broadcastNewPlayer(socket);
                    //printMapInConsole(map);;
                })
            }
            else if(user.status==='online')
            {
                console.log('User is already online in GAME');
                socket.emit("server message","You have been disconnected" +
                " because you are already playing in another connection or session");
                socket.disconnect();
            }
            else
            {
                socket.disconnect();
            }

        });
    }
    else
    {
        console.log('Invalid user trying to connect to GAME');
        socket.emit("server message","You have been disconnected" +
        " because you are not logged in");
        socket.disconnect();
    }
}

function onClientDisconnect()
{
    service.disconnectUser(this.userId);
    service.updatePosition(this.userId,Math.round(this.player.x),Math.round(this.player.y));
    if(typeof this.player !=='undefined')
    {
        console.log("Player has disconnected: "+this.player.socketId);
        this.to(this.player.roomId).emit("remove player", this.player.socketId);
    }
};


function onMovePlayer(direction)
{
    var oldX = this.player.x;
    var oldY = this.player.y;
    var speed = this.player.speed;
    var newX = oldX;
    var newY = oldY;
    switch(direction)
    {
        case 0:
            newX = oldX - speed;
            break;
        case 1:
            newX = oldX + speed;
            break;
        case 2:
            newY = oldY - speed;
            break;
        case 3:
            newY = oldY + speed;
    }
    var move = validateMove(Math.round(newX),Math.round(newY),this.world.map);
    if(move === true)
    {
        this.player.x = newX;
        this.player.y = newY;
        var data = {id: this.player.socketId, x:newX ,y:newY}
        this.to(this.player.roomId).emit("move player",data);
        this.emit("move player",data);
    }
    else if(move.constructor === Array)
    {
        console.log("Trying to escape with x:"+move[0]+" y:"+move[1]);
        for(var i=0;i<this.world.exits.length;i++)
        {
            var exit = this.world.exits[i];
            if(exit.entranceX == move[0] && exit.entranceY == move[1])
            {
                var newRoomId = exit.destination;
                service.updateUserCurrentMap(this.userId,newRoomId);

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
    }
};

function onStopPlayer(data)
{
    this.to(this.player.roomId).emit("stop player", {id: this.player.socketId, stationaryAnimationName: data});
    this.emit("stop player", {id: this.player.socketId, stationaryAnimationName: data});
}

function onMessage(message)
{
    if(message!=null)
    {
        var data = { 'message' : message, nickName : this.player.nickName, id: this.player.socketId };
        service.addMessage(this.userId,this.player.roomId,message);
        this.to(this.player.roomId).emit('message', data);
        console.log("User " + this.player.nickName + " send this : " + message+" to broadcast "+this.player.roomId);
    }
};

function validate(userId)
{
    if(typeof userId !== 'undefined')
        return true;
    else
        return false;
}

function validateMove(newX,newY,map)
{
    var corners = [
        {x:newX+1,y:newY+1},
        {x:newX+1,y:newY+2},
        {x:newX,y:newY+1},
        {x:newX,y:newY+2}
    ];

    for(var i=0;i<corners.length;i++)
    {
        var x = corners[i].x;
        var y = corners[i].y;
        try
        {
            var cellValue = map[x][y].value;
            if(!cellValue)
            {
                return false;
            }
        }
        catch(err)
        {
            return [x,y]
        }
    }
    return true;
};

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
        console.log("ERROR: "+err);
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