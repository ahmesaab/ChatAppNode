/**
 * Created by Ahmed on 3/4/2016.
 */
var db = require('./db.js');
var User = require('../models/user.js');
var Message = require('../models/message.js');

function Service()
{
    // ATTRIBUTE: database connection object from mysql pool.
    this._connection = db.get();
}

// METHOD: query the database by user_id & returns a user model or null if the user doesn't exist.
Service.prototype.getUser = function(id,callback)
{
    this._connection.query('SELECT * FROM users WHERE id=?',id,
        function(err, rows)
        {
            var user = null;
            if(err)
            {
                console.log(err);
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
                        parseInt(rows[0].current_map_id),
                        String(rows[0].status),
                        parseInt(rows[0].facebook_id),
                        parseFloat(rows[0].speed),
                        parseInt(rows[0].frame_rate)
                    );
                }
            }
            callback(user);
        }
    );
};

// METHOD: query the database by facebook_id & returns a user model or null if the user doesn't exist.
Service.prototype.getUserByFacebookId = function(facebookId,callback)
{
    this._connection.query('SELECT * FROM users WHERE facebook_id=?',facebookId,
        function(err, rows)
        {
            var user = null;
            if(err)
            {
                console.log(err);
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
                        parseInt(rows[0].current_map_id),
                        String(rows[0].status),
                        parseInt(rows[0].facebook_id));
                }
            }
            callback(user);
        }
    );
};

// METHOD: query the database & returns list of all users in the user table.
Service.prototype.getUsers = function(callback)
{
    this._connection.query('SELECT * FROM users',
        function(err, rows) {
            var users = [];
            if(err)
            {
                console.log(err);
            }
            else
            {
                for (var i = 0; i < rows.length; i++) {
                    users.push(new User(
                        parseInt(rows[i].id),
                        String(rows[i].first_name),
                        String(rows[i].last_name),
                        String(rows[i].nick_name),
                        parseInt(rows[i].shape),
                        parseInt(rows[i].color)));
                }
            }
            callback(users);
        }
    );
};

// METHOD: update the status field for a user with a given user_id to 'online'.
Service.prototype.connectUser = function(userId)
{
    this._connection.query("UPDATE users SET status='online' WHERE id=" + userId);
};

// METHOD: update the status field for a user with a given user_id to 'offline'.
Service.prototype.disconnectUser = function(userId)
{
    this._connection.query("UPDATE users SET status='offline' WHERE id="+userId);
};

// METHOD: insert a new message given the user and map/room where the message was sent.
Service.prototype.addMessage = function(userId,mapId,message)
{
    this._connection.query("INSERT INTO messages(user_id,map_id,content,time_stamp)" +
    " values ("+userId+","+mapId+",?,NOW())",[message]);
};

// METHOD: insert a new user given the user holder object (will be changed later).
Service.prototype.addNewUser = function(data,callback)
{
    this._connection.query("INSERT INTO users(first_name,last_name,nick_name,shape,color,x,y,current_map_id,status," +
    "facebook_id) values ('"+data.firstName+"','"+data.lastName+"','"+data.nickName+"',"+data.shape+","+data.color+","+
    data.x+","+data.y+","+data.roomId+",'"+data.status+"',"+data.facebookId+")",function(err, result){
        if (err) throw err;
        callback(result.insertId)});
};

// METHOD: update the user location to the given x & y.
Service.prototype.updatePosition =  function(userId,x,y)
{
    this._connection.query("UPDATE users SET x="+x+",y="+y+" WHERE id="+userId);
};

// METHOD: update the user map/room to the given map_id
Service.prototype.updateUserCurrentMap =  function(userId,mapId)
{
    this._connection.query("UPDATE users SET current_map_id="+mapId+" WHERE id="+userId);
};

// METHOD: query the database to get an object representation of a map given it's id.
Service.prototype.getMap = function(mapId,callback)
{
    var connection = this._connection;
    var sql = 'SELECT * FROM map WHERE id = '+mapId;
    connection.query(sql,function(err,rows){
        if(err)
        {
            console.log(err);
        }
        else
        {
            var worldWidth=rows[0].width;
            var worldHeight=rows[0].height;
            var worldName = rows[0].name;
            connection.query(
                'SELECT '+
                'a.id as assetId,'+
                'a.src as assetSrc,'+
                'a.width as assetWidth,'+
                'a.height as assetHeight,'+
                'a.pixel_width as assetPixelWidth,'+
                'a.pixel_height as assetPixelHeight,'+
                'a.z_start as zStart,'+
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
                        var map = new Array(worldWidth);
                        var assets = new Array();
                        var exits = new Array();
                        for (var i = 0; i < worldWidth; i++)
                        {
                            map[i] = new Array(worldHeight);
                        }
                        for (var i = 0; i < rows.length; i++)
                        {
                            var row = rows[i];
                            var drawObjectInfo = new Object();
                            var value;
                            drawObjectInfo.src = row.assetSrc;
                            drawObjectInfo.pixelwidth = row.assetPixelWidth;
                            drawObjectInfo.pixelheight = row.assetPixelHeight;
                            if(row.is_background === 'true')
                            {
                                if(row.navigation === "true")
                                {
                                    value=true;
                                }
                                else if(row.navigation === "false")
                                {
                                    value=false;
                                }
                                else
                                {
                                    value=null;
                                }
                                drawObjectInfo.value = value;
                                map[row.x][row.y]=drawObjectInfo;
                            }
                            else
                            {
                                drawObjectInfo.x = row.x;
                                drawObjectInfo.y = row.y;
                                drawObjectInfo.width=row.assetWidth;
                                drawObjectInfo.height=row.assetHeight;
                                drawObjectInfo.yBase = row.y + row.zStart;
                                assets.push(drawObjectInfo);
                                for (var u = row.zStart; u < drawObjectInfo.height; u++) {
                                    for (var v = 0; v < drawObjectInfo.width; v++) {
                                        map[row.x + v][row.y + u].value = false;
                                    }
                                }
                            }
                        }
                        connection.query('SELECT * FROM map_exit WHERE first_map_id='+mapId,function(err,rows) {
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
                                    map: map, width: worldWidth,
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

// METHOD: updates an attribute for a user.
Service.prototype.changeAttribute = function(attribute,value,id,callback)
{
    this._connection.query('UPDATE users SET '+attribute+'='+value+' WHERE id='+id,
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
};

// METHOD: query the database to get the latest x messages for a specific map_id.
Service.prototype.getMessages = function(mapId,count,callback)
{
    this._connection.query('SELECT * FROM (SELECT nick_name,content,time_stamp FROM messages ' +
        'INNER JOIN users on users.id = user_id WHERE map_id='+mapId +
        ' order by time_stamp DESC LIMIT '+count+') sub ORDER BY time_stamp ASC',
        function(err, rows)
        {
            var messages = [];
            if(err)
            {
                console.log(err);
            }
            else
            {
                for (var i = 0; i < rows.length; i++) {
                    messages.push({nickName:String(rows[i].nick_name),
                        content:String(rows[i].content),timeStamp:String(rows[i].time_stamp)});
                }
            }
            callback(messages);
        }
    );
};

module.exports = Service;