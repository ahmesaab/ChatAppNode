/**
 * Created by Ahmed on 3/19/2016.
 */

var speed = 0.1;
var stage;


function startAnimation()
{
    var pokemonCanvas = document.getElementById("pokemonCanvas");
    var mapCanvas = document.getElementById("mapCanvas");
    var mapCanvasContext = mapCanvas.getContext("2d");
    stage = new createjs.Stage(pokemonCanvas);

    // Maximise the Map & Pokemon Canvas
    pokemonCanvas.width = window.innerWidth;
    pokemonCanvas.height = window.innerHeight;
    mapCanvas.width = window.innerWidth;
    mapCanvas.height = window.innerHeight;

    addWorldTilesToStage(pokemonCanvas);
    addHousesToStage(pokemonCanvas);
    addPathToStage(pokemonCanvas);
    addPlayerToStage(localPlayer);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setInterval(30);
    createjs.Ticker.addEventListener("tick", tick);


    function tick(event)
    {
        var movement = getMovement(localPlayer);
        if(movement[0] != 0 || movement[1] !=0)
        {
            var deltaZ = event.delta * speed;
            localPlayer.grant.x = localPlayer.grant.x + ( deltaZ * movement[0]);
            localPlayer.grant.y = localPlayer.grant.y + ( deltaZ * movement[1]);
            localPlayer.setX(localPlayer.grant.x);
            localPlayer.setY(localPlayer.grant.y);
            socket.emit("move player",
                {
                    x: localPlayer.grant.x,
                    y: localPlayer.grant.y,
                    frame: localPlayer.grant.currentFrame
                });
        }
        drawMap(mapCanvasContext,mapCanvas);
        stage.update(event);
    }
}

function drawMap(ctx,canvas) {
    // Wipe the canvas clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the local player
    localPlayer.draw(ctx);

    for (var i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    };

};


function addPlayerToStage(player)
{
    var color = "";
    if(player.color==1)
    {
        color = "green-";
    }
    // Define a spritesheet. Note that this data was exported by Zoë.
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["images/"+color+"pokemon-trainer.png"],
        "frames": { "height": 50, "count": 16, "width": 50},
        "animations": {
            "left": [4, 7,"left",0.5],
            "right": [8, 11,"right",0.5],
            "up":[12,15,"up",0.5],
            "down":[0,3,"down",0.5],
            "staionaryLeft" : 4,
            "staionaryRight" : 8,
            "staionaryDown" : 0,
            "staionaryUp" : 12
        }
    });

    var grant = new createjs.Sprite(spriteSheet, "staionaryDown");
    grant.x = player.getX();
    grant.y = player.getY();
    grant.speed = speed;

    player.grant = grant;

    grant.on('animationend',function(e){
        player.playing = false;
    });

    // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
    stage.addChild(player.grant);
}

function addWorldTilesToStage(canvas)
{
    var background = new createjs.Container();
    for (var y = 0; y < canvas.height; y+=16) {
        for (var x = 0; x < canvas.width; x+=16) {
            var tile = new createjs.Bitmap('images/pokemon_grass_tile.png');
            tile.x = x ;
            tile.y = y ;
            background.addChild(tile);
        }
    }
    //background.cache(0, 0, mapWidth, mapHeight);
    stage.addChild(background);
}

function addHousesToStage(canvas)
{
    var house = new createjs.Bitmap('images/pokemon-center.png');
    house.x = canvas.width/2;
    house.y = canvas.height/4;
    stage.addChild(house);
}

function addPathToStage(canvas)
{
    var path = new createjs.Container();
    for (var y =  (canvas.height/2)-(16*4); y < (canvas.height/2)+(16*4); y+=16) {
        for (var x = 0; x < canvas.width; x+=16) {
            var tile = new createjs.Bitmap('images/path-tile.png');
            tile.x = x ;
            tile.y = y ;
            path.addChild(tile);
        }
    }
    stage.addChild(path);
}