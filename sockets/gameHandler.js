var Service = require('../data/service.js');
var Player = require("../models/player.js").Player;
var service = new Service();
var IO;
var Handler = function(socket,io)
{
    var user = socket.request.session.user;
    if(validate(user))
    {
        IO = io;
        service.getUser(user.id,function(updatedUser)
        {
            console.log(user.nickName+' connected to GAME with id='+socket.id+' in room '+updatedUser.roomId);
            socket.player = new Player(updatedUser,socket.id);

            emitYou(socket);
            emitMap(socket);
            emitPlayers(socket,io);

            socket.join(socket.player.roomId);

            socket.on("disconnect", onClientDisconnect);
            socket.on("move player", onMovePlayer);
            socket.on("change room", onChangeRoom);
            socket.on('message', onMessage);

            broadcastNewPlayer(socket);

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
    if(typeof this.player !=='undefined')
    {
        console.log("Player has disconnected: "+this.player.socketId);
        this.to(this.player.roomId).emit("remove player", {id: this.player.socketId});
    }
};

function getSomeMap()
{
    var worldWidth = 40;
    var worldHeight = 20;
    var drawObjectInfo ;

    var navigationMap = new Array(worldWidth);
    var drawMap = new Array(worldWidth);
    for (var i = 0; i < worldWidth; i++)
    {
        navigationMap[i] = new Array(worldHeight);
        drawMap[i] = new Array(worldHeight);
        for (var j = 0; j < worldHeight; j++)
        {
            navigationMap[i][j]=true;

            drawObjectInfo = new Object();
            drawObjectInfo.src = 'pokemon_grass_tile.png';
            drawObjectInfo.pixelwidth = 16;
            drawObjectInfo.pixelheight = 16;
            drawMap[i][j]=drawObjectInfo;
        }
    }

    drawObjectInfo = new Object();
    drawObjectInfo.src = 'path-tile.png';
    drawObjectInfo.pixelwidth = 16;
    drawObjectInfo.pixelheight = 16;

    navigationMap[5][5]=false;
    drawMap[5][5]=drawObjectInfo;

    drawObjectInfo = new Object();
    drawObjectInfo.src = 'outlet.png';
    drawObjectInfo.pixelwidth = 16;
    drawObjectInfo.pixelheight = 16;

    navigationMap[worldWidth-1][worldHeight/2]=null;
    navigationMap[worldWidth-1][worldHeight/2+1]=null;
    navigationMap[worldWidth-1][worldHeight/2-1]=null;
    drawMap[worldWidth-1][worldHeight/2]=drawObjectInfo;
    drawMap[worldWidth-1][worldHeight/2+1]=drawObjectInfo;
    drawMap[worldWidth-1][worldHeight/2-1]=drawObjectInfo;

    var assets = new Array();
    var asset1 = new Object();
    asset1.src = 'pokemon-center.png';
    asset1.x = 14;
    asset1.y = 3;
    asset1.pixelwidth = 89;
    asset1.pixelheight = 112;
    asset1.width=3;
    asset1.height=4;
    assets.push(asset1);
    for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        for (var u = 0; u < asset.width; u++) {
            for (var v = 0; v < asset.height; v++) {
                navigationMap[asset.x + u][asset.y + v] = false;
            }
        }
    }
    return {navMap:navigationMap, draMap:drawMap,width:worldWidth,height:worldHeight,assets:assets};
}

function getSomeMap2()
{
    var worldWidth = 40;
    var worldHeight = 20;
    var drawObjectInfo ;

    var navigationMap = new Array(worldWidth);
    var drawMap = new Array(worldWidth);
    var assets = new Array();
    for (var i = 0; i < worldWidth; i++)
    {
        navigationMap[i] = new Array(worldHeight);
        drawMap[i] = new Array(worldHeight);
        for (var j = 0; j < worldHeight; j++)
        {
            navigationMap[i][j]=true;

            drawObjectInfo = new Object();
            drawObjectInfo.src = 'pokemon_grass_tile.png';
            drawObjectInfo.pixelwidth = 16;
            drawObjectInfo.pixelheight = 16;
            drawMap[i][j]=drawObjectInfo;
        }
    }

    navigationMap[0][worldHeight/2]=null;
    navigationMap[0][worldHeight/2+1]=null;
    navigationMap[0][worldHeight/2-1]=null;

    drawObjectInfo = new Object();
    drawObjectInfo.src = 'outlet.png';
    drawObjectInfo.pixelwidth = 16;
    drawObjectInfo.pixelheight = 16;

    drawMap[0][worldHeight/2]=drawObjectInfo;
    drawMap[0][worldHeight/2+1]=drawObjectInfo;
    drawMap[0][worldHeight/2-1]=drawObjectInfo;

    return {navMap:navigationMap, draMap:drawMap,width:worldWidth,height:worldHeight,assets:assets};
}

function onMovePlayer(data)
{
    var navMap = this.world.navMap;
    try
    {
        if(navMap[Math.round(data.x+1)][Math.round(data.y+1)]==true)
        {
            this.player.setX(data.x);
            this.player.setY(data.y);
            service.updatePosition(this.request.session.user.id,data.x,data.y);
            this.to(this.player.roomId).emit("move player", {id: this.player.socketId, x: this.player.getX(), y: this.player.getY(), frame: data.frame});
            console.log("Player "+this.player.nickName+" Moved to x="+data.x+" and y="+data.y+" broadcast sent to room "+this.player.roomId);
        }
        else
        {
            socket.disconnect();
        }
    }
    catch(err)
    {
        this.disconnect();
    }

};

function onMessage(message)
{
    var data = { 'message' : message, nickName : this.player.nickName, id: this.player.socketId };
    service.addMessage(this.request.session.user.id,this.player.roomId,message);
    this.to(this.player.roomId).emit('message', data);
    console.log("user " + this.player.nickName + " send this : " + message+" to broadcast "+this.player.roomId);
};

function onChangeRoom(data)
{
    service.updateRoom(this.request.session.user.id,data.roomId);

    broadcastRemovePlayer(this);

    this.player.roomId = data.roomId;

    this.join(data.roomId);
    this.leave(this.player.roomId);

    emitYou(this);
    emitMap(this);
    emitPlayers(this,IO);

    broadcastNewPlayer(this);
};

function validate(user)
{
   if(typeof user !== 'undefined')
       return true;
    else
       return false;
}

function emitYou(socket)
{
    socket.emit("you", {
        id: socket.player.socketId,
        x: socket.player.getX(),
        y: socket.player.getY(),
        nickName:socket.player.nickName,
        roomId: socket.player.roomId,
        shape: socket.player.shape,
        color:socket.player.color});
}

function emitMap(socket)
{
    if(socket.player.roomId==1)
    {
        socket.world = getSomeMap();
    }
    else
    {
        socket.world = getSomeMap2();
    }

    socket.emit("map",socket.world);
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
                socket.emit("new player", {
                    id: existingPlayer.socketId,
                    x: existingPlayer.getX(),
                    y: existingPlayer.getY(),
                    nickName: existingPlayer.nickName,
                    roomId: existingPlayer.roomId,
                    shape: existingPlayer.shape,
                    color: existingPlayer.color
                });
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
    socket.to(socket.player.roomId).emit("new player", {
        id: socket.player.socketId,
        x: socket.player.getX(),
        y: socket.player.getY(),
        nickName:socket.player.nickName,
        roomId: socket.player.roomId,
        shape: socket.player.shape,
        color:socket.player.color});
}

function broadcastRemovePlayer(socket)
{
    this.to(socket.player.roomId).emit("remove player", {id: socket.player.socketId});
}

module.exports = Handler;