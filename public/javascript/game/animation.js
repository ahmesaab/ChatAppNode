/**
 * Created by Ahmed on 3/19/2016.
 */

var speed = 0.1;
var stage;
var startTicker = true;

function drawMap(pokemonCanvas)
{
    //GLOBAL WARNING: reads the graphicsMap,navigationMap, & assets

    var widthCell = window.innerWidth/navigationMap.width;
    var heightCell = window.innerHeight/navigationMap.height;
    navigationMap.cellLength = widthCell < heightCell ? widthCell : heightCell;
    pokemonCanvas.width = navigationMap.cellLength * navigationMap.width ;
    pokemonCanvas.height = navigationMap.cellLength * navigationMap.height;

    repositionSideBar();

    document.getElementsByClassName("panel-body").height = pokemonCanvas.height;
    var background = new createjs.Container();
    for (var i = 0; i < navigationMap.width; i++)
    {
        for (var j = 0; j < navigationMap.height; j++)
        {
            var drawObjectInfo = graphicsMap[i][j];
            var tile = new createjs.Bitmap('images/'+drawObjectInfo.src);
            tile.scaleX = navigationMap.cellLength/drawObjectInfo.pixelwidth;
            tile.scaleY = navigationMap.cellLength/drawObjectInfo.pixelheight;
            tile.x = i * navigationMap.cellLength;
            tile.y = j * navigationMap.cellLength;
            background.addChild(tile);
        }
    }
    background.name = 'background';
    stage.addChild(background);

    //var menuButton = new createjs.Bitmap("/images/button.png");
    //menuButton.x = 400;
    //menuButton.y = 10;
    //menuButton.alpha = 0.5;
    //menuButton.scaleX = navigationMap.cellLength/800 * 5;
    //menuButton.scaleY = navigationMap.cellLength/344 * 2;
    //
    //menuButton.addEventListener("click",function handleClick(event) {
    //    $("#serverModal").modal('show')
    //});
    //
    //var chatHistoryButton = new createjs.Bitmap("/images/button.png");
    //chatHistoryButton.alpha = 0.5;
    //chatHistoryButton.scaleX = navigationMap.cellLength/800 * 5;
    //chatHistoryButton.scaleY = navigationMap.cellLength/344 * 2;
    //chatHistoryButton.x = pokemonCanvas.width - (chatHistoryButton.image.width*chatHistoryButton.scaleX) - 10;
    //chatHistoryButton.y = 10;
    //
    //chatHistoryButton.addEventListener("click",function handleClick(event) {
    //    $("#wrapper").toggleClass("toggled");
    //});
    //
    //stage.addChild(menuButton);
    //stage.addChild(chatHistoryButton);

    var assetsBitmaps = createAssetsFromArray(assets);
    for(var i in assetsBitmaps)
    {
        stage.addChild(assetsBitmaps[i]);
    }
}

function createAssetsFromArray(array)
{
    var assets = new Array();
    for (var i = 0; i < array.length; i++)
    {
        var assetInfo = array[i];
        var asset = new createjs.Bitmap('images/'+assetInfo.src);
        asset.scaleX = (navigationMap.cellLength * assetInfo.width)/assetInfo.pixelwidth;
        asset.scaleY = (navigationMap.cellLength*assetInfo.height)/assetInfo.pixelheight;
        asset.x = assetInfo.x * navigationMap.cellLength;
        asset.y = assetInfo.y * navigationMap.cellLength;
        asset.yBase = assetInfo.yBase * navigationMap.cellLength;
        assets.push(asset);
    }
    return assets;
}

function sortByY (obj1, obj2) {
    if(obj1.name == 'background') { return -1}
    if(obj2.name == 'background') {return 1}
    if (obj1.yBase > obj2.yBase) { return 1; }
    if (obj1.yBase < obj2.yBase) { return -1; }
    return 0;
}

function startAnimation()
{
    var pokemonCanvas = document.getElementById("pokemonCanvas");
    stage = new createjs.Stage(pokemonCanvas);


    drawMap(pokemonCanvas);
    addPlayerToStage(localPlayer,'localplayer');

    stage.sortChildren(sortByY);

    if(startTicker)
    {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setInterval(30);
        createjs.Ticker.addEventListener("tick", tick);
    }
    else
    {
       createjs.Ticker.paused = false;
    }

    var moving = false;
    var changingRoom = false;

    function clearAll()
    {
        startTicker = false;
        console.log("Clear Stage & Pause Ticker");
        createjs.Ticker.paused = true;
        stage.removeAllChildren();
        remotePlayers=[];
        changingRoom = false;
    }

    function validateMove(newX,newY)
    {
        var corners = [
            {x:newX+navigationMap.cellLength,y:newY+navigationMap.cellLength},
            {x:newX+navigationMap.cellLength,y:newY+(2*navigationMap.cellLength)},
            {x:newX,y:newY+navigationMap.cellLength},
            {x:newX,y:newY+(2*navigationMap.cellLength)}
        ];

        for(var i=0;i<corners.length;i++)
        {
            var x = Math.round(corners[i].x/navigationMap.cellLength);
            var y = Math.round(corners[i].y/navigationMap.cellLength)
            var cellValue = navigationMap[x][y];
            if(cellValue=== null && !changingRoom)
            {
                changingRoom = true;
                clearAll();
                changeRoom(x,y);
                return null;
            }
            else if(!cellValue)
            {
                return false;
            }
        }
        return true;
    }


    function tick(event)
    {
        var movement = getMovement(localPlayer);
        if(movement[0] != 0 || movement[1] !=0)
        {
            var deltaZ = event.delta * speed;
            var newX = localPlayer.grant.x + ( deltaZ * movement[0]);
            var newY = localPlayer.grant.y + ( deltaZ * movement[1]);
            var validMove = validateMove(newX,newY);
            try
            {
                console.log(validMove)
                if(validMove)
                {
                    moving = true;
                    localPlayer.grant.x = newX;
                    localPlayer.grant.y = newY;
                    localPlayer.grant.yBase = newY + ( 1 * navigationMap.cellLength);
                    localPlayer.x = localPlayer.grant.x;
                    localPlayer.y = localPlayer.grant.y;
                    socket.emit("move player",
                        {
                            x: localPlayer.grant.x/navigationMap.cellLength,
                            y: localPlayer.grant.y/navigationMap.cellLength,
                            frame: localPlayer.grant.currentFrame
                        });
                }
                stage.sortChildren(sortByY);
            }
            catch(err)
            {
                console.log("ERROR: "+err);
            }
        }
        else if(moving)
        {
            moving = false;
            socket.emit("stop player",localPlayer.grant.currentAnimation);
        }
        stage.update(event);
    }
}

function addPlayerToStage(player,name)
{
    var spriteSheetConfig = getSpriteConfig(player.color);
    var spriteSheet = new createjs.SpriteSheet(spriteSheetConfig);
    var grant = new createjs.Sprite(spriteSheet, "staionaryDown");

    grant.scaleX = (navigationMap.cellLength / spriteSheetConfig.frames.width) * spriteSheetConfig.scale.x;
    grant.scaleY = (navigationMap.cellLength / spriteSheetConfig.frames.height) * spriteSheetConfig.scale.y;

    grant.x = player.x * navigationMap.cellLength;
    grant.y = player.y * navigationMap.cellLength;
    grant.yBase = grant.y;

    grant.speed = speed;
    grant.name = name;

    player.grant = grant;

    grant.on('animationend', function (e) {
        player.playing = false;
    });

    // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
    stage.addChild(player.grant);
}


