const Game = {
    currentScene: "",
    ctx: undefined,
    gap: 300,
    speed: 2,
    score: 0,
    intervalId: undefined,
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
    [
        "images/pipetop.png",
        "images/pipebottom.png",
        "images/bat.png",
        "images/1.png",
        "images/2.png",
        "images/3.png",
        "images/4.png",
        "images/l1.png",
        "images/moon.png",
    ].forEach((src, i) => {
        let image = new Image();
        image.src = src;

        Game.images[src.split("/")[1].split(".")[0]] = image;
    });

    ["audio/gm.mp3", "audio/eat.wav", "audio/dead.wav"].forEach((src, i) => {
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
                Game.currentScene = "play";
                Game.audios["gm"].loop = true;
                Game.audios["gm"].volume = 0.5;
                Game.audios["gm"].play();
                Game.intervalId = setInterval(() => {
                    Game.gap = Math.max(150, Game.gap - 5);
                    Game.scenes[Game.currentScene].addObject(
                        "pipetop",
                        new Pipe(
                            Game.images["pipetop"],
                            { x: WIDTH + 100, y: -650 },
                            false,
                            1,
                            1,
                            [1, 1],
                            Game.speed,
                            false
                        )
                    );
                    Game.scenes[Game.currentScene].addObject(
                        "pipebottom",
                        new Pipe(
                            Game.images["pipebottom"],
                            { x: WIDTH + 100, y: HEIGHT - 650 + Game.gap },
                            false,
                            1,
                            1,
                            [1, 1],
                            Game.speed,
                            false
                        )
                    );
                }, 4000);
                break;
            default:
                break;
        }
    });

    startScene.addObject(
        "background",
        new CtxImage(Game.images["1"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["1"].height,
            HEIGHT / Game.images["1"].height,
        ])
    );

    startScene.addObject(
        "s1",
        new CtxImage(Game.images["2"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["2"].height,
            HEIGHT / Game.images["2"].height,
        ])
    );

    startScene.addObject(
        "s2",
        new CtxImage(Game.images["3"], { x: 0, y: -250 }, false, 1, 1, [
            HEIGHT / Game.images["3"].height,
            HEIGHT / Game.images["3"].height,
        ])
    );

    startScene.addObject(
        "s3",
        new CtxImage(Game.images["4"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["4"].height,
            HEIGHT / Game.images["4"].height,
        ])
    );

    startScene.addObject(
        "land",
        new CtxImage(Game.images["l1"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["l1"].height,
            HEIGHT / Game.images["l1"].height,
        ])
    );

    startScene.addObject(
        "baticon",
        new CtxImage(Game.images["moon"], { x: 50, y: 20 }, true, 1, 1, [1, 1], false, false)
    );

    startScene.addObject(
        "message",
        new Message("Poor Bat", { x: WIDTH / 2, y: HEIGHT / 2 + 100 }, "72px game-font", "black")
    );

    startScene.addObject(
        "message",
        new Message(
            "Save the poor bat from the pipes",
            { x: WIDTH / 2, y: HEIGHT / 2 + 120 },
            "15px game-font",
            "black"
        )
    );

    startScene.addObject(
        "message",
        new Message("ENTER to Play", { x: WIDTH / 2, y: HEIGHT / 2 + 200 }, "15px game-font", "white")
    );

    startScene.addObject(
        "message",
        new Message(
            "SPACEBAR to toggle pipe movement direction",
            { x: WIDTH / 2, y: HEIGHT / 2 + 230 },
            "14px game-font",
            "white"
        )
    );

    startScene.addObject(
        "message",
        new Message("ESCAPE to Pause", { x: WIDTH / 2, y: HEIGHT / 2 + 260 }, "15px game-font", "white")
    );

    startScene.addObject(
        "message",
        new Message("F5 to Restart", { x: WIDTH / 2, y: HEIGHT / 2 + 290 }, "15px game-font", "white")
    );

    startScene.update = function () {
        this.objects["background"].forEach((s) => (s.position.x -= 0.1));
        this.objects["s2"].forEach((s) => (s.position.x -= 0.25));
        this.objects["s2"].forEach((s) => s.update());
        this.objects["s3"].forEach((s) => (s.position.x -= 0.5));
        this.objects["s3"].forEach((s) => s.update());
        this.objects["land"].forEach((s) => (s.position.x -= 0.75));
        this.objects["land"].forEach((s) => s.update());
    };
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
            case " ":
                Game.scenes["play"].objects["pipetop"][0].direction =
                    !Game.scenes["play"].objects["pipetop"][0].direction;
                Game.scenes["play"].objects["pipebottom"][0].direction =
                    !Game.scenes["play"].objects["pipebottom"][0].direction;
                break;
            default:
                break;
        }
    });

    playScene.addObject(
        "background",
        new CtxImage(Game.images["1"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["1"].height,
            HEIGHT / Game.images["1"].height,
        ])
    );

    playScene.addObject(
        "s1",
        new CtxImage(Game.images["2"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["2"].height,
            HEIGHT / Game.images["2"].height,
        ])
    );

    playScene.addObject(
        "s2",
        new CtxImage(Game.images["3"], { x: 0, y: -250 }, false, 1, 1, [
            HEIGHT / Game.images["3"].height,
            HEIGHT / Game.images["3"].height,
        ])
    );

    playScene.addObject(
        "s3",
        new CtxImage(Game.images["4"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["4"].height,
            HEIGHT / Game.images["4"].height,
        ])
    );

    playScene.addObject(
        "land",
        new CtxImage(Game.images["l1"], { x: 0, y: 0 }, false, 1, 1, [
            HEIGHT / Game.images["l1"].height,
            HEIGHT / Game.images["l1"].height,
        ])
    );

    playScene.addObject(
        "pipetop",
        new Pipe(Game.images["pipetop"], { x: WIDTH, y: -650 }, false, 1, 1, [1, 1], Game.speed, false)
    );

    playScene.addObject(
        "pipebottom",
        new Pipe(
            Game.images["pipebottom"],
            { x: WIDTH, y: HEIGHT - 650 + Game.gap },
            false,
            1,
            1,
            [1, 1],
            Game.speed,
            false
        )
    );

    playScene.addObject(
        "bat",
        new Bat(Game.images["bat"], { x: WIDTH * 0.2, y: HEIGHT / 2 - 64 }, false, 4, 10, [2, 2], false)
    );

    playScene.addObject("score", new Message(Game.score, { x: WIDTH / 2, y: 100 }, "30px game-font", "white"));

    playScene.addObject(
        "message",
        new Message(
            "SPACEBAR to toggle pipe movement direction",
            { x: WIDTH / 2, y: HEIGHT - 40 },
            "14px game-font",
            "white"
        )
    );

    playScene.update = function () {
        this.objects["pipetop"][0].speedY = 2;
        this.objects["pipebottom"][0].speedY = 2;
        this.objects["pipetop"].forEach((pipe) => pipe.update());
        this.objects["pipebottom"].forEach((pipe) => pipe.update());
        this.objects["background"].forEach((s) => (s.position.x -= 0.1));
        this.objects["s2"].forEach((s) => (s.position.x -= 0.5));
        this.objects["s2"].forEach((s) => s.update());
        this.objects["s3"].forEach((s) => (s.position.x -= 1));
        this.objects["s3"].forEach((s) => s.update());
        this.objects["land"].forEach((s) => (s.position.x -= 1.5));
        this.objects["land"].forEach((s) => s.update());
        this.objects["bat"].forEach((s) => s.update());

        if (
            this.objects["pipetop"][0].position.x + this.objects["pipetop"][0].dim.width <
                this.objects["bat"][0].position.x + 20 &&
            !this.objects["pipetop"][0].cleared
        ) {
            Game.score++;
            this.objects["score"][0].text = Game.score;
            this.objects["pipetop"][0].cleared = true;
            Game.audios["eat"].play();
        }

        if (this.objects.pipetop[0].position.x + this.objects.pipetop[0].dim.width < 0) {
            this.objects["pipetop"].shift();
            this.objects["pipebottom"].shift();
        }

        if (
            hasCollided(this.objects["pipetop"][0], this.objects["bat"][0]) ||
            hasCollided(this.objects["pipebottom"][0], this.objects["bat"][0])
        ) {
            Game.scenes[Game.currentScene].clear();
            clearInterval(Game.intervalId);
            Game.audios["dead"].play();
            Game.currentScene = "gameover";
        }
    };

    Game.scenes["play"] = playScene;
};

Game.drawLevel = function () {
    this.scenes[this.currentScene].init();
    this.scenes[this.currentScene].draw();
    this.scenes[this.currentScene].update();
    if (Game.currentScene == "gameover") {
        Game.audios["gm"].pause();
        new Message("GAME OVER", { x: WIDTH / 2, y: HEIGHT / 2 }, "60px game-font", "maroon").draw();
        new Message("F5 to restart", { x: WIDTH / 2, y: HEIGHT / 2 + 72 }, "16px game-font", "white").draw();
        return true;
    }
    return false;
};

function hasCollided(obj1, obj2) {
    if (
        obj1.position.x < obj2.position.x + 10 + obj2.dim.width &&
        obj1.position.x + obj1.dim.width > obj2.position.x - 10 &&
        obj1.position.y < obj2.position.y + 10 + obj2.dim.height &&
        obj1.position.y + obj1.dim.height > obj2.position.y + 10
    ) {
        return true;
    }
    return false;
}
