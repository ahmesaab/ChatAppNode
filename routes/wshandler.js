/**
 * Created by Ahmed on 3/7/2016.
 */
var Handler = function(socket)
{
    console.log(socket.request.session.userId);
    socket.on('setPseudo', function (data) {
        socket.pseudo = data;
        console.log(socket.pseudo + ' joined!');
    });

    socket.on('message', function (message) {
        var data = { 'message' : message, pseudo : socket.pseudo };
        socket.broadcast.emit('message', data);
        console.log("user " + socket.pseudo + " send this : " + message);
    });
}

module.exports = Handler;