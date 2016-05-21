
function Controller(client,game)
{
    const KEY_CODE_LEFT = 37;
    const KEY_CODE_RIGHT = 39;
    const KEY_CODE_UP = 38;
    const KEY_CODE_DOWN = 40;

    var keys=[false,false,false,false];
    var player;


    // Keyboard Events
    window.document.onkeydown = keyPressed;
    window.document.onkeyup = keyReleased;

    // Global Events
    setInterval(function(){ handelMovement()}, 50);

    function handelMovement()
    {
        for(var i=0;i<4;i++)
        {
            if(keys[i]==true)
            {
                switch(i)
                {
                    case 0:
                        client.emitMovePlayer(0);
                        return;
                    case 1:
                        client.emitMovePlayer(1);
                        return;
                    case 2:
                        client.emitMovePlayer(2);
                        return;
                    case 3:
                        client.emitMovePlayer(3);
                        return;
                }
            }
        }
        if(game.getLocalPlayer().playing)
        {
            client.emitStopPlayer("stationary" + game.getLocalPlayer().grant.currentAnimation);
        }

    }

    function keyReleased(event)
    {
        try
        {
            switch(event.keyCode)
            {
                case KEY_CODE_LEFT:
                    keys[0]  = false;
                    break;
                case KEY_CODE_RIGHT:
                    keys[1]  = false;
                    break;
                case KEY_CODE_UP:
                    keys[2]  = false;
                    break;
                case KEY_CODE_DOWN:
                    keys[3]  = false;
                    break;
            }
        }
        catch(err)
        {
            console.log(err);
        }

    }

    function keyPressed(event)
    {
        switch(event.keyCode)
        {
            case KEY_CODE_LEFT:
                keys[0] = true;
                event.preventDefault();
                break;
            case KEY_CODE_RIGHT:
                keys[1] = true;
                event.preventDefault();
                break;
            case KEY_CODE_UP:
                keys[2] = true;
                event.preventDefault();
                break;
            case KEY_CODE_DOWN:
                keys[3] = true;
                event.preventDefault();
                break;
            case 13:
                event.preventDefault();
                var message = ui.enterEvent();
                if(message)
                {
                    client.emitSendMessage(message);
                }
                break;
        }
    }
}