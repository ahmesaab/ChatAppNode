/**
 * Created by Ahmed on 3/4/2016.
 */
var DB = require('../data/database-open-shift.js');

var User = require('../models/user.js');

function Service() {
    var that = this;
    this.db = new DB();
    this.connection = this.db.getConnection();

    this.getUser = function(id,callback)
    {
        this.connection.query('SELECT * FROM users WHERE id='+id,
            function(err, rows)
            {
                var user = new User();
                if(err)
                {
                    console.log(err);
                    callback(undefined);
                }
                else
                {
                    if(rows.length>0)
                    {
                        user = new User(
                            parseInt(rows[0].id),
                            String(rows[0].first_name),
                            String(rows[0].last_name),
                            String(rows[0].nick_name),
                            parseInt(rows[0].shape),
                            parseInt(rows[0].color),
                            parseInt(rows[0].x),
                            parseInt(rows[0].y),
                            parseInt(rows[0].current_map_id));
                    }
                    callback(user);
                }
            }
        );
    };

    this.getUsers = function(callback)
    {
        this.connection.query('SELECT * FROM users',
            function(err, rows) {
                if(err)
                {
                    console.log(err);
                    callback(undefined);
                }
                else
                {
                    var users = [];
                    for (var i = 0; i < rows.length; i++) {
                        users.push(new User(
                            parseInt(rows[i].id),
                            String(rows[i].first_name),
                            String(rows[i].last_name),
                            String(rows[i].nick_name),
                            parseInt(rows[i].shape),
                            parseInt(rows[i].color)));
                    }
                    callback(users);
                }
            }
        );
    };

    this.addMessage = function(userId,mapId,message)
    {
        this.connection.query("INSERT INTO messages(user_id,map_id,content,time_stamp)" +
        " values ("+userId+","+mapId+",?,NOW())",[message]);
    };

    this.updatePosition =  function(userId,x,y)
    {
        this.connection.query("UPDATE users SET x="+x+",y="+y+" WHERE id="+userId);
    };

    this.updateUserCurrentMap =  function(userId,mapId)
    {
        this.connection.query("UPDATE users SET current_map_id="+mapId+" WHERE id="+userId);
    };

    this.getMap = function(mapId,callback)
    {
        var sql = 'SELECT * FROM map WHERE id = '+mapId;
        that.connection.query(sql,function(err,rows){
            if(err)
            {
                console.log(err);
            }
            else
            {
                var worldWidth=rows[0].width;
                var worldHeight=rows[0].height;
                var worldName = rows[0].name;
                that.connection.query(
                    'SELECT '+
                    'a.id as assetId,'+
                    'a.src as assetSrc,'+
                    'a.width as assetWidth,'+
                    'a.height as assetHeight,'+
                    'a.pixel_width as assetPixelWidth,'+
                    'a.pixel_height as assetPixelHeight,'+
                    'ma.x as x,'+
                    'ma.y as y,'+
                    'ma.is_background,'+
                    'ma.navigation '+
                    'FROM map_asset ma '+
                    'INNER JOIN asset a ON a.id = ma.asset_id '+
                    'WHERE ma.map_id ='+mapId,
                    function(err, rows)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            var navigationMap = new Array(worldWidth);
                            var drawMap = new Array(worldWidth);
                            var assets = new Array();
                            var exits = new Array();
                            for (var i = 0; i < worldWidth; i++)
                            {
                                navigationMap[i] = new Array(worldHeight);
                                drawMap[i] = new Array(worldHeight);
                            }
                            for (var i = 0; i < rows.length; i++)
                            {
                                var row = rows[i];
                                var drawObjectInfo = new Object();
                                drawObjectInfo.src = row.assetSrc;
                                drawObjectInfo.pixelwidth = row.assetPixelWidth;
                                drawObjectInfo.pixelheight = row.assetPixelHeight;
                                if(row.is_background === 'true')
                                {
                                    if(row.navigation === "true")
                                    {
                                        navigationMap[row.x][row.y]=true;
                                    }
                                    else if(row.navigation === "false")
                                    {
                                        navigationMap[row.x][row.y]=false;
                                    }
                                    else
                                    {
                                        navigationMap[row.x][row.y]=null;
                                    }
                                    drawMap[row.x][row.y]=drawObjectInfo;
                                }
                                else
                                {
                                    drawObjectInfo.x = row.x;
                                    drawObjectInfo.y = row.y;
                                    drawObjectInfo.width=row.assetWidth;
                                    drawObjectInfo.height=row.assetHeight;
                                    assets.push(drawObjectInfo);
                                    for (var u = 0; u < drawObjectInfo.height; u++) {
                                        for (var v = 0; v < drawObjectInfo.width; v++) {
                                            navigationMap[row.x + v][row.y + u] = false;
                                        }
                                    }
                                }
                            }
                            that.connection.query('SELECT * FROM map_exit WHERE first_map_id='+mapId,function(err,rows) {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    for (var i = 0; i < rows.length; i++)
                                    {
                                        var row = rows[i];
                                        var exit = new Object();
                                        exit.entranceX = row.first_map_x;
                                        exit.entranceY = row.first_map_y;
                                        exit.exitX = row.second_map_x;
                                        exit.exitY = row.second_map_y;
                                        exit.destination = row.second_map_id;
                                        exits.push(exit);
                                    }
                                    callback({
                                        navMap: navigationMap, draMap: drawMap, width: worldWidth,
                                        height: worldHeight, name:worldName, assets: assets, exits:exits
                                    });
                                }
                            });
                        }
                    }
                );
            }
        });
    };

    this.changeAttribute = function(attribute,value,id,callback)
    {
        if(attribute!=='shape' && attribute!=='color')
            callback(false);
        else
        {
            this.connection.query('UPDATE users SET '+attribute+'=? WHERE id='+id,[value],
                function(err)
                {
                    if(err)
                    {
                        console.log(err);
                        callback(false);
                    }
                    else
                        callback(true);
                }
            );
        }
    };

    this.close = function()
    {
        this.db.closeConnection();
    };

}

module.exports = Service;