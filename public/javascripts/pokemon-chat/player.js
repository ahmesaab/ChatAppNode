/**
 * Created by Ahmed on 3/19/2016.
 */
/**************************************************
 ** GAME PLAYER CLASS
 **************************************************/
var Player = function(xid,xx,xy,xnickName,xroomId,xshape,xcolor,xgrant) {
    var id = xid,
        x = xx,
        y = xy,
        nickName = xnickName,
        roomId = xroomId,
        shape = xshape,
        color = xcolor,
        moveAmount = 1,
        grant = xgrant;

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

    var update = function(keys,canvas) {
        var prevX = x,
            prevY = y;
        // Up key takes priority over down
        if (keys.up && y-moveAmount>20) {
            y -= moveAmount;
        } else if (keys.down && y+moveAmount<canvas.height-10) {
            y += moveAmount;
        }
        else if(keys.up)
        {

        }
        else if(keys.down)
        {

        };

        // Left key takes priority over right
        if (keys.left && x-moveAmount>20) {
            x -= moveAmount;
        } else if (keys.right && x+moveAmount<canvas.width-10) {
            x += moveAmount;
        }
        else if(keys.left)
        {

        }
        else if(keys.right)
        {

        };
        return (prevX != x || prevY != y) ? true : false;
    };

    var draw = function(ctx) {
        if(color==1)
        {
            ctx.fillStyle = 'green';
        }
        else if(color==2)
        {
            ctx.fillStyle = 'red';
        }
        else if(color==3)
        {
            ctx.fillStyle = 'black';
        }
        if(shape==1)
        {
            ctx.fillRect(x-20, y-20, 40, 40);
        }
        else if(shape==2)
        {
            //draw a circle
            ctx.beginPath();
            ctx.arc(x-20,y-20,20,0,2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }
        else if(shape==3)
        {
            var width = 40;  // Triangle Width
            var height = 40; // Triangle Height
            // Draw a path
            ctx.beginPath();
            ctx.moveTo(x-20 + width/2, y-20);        // Top Corner
            ctx.lineTo(x-20 + width, height + y-20); // Bottom Right
            ctx.lineTo(x-20, height + y-20);         // Bottom Left
            ctx.closePath();
            ctx.fill();
        }

    };

    return {
        grant:grant,
        id:id,
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        update: update,
        draw: draw,
        shape: shape,
        color:color,
        nickName:nickName,
        roomId:roomId
    }
};