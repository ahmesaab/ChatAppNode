function createGame()
{
    // private attributes
    //--------------------------------------------------
    var _map;
    var _stage;
    var _localPlayer;
    var _remotePlayers;
    var _bullets;
    var _cellLength;
    var _movement = "stationarydown";
    const _networkDelay = configs.networkDelay;

    // private functions
    //---------------------------------------------------

    var _emitMovePlayer;

    var _sortByY =  function(obj1, obj2)
    {
        if(obj1.name == 'background' || obj1.name == 'bullets') { return -1}
        if(obj2.name == 'background' || obj2.name == 'bullets')  {return 1}
        if(obj1.yBase > obj2.yBase) { return 1; }
        if(obj1.yBase < obj2.yBase) { return -1; }
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
        var bullets = new createjs.Container();
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
        bullets.name = 'bullets';
        _stage.addChild(background);
        _stage.addChild(bullets);
        var assetsBitmaps = _createAssetsFromArray(_map.assets);
        for(var index in assetsBitmaps)
        {
            _stage.addChild(assetsBitmaps[index]);
        }
        _stage.on("click", function(evt) {
            _localPlayer.x  = evt.stageX - _cellLength;
            _localPlayer.y = evt.stageY - _cellLength;
            _localPlayer.playing = true;
        });
    };

    var _addBullet = function(id,x,y)
    {
        var graphics = new createjs.Bitmap("/images/pokeballscaled.png");
        graphics.x = x * _cellLength;
        graphics.y = y * _cellLength;
        graphics.scaleX = _cellLength / graphics.image.width;
        graphics.scaleY = _cellLength / graphics.image.height;
        graphics.regX = graphics.image.width/2;
        graphics.regY = graphics.image.height/2;
        graphics.rotationSpeed = 20;

        var bullet = {
            x : graphics.x,
            y : graphics.y,
            graphics : graphics,
            speed : 5.9
        };

        _bullets[id] = bullet;
        _stage.getChildByName('bullets').addChild(bullet.graphics);
    }

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

    var _interpolateBullets = function(delta)
    {
        for(var id in _bullets)
        {
            var bullet = _bullets[id];
            bullet.graphics.rotation+=bullet.graphics.rotationSpeed;
            if(bullet.graphics.x != bullet.x || bullet.graphics.y != bullet.y)
            {
                var cellPerSecond = bullet.speed;
                var pixelPerSecond = cellPerSecond * _cellLength;
                var pixels = delta/1000*pixelPerSecond ;
                if(bullet.x < bullet.graphics.x)
                {
                    bullet.graphics.x = bullet.graphics.x - pixels;
                }
                else if(bullet.x > bullet.graphics.x)
                {
                    bullet.graphics.x = bullet.graphics.x + pixels;
                }
                else if(bullet.y < bullet.graphics.y)
                {
                    bullet.graphics.y = bullet.graphics.y - pixels;
                }
                else if(bullet.y > bullet.graphics.y)
                {
                    bullet.graphics.y = bullet.graphics.y + pixels;
                }
            }
        }
    };

    var _interpolatePlayers = function(delta)
    {
        for(var i=0;i<_remotePlayers.length;i++)
        {
            var player = _remotePlayers[i];
            if(player.playing)
            {
                var direction;
                var cellPerSecond = player.speed;
                var pixelPerSecond = cellPerSecond * _cellLength;
                var pixels = delta/1000*pixelPerSecond ;

                if (player.x - player.grant.x >= pixels){
                    direction = "right";
                    player.grant.x = player.grant.x + pixels;
                }
                else if (player.grant.x - player.x >= pixels) {
                    direction = "left";
                    player.grant.x = player.grant.x - pixels;
                }
                else if (player.y - player.grant.y >= pixels) {
                    direction = "down";
                    player.grant.y = player.grant.y + pixels;
                    player.grant.yBase = player.grant.y;
                }
                else if (player.grant.y - player.y >= pixels) {
                    direction = "up";
                    player.grant.y = player.grant.y - pixels;
                    player.grant.yBase = player.grant.y;
                }
                else
                {
                    player.grant.gotoAndPlay("stationary" + player.grant.currentAnimation);
                    player.playing = false;
                }

                if(typeof direction !=='undefined' && direction !== player.grant.currentAnimation){
                    player.grant.gotoAndPlay(direction);
                }
            }
        }
    };

    var _tick =  function(event)
    {
        var cellPerSecond = _localPlayer.speed;
        var pixelPerSecond = cellPerSecond * _cellLength;
        var pixels = event.delta/1000*pixelPerSecond;
        console.log(event.delta);
        if(_movement.indexOf("stationary"))
        {
            switch(_movement)
            {
                case "left":
                    _localPlayer.grant.x = _localPlayer.grant.x - pixels;
                    break;
                case "right":
                    _localPlayer.grant.x = _localPlayer.grant.x + pixels;
                    break;
                case "up":
                    _localPlayer.grant.y = _localPlayer.grant.y - pixels;
                    _localPlayer.grant.yBase = _localPlayer.grant.y;
                    break;
                case "down":
                    _localPlayer.grant.y = _localPlayer.grant.y + pixels;
                    _localPlayer.grant.yBase = _localPlayer.grant.y;
            }

            _emitMovePlayer(_localPlayer.grant.x/_cellLength,_localPlayer.grant.y/_cellLength);

        }

        if(_localPlayer.grant.currentAnimation !== _movement)
        {
            _localPlayer.grant.gotoAndPlay(_movement);
        }

        _interpolateBullets(event.delta);
        _interpolatePlayers(event.delta);
        _sort();
        _stage.update(event);
    };


    // public functions
    //---------------------------------------------------
    return {
        setEmitMovePlayer:function(method)
        {
            _emitMovePlayer = method;
        },

        setMovement:function(movement)
        {
            _movement = movement;
        },

        setMap:function(data,cellLength)
        {
            _map = data;
            _cellLength = cellLength;
        },

        setLocalPlayer:function(player)
        {
            _localPlayer = player;
        },

        getCellLength:function()
        {
            return _cellLength
        },

        getLocalPlayer:function()
        {
            return _localPlayer;
        },

        start:function()
        {
            _drawMap();
            _remotePlayers = [];
            _bullets = [];
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
            var movePlayer = _getPlayerById(playerId);
            if (!movePlayer){
                console.log("Couldn't move player with id "+playerId+" because player id was not found");
            }
            else
            {
                movePlayer.playing = true;
                movePlayer.x = x * _cellLength;
                movePlayer.y = y * _cellLength;
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
            player.getDirection = function(){
                switch(this.grant.currentAnimation) {
                    case "stationaryleft":
                    case "left":
                        return 0;
                        break;
                    case "stationaryright":
                    case "right":
                        return 1;
                        break;
                    case "stationaryup":
                    case "up":
                        return 2;
                        break;
                    case "stationarydown":
                    case "down":
                        return 3;
                        break;
                }
            };

            _remotePlayers.push(player);
            _stage.addChild(player.grant);
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
                ui.log("Player "+player.nickName+" left the room")
                console.log("Player "+playerId+" was disconnected");
            }
        },

        moveBullet:function(id,x,y)
        {
            if(id in _bullets)
            {
                var bullet = _bullets[id];
                bullet.x = x * _cellLength;
                bullet.y = y * _cellLength;
            }
            else
            {
                _addBullet(id,x,y);
            }
        },

        removeBullet:function(id)
        {
            if(id in _bullets)
            {
                var bullet = _bullets[id];
                _stage.getChildByName('bullets').removeChild(bullet.graphics)
                delete _bullets[id];
            }
            else
            {
                console.log("Couldn't remove bullet with id "+id+" because id not found")
            }
        },

        setLocalPlayerLocation:function(x,y)
        {
            _localPlayer.grant.x = x * _cellLength;
            _localPlayer.grant.y = y * _cellLength;
        }
    }

}
