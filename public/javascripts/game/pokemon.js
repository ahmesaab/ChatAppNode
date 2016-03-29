

function startPokemon() {

    var stage;
    var KEYCODE_LEFT = 37,
        KEYCODE_RIGHT = 39,
        KEYCODE_UP = 38,
        KEYCODE_DOWN = 40;

    var playing = false;
    var speed = 0.1;
    var keys=[];
    keys[0]  = false;
    keys[1]  = false;
    keys[2]  = false;
    keys[3]  = false;
    var grant;

    var pokemonCanvas = document.getElementById("pokemonCanvas");
    pokemonCanvas.width = window.innerWidth;
    pokemonCanvas.height = window.innerHeight;

    // create a new stage and point it at our canvas:
    stage = new createjs.Stage(pokemonCanvas);

    // Define a spritesheet. Note that this data was exported by Zoë.
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["images/pokemon-trainer.png"],
        "frames": { "height": 50, "count": 16, "width": 50},
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
            "left": [4, 7,"left",0.5],
            "right": [8, 11,"right",0.5],
            "up":[12,15,"up",0.5],
            "down":[0,3,"down",0.5],
            "staionaryLeft" : 4,
            "staionaryRight" : 8,
            "staionaryDown" : 0,
            "staionaryUp" : 12
        }
    });

    // Events from SpriteSheet (not required for the demo)
    spriteSheet.on("complete", function(event) {
        console.log("Complete", event);
    });
    spriteSheet.on("error", function(event) {
        console.log("Error", event);
    });

    grant = new createjs.Sprite(spriteSheet, "staionaryDown");
    grant.x = stage.canvas.width / 2;
    grant.y = stage.canvas.height / 2;
    grant.speed = speed;

    grant.on('animationend',function(e){
        playing= false;
    });

    stage.addEventListener("stagemousedown", function(){
        grant.gotoAndPlay("left");
    });

    // Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
    stage.addChild(grant);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setInterval(25);
    createjs.Ticker.addEventListener("tick", tick);
    this.document.onkeydown = keyPressed;
    this.document.onkeyup = keyReleased;


    function keyPressed(event)
    {
        switch(event.keyCode)
        {
            case KEYCODE_LEFT:
                keys[0] = true;
                break;
            case KEYCODE_RIGHT:
                keys[1] = true;
                break;
            case KEYCODE_UP:
                keys[2] = true;
                break;
            case KEYCODE_DOWN:
                keys[3] = true;
                break;
        }
    }

    function keyReleased(event)
    {
        switch(event.keyCode)
        {
            case KEYCODE_LEFT:
                keys[0]  = false;
                grant.gotoAndPlay("staionaryLeft");
                break;
            case KEYCODE_RIGHT:
                keys[1]  = false;
                grant.gotoAndPlay("staionaryRight");
                break;
            case KEYCODE_UP:
                keys[2]  = false;
                grant.gotoAndPlay("staionaryUp");
                break;
            case KEYCODE_DOWN:
                keys[3]  = false;
                grant.gotoAndPlay("staionaryDown");
                break;
        }
    }

    function getMovement()
    {
        for(var i=0;i<4;i++)
        {
            if(keys[i]==true)
            {
                switch(i)
                {
                    case 0:
                        if(!playing)
                        {
                            grant.gotoAndPlay("left");
                            playing = true;
                        }
                        return [-1,0];
                    case 1:
                        if(!playing)
                        {
                            grant.gotoAndPlay("right");
                            playing = true;
                        }
                        return [1,0];
                    case 2:
                        if(!playing)
                        {
                            grant.gotoAndPlay("up");
                            playing = true;
                        }
                        return [0,-1];
                    case 3:
                        if(!playing)
                        {
                            grant.gotoAndPlay("down");
                            playing = true;
                        }
                        return [0,1];
                }
            }
        }
        return [0,0]
    }

    function tick(event)
    {
        var movement = getMovement();
        var deltaS = event.delta / 1000;
        var deltaZ = event.delta * speed;
        grant.x = grant.x + ( deltaZ * movement[0]);
        grant.y = grant.y + ( deltaZ * movement[1]);
        stage.update(event);
    }
}
