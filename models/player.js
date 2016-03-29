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
        socketId=socketId;


    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        shape: shape,
        color:color,
        nickName:nickName,
        roomId:roomId,
        socketId:socketId
    }
};

exports.Player = Player;