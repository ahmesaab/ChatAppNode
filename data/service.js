/**
 * Created by Ahmed on 3/4/2016.
 */
var Person = require('../models/person.js');
var Chat = require('../models/chat.js');
var Message = require('../models/message.js')
var DB = require('../data/database.js');

// constructor
function Service() {
    // always initialize all instance properties
    this.db = new DB();
    this.connection = this.db.getConnection();

    this.getPerson = function(id,callback){
        this.connection.query('SELECT * FROM users WHERE id='+id,
            function(err, rows, fields) {
                if(err)
                    console.log(err);
                var person = new Person()
                if(rows.length>0)
                {
                    person = new Person(
                        parseInt(rows[0].id),
                        String(rows[0].firstName),
                        String(rows[0].lastName),
                        parseInt(rows[0].shape),
                        parseInt(rows[0].color));
                }
                callback(person);
            }
        );
    };

    this.getUsers = function(callback){
        this.connection.query('SELECT id,firstName,lastName FROM users',
            function(err, rows, fields) {
                if(err)
                    console.log(err);
                else
                {
                    var users = [];
                    for (var i = 0; i < rows.length; i++) {
                        users.push(new Person(parseInt(rows[i].id),String(rows[i].firstName),String(rows[i].lastName)));
                    }
                    callback(users);
                }
            }
        );
    };

    this.getChats = function(id,callback){
        this.connection.query('SELECT c.id,ownerID,title FROM userconversation uc ' +
            'INNER JOIN conversation c ON uc.conversationID=c.ID WHERE userID='+id,
            function(err, rows, fields) {
                if(err || rows.length<1)
                    console.log(err);
                else
                {
                    var chats = [];
                    for (var i = 0; i < rows.length; i++) {
                        chats.push(new Chat(parseInt(rows[i].id),String(rows[i].ownerID),String(rows[i].title)));
                    }
                    callback(chats);
                }
            }
        );
    };

    this.getChatSession = function(currentUserID,chatID,callback){
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
        this.connection.query('SELECT * FROM conversation WHERE id='+chatID,
            function(err, rows, fields) {
                if(err || rows.length<1)
                {
                    console.log(err);
                    status =false;
                }
                else
                {
                    chat = new Chat(parseInt(rows[0].id),String(rows[0].ownerID),String(rows[0].title));
                }
                respond();
            }
        );
        this.connection.query('SELECT m.*,u.nickName FROM messages m INNER JOIN users u ON m.userID = u.id WHERE conversationId='+chatID,
            function(err, rows, fields) {
                if(err)
                {
                    console.log(err);
                    status =false;
                }
                else
                {
                    for (var i = 0; i < rows.length; i++) {
                        messages.push(new Message(
                            parseInt(rows[i].id),
                            parseInt(rows[i].userID),
                            parseInt(rows[i].conversationId),
                            String(rows[i].content),
                            String(rows[i].displayName)));
                    }
                }
                respond();
            }
        );
        this.connection.query('SELECT u.* FROM userconversation uc ' +
            'INNER JOIN users u ON u.id = uc.userID WHERE conversationID='+chatID,
            function(err, rows, fields) {
                if(err && rows.length<1)
                {
                    console.log(err);
                    status =false;
                }
                else
                {
                    for (var i = 0; i < rows.length; i++) {
                        if(parseInt(rows[i].id)==currentUserID)
                            allowed=true;
                        members.push(new Person(
                            parseInt(rows[i].id),
                            String(rows[i].firstName),
                            String(rows[i].lastName),
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

    this.close = function()
    {
        this.db.closeConnection();
    }
}
// export the class
module.exports = Service;