
function bindKeyboardController(client,game)
{
    var keys= {
        37 : { val:false, dir:"left" }, // 0
        38 : { val:false, dir:"up" }, // 2
        39 : { val:false, dir:"right" }, // 1
        40 : { val:false, dir:"down" }  // 3
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

        currentDirection = "stationary"+currentDirection;
        return true;

    }

    function keyReleased(event)
    {
        if(event.keyCode in keys)
        {
            keys[event.keyCode].val = false;
            if(updateCurrentDirection())
            {
                game.setMovement(currentDirection);
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
                game.setMovement(currentDirection);
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
                            player.grant.currentAnimation.replace("stationary",""));
                    }
            }
        }
    }
}