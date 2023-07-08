//consts
const WIDTH = innerWidth * 0.33;
const HEIGHT = innerHeight;

let canvas = document.getElementById("game-arena");
canvas.height = HEIGHT;
canvas.width = WIDTH;

Game.init(canvas.getContext("2d"));

Game.load();

let KeysPressed = {
    ArrowRight: false,
    ArrowLeft: false,
};

window.addEventListener("load", () => {
    Game.createLevels();

    console.log("Game Started!!!, Hope you enjoy this :)");

    run();
});

function run() {
    let stopRunning = Game.drawLevel();
    if (stopRunning) {
        Game.drawLevel();
        return;
    }
    requestAnimationFrame(run);
}
