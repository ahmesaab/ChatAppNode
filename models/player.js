/**
 * Created by Ahmed on 3/10/2016.
 */
var Player = function(newId,chatId,startX, startY) {
    var x = startX,
        y = startY,
        id=newId,
        chatId = chatId;

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
        id: id,
        chatId:chatId
    }
};

exports.Player = Player;