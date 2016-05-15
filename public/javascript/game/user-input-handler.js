/**
 * Created by Ahmed on 3/19/2016.
 */

var KEYCODE_LEFT = 37,
    KEYCODE_RIGHT = 39,
    KEYCODE_UP = 38,
    KEYCODE_DOWN = 40;

var keys=[];
keys[0]  = false;
keys[1]  = false;
keys[2]  = false;
keys[3]  = false;

function keyPressed(event)
{
    switch(event.keyCode)
    {
        case KEYCODE_LEFT:
            keys[0] = true;
            event.preventDefault();
            break;
        case KEYCODE_RIGHT:
            keys[1] = true;
            event.preventDefault();
            break;
        case KEYCODE_UP:
            keys[2] = true;
            event.preventDefault();
            break;
        case KEYCODE_DOWN:
            keys[3] = true;
            event.preventDefault();
            break;
        //TO DO ADD ENTER SEND CHAT
        case 13:
            event.preventDefault();
            var messageTextBox = $('#message-text-box');
            var message = messageTextBox.val();
            if(message==='')
            {
                $("#wrapper").toggleClass("toggled");
                messageTextBox.focus();
            }
            else
            {
                sendMessage(message);
                messageTextBox.val('')
            }
            //if($('.bootbox-input').length===0)
            //{
            //    bootbox.prompt("Wanna say something ?", function(message) {
            //        if (message === null) {
            //            //alert("nothing typed!")
            //        } else {
            //            sendMessage(message)
            //        }
            //    });
            //}
            //else
            //{
            //    sendMessage($('.bootbox-input').val());
            //    bootbox.hideAll();
            //}
            break;
    }
}

function keyReleased(event)
{
    try
    {
        switch(event.keyCode)
        {
            case KEYCODE_LEFT:
                keys[0]  = false;
                localPlayer.grant.gotoAndPlay("staionaryLeft");
                break;
            case KEYCODE_RIGHT:
                keys[1]  = false;
                localPlayer.grant.gotoAndPlay("staionaryRight");
                break;
            case KEYCODE_UP:
                keys[2]  = false;
                localPlayer.grant.gotoAndPlay("staionaryUp");
                break;
            case KEYCODE_DOWN:
                keys[3]  = false;
                localPlayer.grant.gotoAndPlay("staionaryDown");
                break;
        }
    }
    catch(err)
    {
        console.log(err);
    }

}

function sendMessage(message) {
    if (message != "")
    {
        $('.bootbox-input').val('');
        socket.emit('message',message );
        addMessageToGame(message, localPlayer.nickName, localPlayer);
        addMessageToChatHistory(message,localPlayer.nickName,true);
    }
}

function changeRoom(x,y)
{
    console.log("Changing room");
    socket.emit('change room',{x:x,y:y});
}

function getMovement(player)
{
    for(var i=0;i<4;i++)
    {
        if(keys[i]==true)
        {
            switch(i)
            {
                case 0:
                    if(!player.playing)
                    {
                        player.grant.gotoAndPlay("left");
                        player.playing = true;
                    }
                    return [-1,0];
                case 1:
                    if(!player.playing)
                    {
                        player.grant.gotoAndPlay("right");
                        player.playing = true;
                    }
                    return [1,0];
                case 2:
                    if(!player.playing)
                    {
                        player.grant.gotoAndPlay("up");
                        player.playing = true;
                    }
                    return [0,-1];
                case 3:
                    if(!player.playing)
                    {
                        player.grant.gotoAndPlay("down");
                        player.playing = true;
                    }
                    return [0,1];
            }
        }
    }
    return [0,0]
}