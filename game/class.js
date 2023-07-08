class Scene {
    constructor() {
        this.objects = {};
        this.images = {};
        this.eventListeners = [];
        this.initialized = false;
    }

    addObject(name, object) {
        if (name in this.objects) {
            this.objects[name].push(object);
        } else {
            this.objects[name] = [object];
        }
    }
    addImage(imageName, imageObj) {
        if (imageName in this.images) {
            this.images[imageName].push(imageObj);
        } else {
            this.images[imageName] = [imageObj];
        }
    }
    registerEventListener(event, callback) {
        this.eventListeners.push({
            event: event,
            callback: callback,
        });
    }
    update() {
        console.log("Update not implemented");
    }
    init() {
        if(this.initialized){
            return;
        }
        Object.values(this.images).forEach((eachImageGrp) => {
            eachImageGrp.forEach((image) => {
                image.init();
            });
        });

        console.log("Scene init");

        this.eventListeners.forEach((eventListener) => {
            window.addEventListener(eventListener.event, eventListener.callback);
        });
        this.initialized = true;
    }
    clear() {
        Object.values(this.images).forEach((eachImageGrp) => {
            eachImageGrp.forEach((image) => {
                image.clear();
            });
        });
        this.eventListeners.forEach((eventListener) => {
            window.removeEventListener(eventListener.event, eventListener.callback);
        });
        this.initialized = false;
    }
    draw() {
        Object.values(this.objects).forEach((eachObj) => {
            eachObj.forEach((element) => {
                element.draw();
            });
        });

        Object.values(this.images).forEach((eachImageGrp) => {
            eachImageGrp.forEach((image) => {
                image.draw();
            });
        });
    }
}

class CtxImage {
    constructor(image, position, shakeImage, spriteFrames = 1, spriteFPS = 10, scale = [1, 1], repeat = false) {
        this.image = image;
        this.position = position;
        this.scale = scale;
        this.shakeImage = shakeImage;
        this.spriteFrames = spriteFrames;
        this.frameWidth = image.width / spriteFrames;
        this.currentSprite = 0;
        this.intervalIDs = [];
        this.spriteFPS = spriteFPS;
        this.repeat = repeat;
        this.dim = {
            width: this.frameWidth,
            height: image.height,
        };
        this.displace = {
            x: 1,
            y: 1,
        };
        this.coin = [-1, 1];
        this.init();
    }

    init() {
        this.intervalIDs.push(setInterval(() => this.shakeImageFrame(), 100));
        this.intervalIDs.push(setInterval(() => this.updateSprite(), 1000 / this.spriteFPS));
    }

    clear() {
        this.intervalIDs.forEach((x) => clearInterval(x));
    }

    draw() {
        if (this.repeat && this.spriteFrames - 1 == this.currentSprite) {
            this.clear();
            return;
        }
        let imgattrs = {
            sx: this.frameWidth * this.currentSprite,
            sy: 0,
            sw: this.frameWidth,
            sh: this.image.height,
            dx: this.position.x + this.displace.x,
            dy: this.position.y + this.displace.y,
            dw: this.frameWidth * this.scale[0],
            dh: this.image.height * this.scale[1],
        };

        Game.ctx.drawImage(
            this.image,
            imgattrs.sx,
            imgattrs.sy,
            imgattrs.sw,
            imgattrs.sh,
            imgattrs.dx,
            imgattrs.dy,
            imgattrs.dw,
            imgattrs.dh
        );
    }

    updateSprite() {
        if (this.spriteFrames - 1 == this.currentSprite) {
            this.currentSprite = 0;
        } else {
            this.currentSprite++;
        }
    }

    shakeImageFrame() {
        if (this.shakeImage) {
            this.displace.x *= this.coin[Math.floor(Math.random() * 2)];
            this.displace.y *= this.coin[Math.floor(Math.random() * 2)];
        }
    }
}

class Pipe extends CtxImage {
    constructor(image, position, shakeImage, spriteFrames, spriteFPS, scale) {
        super(image, position, shakeImage, spriteFrames, spriteFPS, scale);
        this.speedX = 5;
    }
}

class Rect {
    constructor(position, width, height, color) {
        this.position = position;
        this.color = color;
        this.scale = 1;
        this.dim = {
            width: width,
            height: height,
        };
    }

    draw() {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.position.x, this.position.y, this.dim.width, this.dim.height);
    }
}

class Message {
    constructor(text, position, font, color) {
        this.text = text;
        this.font = font;
        this.color = color;
        this.position = position;
    }

    draw() {
        Game.ctx.font = this.font;
        Game.ctx.textAlign = "center";
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillText(this.text, this.position.x, this.position.y);
    }
}
