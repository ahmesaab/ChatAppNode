/**
 * Created by Ahmed on 3/8/2016.
 */
var Service = require('../data/service.js');
var Handler = function(socket)
{
    var user = socket.request.session.user;
    var chatId = socket.handshake.query.chatId;
    var service = new Service();
    if(typeof user !== 'undefined')
        console.log(user.nickName+' is trying to connect to '+chatId);
    if(typeof user !== 'undefined' && typeof chatId !=='undefined' && service.isMember(user.id,chatId))
    {
        console.log(user.nickName+' connected to '+chatId);
        socket.join(chatId);
        socket.pseudo = user.nickName;

        socket.on('message', function (message) {
            var data = { 'message' : message, pseudo : socket.pseudo };
            socket.to(chatId).emit('message', data);
            console.log("user " + socket.pseudo + " send this : " + message+" to broadcast "+chatId);
        });
    }
    else
    {
        if(typeof user !== 'undefined')
            console.log(user.nickName+' connection failed to '+chatId);
        socket.disconnect();
        service.close();
    }
}

module.exports = Handler;