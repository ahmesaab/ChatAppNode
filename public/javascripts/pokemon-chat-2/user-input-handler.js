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
            event.preventDefault();
            keys[2] = true;
            break;
        case KEYCODE_DOWN:
            event.preventDefault();
            keys[3] = true;
            break;
        //TO DO ADD ENTER SEND CHAT
        case 13:
            event.preventDefault();
            $("#submit").click();
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

function sendMessage() {
    var messageTextBox = $('#messageInput');
    var messageContent = messageTextBox.val();
    if (messageTextBox.val() != "")
    {
        socket.emit('message',messageContent );
        addMessageToUi(messageContent, localPlayer.nickName, localPlayer);
        messageTextBox.val('');
    }
}

function changeRoom(roomId)
{
    console.log("Changing to room "+roomId);
    socket.emit('change room',{roomId:roomId});
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