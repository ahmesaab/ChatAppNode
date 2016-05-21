/**
 * Created by Ahmed on 3/10/2016.
 */

var Player = function(user,socketId) {
    var x = user.x,
        y = user.y,
        shape = user.shape,
        color = user.color,
        nickName = user.nickName,
        roomId = user.roomId,
        frameRate = user.frameRate,
        speed = user.speed;

    return {
        x:x,
        y:y,
        shape: shape,
        color:color,
        nickName:nickName,
        roomId:roomId,
        speed:speed,
        frameRate: frameRate,
        socketId:socketId
    }
};

exports.Player = Player;