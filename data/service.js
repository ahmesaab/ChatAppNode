/**
 * Created by Ahmed on 3/4/2016.
 */
var User = require('../models/user.js');
var Chat = require('../models/conversation.js');
var Message = require('../models/message.js');
var DB = require('../data/database.js');

function Service() {
    this.db = new DB();
    this.connection = this.db.getConnection();

    this.getUser = function(id,callback){
        this.connection.query('SELECT * FROM users WHERE id='+id,
            function(err, rows, fields)
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
                            String(rows[0].firstName),
                            String(rows[0].lastName),
                            String(rows[0].nickName),
                            parseInt(rows[0].shape),
                            parseInt(rows[0].color));
                    }
                    callback(user);
                }
            }
        );
    };

    this.getUsers = function(callback){
        this.connection.query('SELECT * FROM users',
            function(err, rows, fields) {
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
                            String(rows[i].firstName),
                            String(rows[i].lastName),
                            String(rows[i].nickName),
                            parseInt(rows[i].shape),
                            parseInt(rows[i].color)));
                    }
                    callback(users);
                }
            }
        );
    };

    this.getChats = function(id,callback){
        this.connection.query('SELECT c.id as chatId,u.id as userId,u.firstName,u.lastName,u.nickName,u.shape,u.color' +
            ',title FROM userconversation uc INNER JOIN conversation c ON uc.conversationID=c.ID ' +
            'INNER JOIN users u ON u.id = c.ownerID WHERE userID='+id,
            function(err, rows, fields) {
                if(err)
                {
                    console.log(err);
                    callback(undefined);
                }
                else
                {
                    var chats = [];
                    for (var i = 0; i < rows.length; i++) {
                        chats.push(
                            new Chat(
                                parseInt(rows[i].chatId),
                                new User(
                                    rows[i].userId,
                                    rows[i].firstName,
                                    rows[i].lastName,
                                    rows[i].nickName,
                                    rows[i].shape,
                                    rows[i].color
                                ),
                                String(rows[i].title)));
                    }
                    callback(chats);
                }
            }
        );
    };

    this.addMessage = function(userId,chatId,message) {
        this.connection.query("INSERT INTO messages(userID,conversationId,content,timeStamp)" +
        " values ("+userId+","+chatId+",?,NOW())",[message]);
    }

    this.getChatSession = function(currentUserId,chatId,callback){
        var concurrent = 0;
        var status=true;
        var allowed=false;
        var chat;
        var members=[],messages=[];
        var respond = function()
        {
            if(concurrent>1)
            {
                if(!allowed)
                {
                    status=false;
                }
                callback(chat,messages,members,status);
            }
            else
            {
                concurrent++;
            }
        }
        this.connection.query('SELECT c.id as chatId,u.id as userId,u.firstName,u.lastName,u.nickName,u.shape,u.color' +
            ',title FROM conversation c INNER JOIN users u ON u.id = c.ownerID WHERE c.id='+chatId,
            function(err, rows, fields) {
                if(err || rows.length<1)
                {
                    console.log(err);
                    status =false;
                }
                else
                {
                    chat = new Chat(
                        parseInt(rows[0].chatId),
                        new User(
                            rows[0].userId,
                            rows[0].firstName,
                            rows[0].lastName,
                            rows[0].nickName,
                            rows[0].shape,
                            rows[0].color
                        ),
                        String(rows[0].title));
                }
                respond();
            }
        );

        this.connection.query('SELECT * FROM (SELECT m.*,u.firstName,u.lastName,u.nickName,u.shape,' +
            'u.color FROM messages m INNER JOIN users u ON m.userID = u.id WHERE conversationId='+chatId +
            " ORDER BY m.timeStamp DESC LIMIT 10) as subResult ORDER BY timeStamp",
            function(err, rows, fields) {
                if(err)
                {
                    console.log(err);
                    status =false;
                }
                else
                {
                    while(concurrent<1) {}
                    for (var i = 0; i < rows.length; i++) {
                        messages.push(new Message(
                            parseInt(rows[i].id),
                            chat,
                            String(rows[i].content),
                            new User(
                                rows[i].userId,
                                rows[i].firstName,
                                rows[i].lastName,
                                rows[i].nickName,
                                rows[i].shape,
                                rows[i].color,
                                rows[i].timeStamp
                            )));
                    }
                }
                respond();
            }
        );

        this.connection.query('SELECT u.* FROM userconversation uc ' +
            'INNER JOIN users u ON u.id = uc.userID WHERE conversationID='+chatId,
            function(err, rows, fields) {
                if(err && rows.length<1)
                {
                    console.log(err);
                    status =false;
                }
                else
                {
                    for (var i = 0; i < rows.length; i++) {
                        if(parseInt(rows[i].id)==currentUserId)
                            allowed=true;
                        members.push(new User(
                            parseInt(rows[i].id),
                            String(rows[i].firstName),
                            String(rows[i].lastName),
                            String(rows[i].nickName),
                            parseInt(rows[i].shape),
                            parseInt(rows[i].color)));
                    }
                }
                respond();
            }
        );
    };



    this.changeAttribute = function(attribute,value,id,callback){
        if(attribute!=='shape' && attribute!=='color')
            callback(false);
        else
        {
            this.connection.query('UPDATE users SET '+attribute+'=? WHERE id='+id,[value],
                function(err, rows, fields)
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

    this.isMember = function(userId,chatId,callback){
        this.connection.query('SELECT * FROM userconversation WHERE userID=? AND conversationID=?',[userId,chatId],
            function(err, rows, fields)
            {
                if(err || rows.length<1)
                {
                    console.log(err);
                    callback(false);
                }
                else
                    callback(true);
            }
        );
    };

    this.addConversation = function(userId,title,callback){
        this.connection.query('INSERT INTO conversation(ownerID,title) VALUES(?,?)',[userId,title],
            function(err, rows, fields)
            {
                if(err)
                {
                    console.log(err);
                    callback(undefined);
                }
                else
                {
                    callback(rows.insertId);
                }

            }
        );

    };

    this.addUserConversation = function(userId,conversationId,callback){
        this.connection.query('INSERT INTO userconversation(userID,conversationID)' +
            ' VALUES(?,?)',[userId,conversationId],
            function(err, rows, fields)
            {
                if(err)
                {
                    console.log(err);
                    callback(false);
                }
                else
                {
                    callback(true);
                }

            }
        );
    };

    this.close = function()
    {
        this.db.closeConnection();
    }
}

module.exports = Service;