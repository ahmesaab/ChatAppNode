/**
 * Created by Ahmed on 5/1/2016.
 */

var images = {
    1:"/images/character-sprites/boy.png",
    2:"/images/character-sprites/girl.png",
    3:"/images/character-sprites/girl2.png",
    4:"/images/character-sprites/girl3.png",
    5:"/images/character-sprites/girl4.png",
    6:"/images/character-sprites/boy3.png",
    7:"/images/character-sprites/boy4.png",
    8:"/images/character-sprites/boy5.png",
    9:"/images/character-sprites/girl5.png",
    10:"/images/character-sprites/boy6.png",
    default:"/images/character-sprites/boy2.png"
}

function getSpriteConfig(charachterId)
{
    var spriteSheet;
    switch (charachterId) {
        case 1:
            spriteSheet = {
                framerate: 30,
                "images": [images[1]],
                "frames": {"count": 16, "height": 50, "width": 50},
                "animations": {
                    "left": [4, 7, "left", 0.5],
                    "right": [8, 11, "right", 0.5],
                    "up": [12, 15, "up", 0.5],
                    "down": [0, 3, "down", 0.5],
                    "staionaryLeft": 4,
                    "staionaryRight": 8,
                    "staionaryDown": 0,
                    "staionaryUp": 12
                },
                "scale": {x: 2, y: 2}
            };
            break;
        case 2:
            spriteSheet = {
                framerate: 30,
                "images": [images[2]],
                "frames": {"height": 32, "count": 12, "width":20 },
                "animations": {
                    "left": [6, 8, "left", 0.5],
                    "right": [9, 11, "right", 0.5],
                    "up": [0, 2, "up", 0.5],
                    "down": [3, 5, "down", 0.5],
                    "staionaryLeft": 6,
                    "staionaryRight": 9,
                    "staionaryDown": 3,
                    "staionaryUp": 0
                },
                "scale": {x: 1.2, y: 1.8}
            };
            break;
        case 3:
            spriteSheet = {
                framerate: 30,
                "images": [images[3]],
                "frames": {"height": 31, "count": 12, "width":28 },
                "animations": {
                    "left": [6, 8, "left", 0.5],
                    "right": [9, 11, "right", 0.5],
                    "up": [0, 2, "up", 0.5],
                    "down": [3, 5, "down", 0.5],
                    "staionaryLeft": 6,
                    "staionaryRight": 9,
                    "staionaryDown": 3,
                    "staionaryUp": 0
                },
                "scale": {x: 1.8, y: 1.8}
            };
            break;
        case 4:
            spriteSheet = {
                framerate: 30,
                "images": [images[4]],
                "frames": {"height": 29, "count": 16, "width":20 },
                "animations": {
                    "left": [4, 7, "left", 0.3],
                    "right": [8,11, "right", 0.3],
                    "up": [12, 15, "up", 0.3],
                    "down": [0, 3, "down", 0.3],
                    "staionaryLeft": 4,
                    "staionaryRight": 8,
                    "staionaryDown": 0,
                    "staionaryUp": 12
                },
                "scale": {x: 1.2, y: 2}
            };
            break;
        case 5:
            spriteSheet = {
                framerate: 30,
                "images": [images[5]],
                "frames": {"height": 48, "count": 16, "width":32 },
                "animations": {
                    "left": [4, 7, "left", 0.3],
                    "right": [8,11, "right", 0.3],
                    "up": [12, 15, "up", 0.3],
                    "down": [0, 3, "down", 0.3],
                    "staionaryLeft": 4,
                    "staionaryRight": 8,
                    "staionaryDown": 0,
                    "staionaryUp": 12
                },
                "scale": {x: 1.2, y: 1.85}
            };
            break;
        case 6:
            spriteSheet = {
                framerate: 30,
                "images": [images[6]],
                "frames": {"height": 64, "count": 16, "width":64 },
                "animations": {
                    "left": [4, 7, "left", 0.3],
                    "right": [8,11, "right", 0.3],
                    "up": [12, 15, "up", 0.3],
                    "down": [0, 3, "down", 0.3],
                    "staionaryLeft": 4,
                    "staionaryRight": 8,
                    "staionaryDown": 0,
                    "staionaryUp": 12
                },
                "scale": {x: 2, y: 2}
            };
            break;
        case 7:
            spriteSheet = {
                framerate: 30,
                "images": [images[7]],
                "frames": {"height": 32, "count": 16, "width":32 },
                "animations": {
                    "left": [4, 7, "left", 0.3],
                    "right": [12,15, "right", 0.3],
                    "up": [0, 3, "up", 0.3],
                    "down": [8, 11, "down", 0.3],
                    "staionaryLeft": 4,
                    "staionaryRight": 12,
                    "staionaryDown": 8,
                    "staionaryUp": 0
                },
                "scale": {x: 1.2, y: 2}
            };
            break;
        case 8:
            spriteSheet = {
                framerate: 30,
                "images": [images[8]],
                "frames": {"height": 64, "count": 16, "width":48 },
                "animations": {
                    "left": [4, 7, "left", 0.3],
                    "right": [8,11, "right", 0.3],
                    "up": [12, 15, "up", 0.3],
                    "down": [0, 3, "down", 0.3],
                    "staionaryLeft": 4,
                    "staionaryRight": 8,
                    "staionaryDown": 0,
                    "staionaryUp": 12
                },
                "scale": {x: 1.2, y: 2}
            };
            break;
        case 9:
            spriteSheet = {
                framerate: 30,
                "images": [images[9]],
                "frames": {"height": 42, "count": 16, "width":32 },
                "animations": {
                    "left": [4, 7, "left", 0.3],
                    "right": [8,11, "right", 0.3],
                    "up": [12, 15, "up", 0.3],
                    "down": [0, 3, "down", 0.3],
                    "staionaryLeft": 4,
                    "staionaryRight": 8,
                    "staionaryDown": 0,
                    "staionaryUp": 12
                },
                "scale": {x: 1.2, y: 2}
            };
            break;
        case 10:
            spriteSheet = {
                framerate: 30,
                "images": [images[10]],
                "frames": {"height": 31, "count": 16, "width":28 },
                "animations": {
                    "left": [8, 11, "left", 0.3],
                    "right": [12,15, "right", 0.3],
                    "up": [0, 3, "up", 0.3],
                    "down": [4, 7, "down", 0.3],
                    "staionaryLeft": 8,
                    "staionaryRight": 12,
                    "staionaryDown": 4,
                    "staionaryUp": 0
                },
                "scale": {x: 1.7, y: 2}
            };
            break;
        default:
            spriteSheet = {
                framerate: 30,
                "images": [images.default],
                "frames": {"count": 16, "height": 50, "width": 50},
                "animations": {
                    "left": [4, 7, "left", 0.5],
                    "right": [8, 11, "right", 0.5],
                    "up": [12, 15, "up", 0.5],
                    "down": [0, 3, "down", 0.5],
                    "staionaryLeft": 4,
                    "staionaryRight": 8,
                    "staionaryDown": 0,
                    "staionaryUp": 12
                },
                "scale": {x: 2, y: 2}
            };
            break;
    }
    return spriteSheet;
}