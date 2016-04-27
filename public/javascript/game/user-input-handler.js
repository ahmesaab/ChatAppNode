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
            emitKey(0,'pressed');
            event.preventDefault();
            break;
        case KEYCODE_RIGHT:
            keys[1] = true;
            emitKey(1,'pressed');
            event.preventDefault();
            break;
        case KEYCODE_UP:
            keys[2] = true;
            emitKey(2,'pressed');
            event.preventDefault();
            break;
        case KEYCODE_DOWN:
            keys[3] = true;
            emitKey(3,'pressed');
            event.preventDefault();
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
                emitKey(0,'released');
                localPlayer.grant.gotoAndPlay("staionaryLeft");
                break;
            case KEYCODE_RIGHT:
                keys[1]  = false;
                emitKey(1,'released');
                localPlayer.grant.gotoAndPlay("staionaryRight");
                break;
            case KEYCODE_UP:
                keys[2]  = false;
                emitKey(2,'released');
                localPlayer.grant.gotoAndPlay("staionaryUp");
                break;
            case KEYCODE_DOWN:
                keys[3]  = false;
                emitKey(3,'released');
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
        addMessageToGame(messageContent, localPlayer.nickName, localPlayer);
        addMessageToChatHistory(messageContent,localPlayer.nickName,true);
        messageTextBox.val('');
    }
}

function emitKey(key,keyStatus)
{
    socket.emit("key status",
        {
            keyStatus: keyStatus,
            key: key
        });
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