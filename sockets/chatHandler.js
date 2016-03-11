/**
 * Created by Ahmed on 3/8/2016.
 */
var Service = require('../data/service.js');
var Message = require('../models/message.js');
var service = new Service();

var Handler = function(socket)
{
    var user = socket.request.session.user;
    var chatId = socket.handshake.query.chatId;
    if(typeof user !== 'undefined')
        console.log(user.nickName+' is trying to connect to '+chatId);
    if(typeof user !== 'undefined' && typeof chatId !=='undefined')
        service.isMember(user.id,chatId, function(isMember)
        {
            if(isMember)
            {
                console.log(user.nickName+' connected to '+chatId);
                socket.join(chatId);
                socket.chatId = chatId;
                socket.pseudo = user.nickName;
                socket.on('disconnect',onClientDisconnect);
                socket.on('message', onMessage);
            }
            else
            {
                console.log(user.nickName+' connection failed to '+chatId+' because user is not a member');
                socket.disconnect();
                //service.close();
            }
        });
    else
    {
        console.log('Invalid user or chatId tried to connect to chat '+chatId);
        socket.disconnect();
        //service.close();
    }
}

function onMessage(message) {
    var data = { 'message' : message, pseudo : this.pseudo };
    service.addMessage(this.request.session.user.id,this.chatId,message);
    this.to(this.chatId).emit('message', data);
    console.log("user " + this.pseudo + " send this : " + message+" to broadcast "+this.chatId);
};

function onClientDisconnect() {
    console.log(this.pseudo+" has disconnected from chat "+this.chatId);
};

module.exports = Handler;