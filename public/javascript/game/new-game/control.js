
function bindKeyboardController(client,game)
{
    var keys= {
        37 : { val:false, dir:0 }, // left
        38 : { val:false, dir:2 }, // up
        39 : { val:false, dir:1 }, // right
        40 : { val:false, dir:3 }  // down
    };

    var currentDirection = null;

    // Keyboard Events
    window.document.onkeydown = keyPressed;
    window.document.onkeyup = keyReleased;

    function updateCurrentDirection()
    {
        for(var code in keys)
        {
            if(keys[code].val === true)
            {
                if(currentDirection != keys[code].dir)
                {
                    currentDirection = keys[code].dir;
                    return true;
                }
                return false;
            }
        }
        if(currentDirection !== null)
        {
            currentDirection = null;
            return true;
        }
    }

    function keyReleased(event)
    {
        if(event.keyCode in keys)
        {
            keys[event.keyCode].val = false;
            if(updateCurrentDirection())
            {
                client.emitMovePlayer(currentDirection);
            }
        }
    }

    function keyPressed(event)
    {
        if(event.keyCode in keys)
        {
            keys[event.keyCode].val = true;
            if(updateCurrentDirection())
            {
                client.emitMovePlayer(currentDirection);
            }
        }
        else
        {
            switch(event.keyCode)
            {
                case 13:
                    event.preventDefault();
                    var message = ui.enterEvent();
                    if (message) {
                        client.emitSendMessage(message);
                    }
                    break;
                case 32:
                    if (!ui.typeMode) {
                        var player = game.getLocalPlayer();
                        var cellLength = game.getCellLength();
                        client.emitFireBullet(
                            (player.grant.x + cellLength) / cellLength,
                            (player.grant.y + (1.5 *cellLength)) / cellLength,
                            player.getDirection());
                    }
            }
        }
    }
}