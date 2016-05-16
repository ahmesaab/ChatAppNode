function game(data)
{
    this.map = data;
    this.stage = new createjs.Stage(ui.gameCanvs);
    this.localPlayer;
    this.remotePlayers=[];

    var cellLength = ui.scaleGameCanvas();
    var speed = 0.1;
    var moving = false;

    var validateMove =  function(newX,newY)
    {
        var corners = [
            {x:newX+cellLength,y:newY+cellLength},
            {x:newX+cellLength,y:newY+(2*cellLength)},
            {x:newX,y:newY+cellLength},
            {x:newX,y:newY+(2*cellLength)}
        ];

        for(var i=0;i<corners.length;i++)
        {
            var x = Math.round(corners[i].x/cellLength);
            var y = Math.round(corners[i].y/cellLength)
            var cellValue = this.map.data[x][y].value;
            if(cellValue===null)
            {
                return [null,x,y];
            }
            else if(!cellValue)
            {
                return false;
            }
        }
        return true;
    }

    var sortByY =  function(obj1, obj2)
    {
        if(obj1.name == 'background') { return -1}
        if(obj2.name == 'background') {return 1}
        if (obj1.yBase > obj2.yBase) { return 1; }
        if (obj1.yBase < obj2.yBase) { return -1; }
        return 0;
    }

    var createAssetsFromArray = function(assets)
    {
        var assetsBitmaps = new Array();
        for (var i = 0; i < assets.length; i++)
        {
            var assetInfo = assets[i];
            var asset = new createjs.Bitmap('images/'+assetInfo.src);
            asset.scaleX = (cellLength * assetInfo.width)/assetInfo.pixelwidth;
            asset.scaleY = (cellLength*assetInfo.height)/assetInfo.pixelheight;
            asset.x = assetInfo.x * cellLength;
            asset.y = assetInfo.y * cellLength;
            asset.yBase = assetInfo.yBase * cellLength;
            assetsBitmaps.push(asset);
        }
        return assetsBitmaps;
    }

    this.drawMap = function()
    {
        var background = new createjs.Container();
        for (var i = 0; i < this.map.width; i++)
        {
            for (var j = 0; j < this.map.height; j++)
            {
                var cell = this.map.data[i][j];
                var tile = new createjs.Bitmap('images/'+cell.src);
                tile.scaleX = cellLength / cell.pixelwidth;
                tile.scaleY = cellLength / cell.pixelheight;
                tile.x = i * cellLength;
                tile.y = j * cellLength;
                background.addChild(tile);
            }
        }
        background.name = 'background';
        this.stage.addChild(background);
        var assetsBitmaps = createAssetsFromArray(this.map.assets);
        for(var i in assetsBitmaps)
        {
            this.stage.addChild(assetsBitmaps[i]);
        }
    }

    this.sort = function()
    {
        this.stage.sortChildren(sortByY);
    }

    this.addPlayer = function(player,name)
    {
        //TODO: Change color to shape

        var spriteSheetConfig = configs.getSpriteConfig(player.color);
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

        this.remotePlayers.push(player)
        this.stage.addChild(player.grant);
    }

    this.removePlayer = function(player)
    {
        if (!player)
        {
            console.log("Player not found");
            return;
        }
        else
        {
            this.stage.removeChild(player.grant);
            this.remotePlayers.splice(this.remotePlayers.indexOf(player.scoketId), 1);
            console.log("Player "+player.socketId+" was disconnected");
        }

    }

    this.start = function()
    {
        this.drawMap();
        if(!createjs.Ticker.paused)
        {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.setInterval(30);
            createjs.Ticker.addEventListener("tick", this.tick);
        }
        else
        {
            createjs.Ticker.paused = false;
        }
    }

    this.tick =  function(event)
    {
        var movement = control.getMovement(this.localPlayer);
        if(movement[0] != 0 || movement[1] !=0)
        {
            var deltaZ = event.delta * speed;
            var newX = this.localPlayer.grant.x + ( deltaZ * movement[0]);
            var newY = this.localPlayer.grant.y + ( deltaZ * movement[1]);
            var validMove = validateMove(newX,newY);
            try
            {
                console.log(validMove)
                if(validMove)
                {
                    moving = true;
                    this.localPlayer.grant.x = newX;
                    this.localPlayer.grant.y = newY;
                    this.localPlayer.grant.yBase = newY + ( 1 * cellLength);
                    this.localPlayer.x = localPlayer.grant.x;
                    this.localPlayer.y = localPlayer.grant.y;
                    socket.emit("move player",
                        {
                            x: this.localPlayer.grant.x/cellLength,
                            y: this.localPlayer.grant.y/cellLength,
                            frame: this.localPlayer.grant.currentFrame
                        });
                }
                this.sort();
            }
            catch(err)
            {
                console.log("ERROR: "+err);
            }
        }
        else if(moving)
        {
            moving = false;
            socket.emit("stop player",this.localPlayer.grant.currentAnimation);
        }
        this.stage.update(event);
    }

    this.clear = function()
    {
        console.log("Clear Stage & Pause Ticker");
        createjs.Ticker.paused = true;
        this.stage.removeAllChildren();
        client.remotePlayers=[];
    }

    this.getPlayerById = function(id)
    {
        var i;
        for (i = 0; i < this.remotePlayers.length; i++) {
            if (this.remotePlayers[i].socketId == id)
                return this.remotePlayers[i];
        };
        return false;
    };

    this.addMessageToGame = function(msg, displayName, player)
    {
        var textBubble = new createjs.Container();

        var configWidth = 30;

        var fontSize = 20;
        var lineHeight = 22;

        var marginY = 15;
        var marginX = 10;


        var formattedMsg ='';
        var lineNum = 1;
        var maxCharactersPerLine;

        var i=0;
        for(i;i<msg.length;i++)
        {
            if(i%configWidth==0 && i!=0)
            {
                if(msg[i]==' ')
                {
                    formattedMsg+='\n';
                    lineNum++;
                    continue;
                }
                else if(msg[i-1]==' ')
                {
                    formattedMsg = formattedMsg.substr(0, i-1) + '\n' + formattedMsg.substr(i-1+'\n'.length);
                    lineNum++;
                }
                else
                {
                    var j=i;
                    for(j;j>0;j--)
                    {
                        if(formattedMsg[j]==' ')
                        {
                            formattedMsg = formattedMsg.substr(0, j) + '\n' + formattedMsg.substr(j+'\n'.length);
                            break;
                        }
                    }
                    if(j==0)
                    {
                        formattedMsg+='\n';
                    }
                    lineNum++;
                }
            }
            formattedMsg+=msg[i];
        }

        if(i<configWidth-1)
        {
            maxCharactersPerLine = i;
        }
        else
        {
            maxCharactersPerLine = configWidth-1;
        }


        var image = new Image();
        image.src = "images/chat-bubble.png"
        var sb = new createjs.ScaleBitmap(image, new createjs.Rectangle(15, 12, 3, 7));
        sb.x = player.grant.x-(maxCharactersPerLine*12)-5;
        sb.y = player.grant.y-(lineHeight*lineNum)-30;
        sb.setDrawSize((maxCharactersPerLine*12)+12+marginX,(lineHeight*lineNum)+lineHeight+fontSize+marginY);

        var text = new createjs.Text(formattedMsg, fontSize+"px Consolas", "#000000");
        text.x = sb.x + marginX;
        text.y = sb.y + marginY;
        text.lineHeight = lineHeight;

        textBubble.addChild(sb);
        textBubble.addChild(text);

        this.stage.addChild(textBubble);
        this.stage.update();

        createjs.Tween.get(textBubble).to({alpha: 0},1000*lineNum+4000).call(function(){
            this.stage.removeChild(textBubble);
        });

    }

}
