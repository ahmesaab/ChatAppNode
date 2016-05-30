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
                    socket.on('fire bullet', onFireBullet);
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



function validateMove(oldX,oldY,newX,newY,step,map)
{
    //if(Math.abs(oldX - newX) < step && Math.abs(oldY-newY) < step)
    if(true)
    {
        var corners = [
            {x:newX+1,y:newY+1},  // upper right
            {x:newX+1,y:newY+2},  // lower right
            {x:newX,y:newY+1},    // upper left
            {x:newX,y:newY+2}     // lower left
        ];

        for(var i=0;i<corners.length;i++)
        {
            var x = Math.round(corners[i].x);
            var y = Math.round(corners[i].y);
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
                console.log(err);
                return [x,y]
            }
        }
        return true;
    }
    else
    {
        return false;
    }

};

function onMovePlayer(data)
{

    var cellPerSecond = this.player.speed;
    var deltaMilliSeconds = 300; // ms
    var cellPerDelta = (cellPerSecond/1000) * deltaMilliSeconds;
    var moveLogic = validateMove(this.player.x,this.player.y,data.x,data.y,cellPerDelta,this.world.map);
    if(moveLogic === true)
    {
        this.player.x = data.x;
        this.player.y = data.y;
        this.to(this.player.roomId).emit("move player",{id: this.player.socketId, x:data.x, y:data.y});
        console.log("Player "+this.id+" moved to x:"+data.x+" y:"+data.y);
    }
    else if(moveLogic === false)
    {
        this.emit("set location",{id: this.player.socketId, x:this.player.x, y:this.player.y});
        console.log("Player "+this.id+" move was invalidated and set to x:"+this.player.x+" y:"+this.player.y);
    }
    else
    {
        console.log("Player "+this.id+" is trying to escape with x:"+moveLogic[0]+" y:"+moveLogic[1]);
        var willExitMap = changeRoom(moveLogic[0],moveLogic[1],this);
        if(!willExitMap)
        {
            this.emit("set location",{id: this.player.socketId, x:this.player.x, y:this.player.y});
        }
    }

};

function changeRoom(x,y,socket)
{

    for(var i=0;i<socket.world.exits.length;i++)
    {
        var exit = socket.world.exits[i];
        if(exit.entranceX == x && exit.entranceY == y)
        {
            var newRoomId = exit.destination;
            service.updateUserCurrentMap(socket.userId,newRoomId);

            broadcastRemovePlayer(socket);

            socket.join(newRoomId);
            socket.leave(socket.player.roomId);

            socket.player.roomId = newRoomId;
            socket.player.x = exit.exitX;
            socket.player.y = exit.exitY-1;

            emitYou(socket);
            var that = socket;
            service.getMap(socket.player.roomId,function(map) {
                that.world = map;
                that.emit("map", that.world);
                emitPlayers(that,io);
                broadcastNewPlayer(that);
            });
            return true;
        }
    }
    return false;
}

function onFireBullet(data)
{
    console.log("Bullet fired with x:"+data.x+" y:"+data.y+" direction:"+data.direction);
    var socket = this;
    var map = socket.world;
    var moveFunction;
    var compareFunction;
    var cellPerSecond = 6;
    var deltaMilliSeconds = 100; // ms
    var cellPerDelta = (cellPerSecond/1000) * deltaMilliSeconds;
    switch(data.direction)
    {
        case 0:
            moveFunction = function(){
             this.x-=cellPerDelta;
            };
            compareFunction = function(){
                return bullet.x > 0;
            };
            break;
        case 1:
            moveFunction = function(){
                this.x+=cellPerDelta;
            };
            compareFunction = function(){
                return bullet.x < map.width
            };
            break;
        case 2:
            moveFunction = function(){
                this.y-=cellPerDelta;
            };
            compareFunction = function(){
                return bullet.y > 0
            };
            break;
        case 3:
            moveFunction = function(){
                this.y+=cellPerDelta;
            };
            compareFunction = function(){
                return bullet.y < map.height
            };
            break;
    }
    var bullet = {
        id : Math.floor((Math.random() * 1000000000) + 1),
        x : data.x,
        y : data.y,
        move : moveFunction,
        compare: compareFunction
    };
    var bulletMover = setInterval(function(){
        if(bullet.compare())
        {
            console.log("Bullet moved to x:"+bullet.x+" y:"+bullet.y);
            socket.to(socket.player.roomId).emit("move bullet", {id: bullet.id, x: bullet.x, y:bullet.y});
            socket.emit("move bullet", {id: bullet.id, x: bullet.x, y:bullet.y});
            bullet.move();
        }
        else
        {
            clearInterval(bulletMover);
            socket.to(socket.player.roomId).emit("remove bullet", bullet.id);
            socket.emit("remove bullet", bullet.id);
        }
    }, deltaMilliSeconds);
}

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