function createGame()
{
    // private attributes

    var _map;
    var _stage;
    var _localPlayer;
    var _remotePlayers;
    var _cellLength;

    //private functions

    var _sortByY =  function(obj1, obj2)
    {
        if(obj1.name == 'background') { return -1}
        if(obj2.name == 'background') {return 1}
        if (obj1.yBase > obj2.yBase) { return 1; }
        if (obj1.yBase < obj2.yBase) { return -1; }
        return 0;
    };

    var _createAssetsFromArray = function(assets)
    {
        var assetsBitmaps = [];
        for (var i = 0; i < assets.length; i++)
        {
            var assetInfo = assets[i];
            var asset = new createjs.Bitmap('images/'+assetInfo.src);
            asset.scaleX = (_cellLength * assetInfo.width)/assetInfo.pixelwidth;
            asset.scaleY = (_cellLength * assetInfo.height)/assetInfo.pixelheight;
            asset.x = assetInfo.x * _cellLength;
            asset.y = assetInfo.y * _cellLength;
            asset.yBase = assetInfo.yBase * _cellLength;
            assetsBitmaps.push(asset);
        }
        return assetsBitmaps;
    };

    var _drawMap = function()
    {
        if( typeof _stage == 'undefined')
            _stage = new createjs.Stage(ui.getGameCanvas());
        else
            _stage.removeAllChildren();
        var background = new createjs.Container();
        for (var i = 0; i < _map.width; i++)
        {
            for (var j = 0; j < _map.height; j++)
            {
                var cell = _map.map[i][j];
                var tile = new createjs.Bitmap('images/'+cell.src);
                tile.scaleX = _cellLength / cell.pixelwidth;
                tile.scaleY = _cellLength / cell.pixelheight;
                tile.x = i * _cellLength;
                tile.y = j * _cellLength;
                background.addChild(tile);
            }
        }
        background.name = 'background';
        _stage.addChild(background);
        var assetsBitmaps = _createAssetsFromArray(_map.assets);
        for(var index in assetsBitmaps)
        {
            _stage.addChild(assetsBitmaps[index]);
        }
    };

    var _sort = function()
    {
        _stage.sortChildren(_sortByY);
    };

    var _getPlayerById = function(id)
    {
        for (var i = 0; i < _remotePlayers.length; i++) {
            if (_remotePlayers[i].socketId == id)
                return _remotePlayers[i];
        }
        return false;
    };

    var _tick =  function(event)
    {
        _stage.update(event);
    };

    // public functions

    return {
        setMap:function(data,cellLength)
        {
            _map = data;
            _cellLength = cellLength;
        },

        setLocalPlayer:function(player)
        {
            _localPlayer = player;
        },

        getLocalPlayer:function()
        {
            return _localPlayer;
        },

        start:function()
        {
            _drawMap();
            _remotePlayers = [];
            this.addPlayer(_localPlayer);
            if(!createjs.Ticker.paused)
            {
                createjs.Ticker.timingMode = createjs.Ticker.RAF;
                createjs.Ticker.setInterval(30);
                createjs.Ticker.addEventListener("tick", _tick);
            }
        },

        movePlayer:function(playerId,x,y)
        {
            console.log("Player with "+playerId+" moved to x:"+x+" y:"+y);
            var movePlayer = _getPlayerById(playerId);
            if (!movePlayer) {
                console.log("Couldn't move player with id "+playerId+" because player id was not found");
            }
            else
            {
                var newX = x * _cellLength;
                var newY = y * _cellLength;
                var oldX = movePlayer.grant.x;
                var oldY = movePlayer.grant.y;
                var direction;
                if (newX > oldX)
                    direction = "right";
                else if (oldX > newX)
                    direction = "left";
                else if (newY > oldY)
                    direction = "down";
                else if (oldY > newY)
                    direction = "up";
                if(direction !== movePlayer.grant.currentAnimation){
                    movePlayer.grant.gotoAndPlay(direction);
                    movePlayer.playing = true;
                }
                movePlayer.grant.x = newX;
                movePlayer.grant.y = newY;
                movePlayer.grant.yBase = newY;
                movePlayer.x = x;
                movePlayer.y = y;
                _sort();
            }
        },

        stopPlayer:function(playerId,frame)
        {
            console.log("Player "+playerId+" stopped");
            var movePlayer = _getPlayerById(playerId);
            if (!movePlayer) {
                console.log("Couldn't stop Player with id "+playerId+" because id was not found");
            }
            else
            {
                movePlayer.playing = false;
                movePlayer.grant.gotoAndPlay(frame);
            }
        },

        addMessage:function(playerId,msg)
        {
            var player = _getPlayerById(playerId);
            if(player)
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
                image.src = "images/chat-bubble.png";
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

                _stage.addChild(textBubble);
                _stage.update();

                createjs.Tween.get(textBubble).to({alpha: 0},1000*lineNum+4000).call(function(){
                    _stage.removeChild(textBubble);
                });
            }
            else
            {
                console.log("Couldn't add Player message to game because player with id "+playerId+" was not found");
            }

        },

        addPlayer:function(player)
        {
            //TODO: Change color to shape

            var spriteSheetConfig = configs.getSpriteConfig(player.color);
            spriteSheetConfig.framerate = player.frameRate;
            var spriteSheet = new createjs.SpriteSheet(spriteSheetConfig);
            var grant = new createjs.Sprite(spriteSheet, "stationarydown");

            grant.scaleX = (_cellLength / spriteSheetConfig.frames.width) * spriteSheetConfig.scale.x;
            grant.scaleY = (_cellLength / spriteSheetConfig.frames.height) * spriteSheetConfig.scale.y;
            grant.x = player.x * _cellLength;
            grant.y = player.y * _cellLength;
            grant.yBase = grant.y;

            player.grant = grant;
            player.playing = false;

            _remotePlayers.push(player);
            _stage.addChild(player.grant);
            _sort();
        },

        removePlayer:function(playerId)
        {
            var player = _getPlayerById(playerId);
            if (!player)
            {
                console.log("Couldn't remove Player with id"+playerId+" because player was not found");
            }
            else
            {
                _stage.removeChild(player.grant);
                _remotePlayers.splice(_remotePlayers.indexOf(playerId), 1);
                console.log("Player "+playerId+" was disconnected");
                // TODO: display player removal on UI
            }
        }
    }

}
