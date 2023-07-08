const Game = {
    currentScene: "",
    ctx: undefined,
    ship: [],
    aliens: [],
    life: 1,
    images: {},
    scenes: {},
    audios: {},
};

const starColors = [
    "red",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "grey",
    "grey",
    "grey",
    "grey",
    "orange",
    "orange",
    "yellow",
    "yellow",
];

Game.init = function (context) {
    this.ctx = context;
    this.currentScene = "start";
};

Game.load = function () {
    ["images/pipe.png", "images/pipeend.png"].forEach((src, i) => {
        let image = new Image();
        image.src = src;

        Game.images[src.split("/")[1].split(".")[0]] = image;
    });

    [].forEach((src, i) => {
        let audio = new Audio();
        audio.src = src;

        Game.audios[src.split("/")[1].split(".")[0]] = audio;
    });
};

Game.createLevels = function () {
    // start SCENE
    let startScene = new Scene();

    startScene.registerEventListener("keydown", (event) => {
        switch (event.key) {
            // start game case
            case "Enter":
                document.body.style.cursor = "none";
                Game.scenes[Game.currentScene].clear();
                if (Game.currentScene == "play") {
                    break;
                }
                Game.currentScene = "play";

                break;
            default:
                break;
        }
    });

    startScene.addObject("background", new Rect({ x: 0, y: 0 }, WIDTH, HEIGHT, "lightblue"));

    startScene.addObject(
        "message",
        new Message("Press ENTER to play", { x: WIDTH / 2, y: HEIGHT / 2 + 50 }, "15px game-font", "white")
    );

    startScene.addObject(
        "message",
        new Message(
            "Use ← and → to move, SPACEBAR to fire",
            { x: WIDTH / 2, y: HEIGHT / 2 + 110 },
            "15px game-font",
            "white"
        )
    );

    startScene.addObject(
        "message",
        new Message("Press ESCAPE to pause", { x: WIDTH / 2, y: HEIGHT / 2 + 80 }, "15px game-font", "white")
    );

    startScene.addObject(
        "message",
        new Message("Click anywhere for audio", { x: WIDTH / 2, y: HEIGHT / 2 + 140 }, "10px game-font", "white")
    );

    startScene.update = function () {};
    Game.scenes["start"] = startScene;

    // play scene
    let playScene = new Scene();

    playScene.registerEventListener("keydown", (event) => {
        switch (event.key) {
            case "Escape":
                document.body.style.cursor = "none";
                Game.scenes[Game.currentScene].clear();
                Game.currentScene = "start";
                break;
            default:
                break;
        }
    });

    playScene.addObject("background", new Rect({ x: 0, y: 0 }, WIDTH, HEIGHT, "lightblue"));

    playScene.addObject("pipe", new Pipe(Game.images["pipe"], { x: WIDTH / 2, y: 0 }, false, 1, 1, [2, 15]));

    playScene.addObject(
        "pipeend",
        new Pipe(Game.images["pipeend"], { x: WIDTH / 2 - 3, y: HEIGHT / 2 }, false, 1, 1, [2.2, 2])
    );

    playScene.update = function () {};

    Game.scenes["play"] = playScene;
};

Game.drawLevel = function () {
    this.scenes[this.currentScene].init();
    this.scenes[this.currentScene].draw();
    this.scenes[this.currentScene].update();

    return false;
};

function hasCollided(obj1, obj2) {
    let dims1 = {
        centerX: obj1.position.x + (obj1.dim.width * obj1.scale) / 2,
        centerY: obj1.position.y + (obj1.dim.height * obj1.scale) / 2,
        radius: obj1.dim.width / 2,
    };
    let dims2 = {
        centerX: obj2.position.x + (obj2.dim.width * obj2.scale) / 2,
        centerY: obj2.position.y + (obj2.dim.height * obj2.scale) / 2,
        radius: obj2.dim.width / 2,
    };

    if (getDistance(dims1.centerX, dims1.centerY, dims2.centerX, dims2.centerY) < dims1.radius + dims2.radius) {
        return true;
    }
    return false;
}

function getDistance(x1, y1, x2, y2) {
    return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 1 / 2);
}
