const PLAYER_IDLE_COLOR = { r: 0, g: 0, b: 55 };
const PLAYER_MOVE_COLOR = { r: 55, g: 100, b: 50 };

class Enemy {
    constructor(size, position) {
        this.size = size;
        this.position = position;
        this.speed = 4;
        this.velX = this.speed;
        this.velY = this.speed;
    }

    display() {
        fill(0, 155, 200);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }

    move() {
        this.position.x += this.velX;
        this.position.y += this.velY;
        if (this.position.x + this.size / 2 > width || this.position.x - this.size / 2 < 0) {
            this.velX *= -1;
        }
        if (this.position.y + this.size / 2 > height || this.position.y - this.size / 2 < 0) {
            this.velY *= -1;
        }
    }
}

class ClapperEnemy {
    constructor(size, position) {
        this.size = size;
        this.position = position;
        this.speed = 5;
    }

    clap() {

    }

    display() {
        fill(0);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        rect(width - this.size.x, this.position.y, this.size.x, this.size.y);
    }
}

class HomingEnemy {
    constructor(size, position) {
        this.size = size;
        this.position = position;
        this.speed = 5;
    }

    move() {

    }

    display() {
        fill(255, 255, 0);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }

}

class Bullet {
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
        this.size = 4;
    }

    step() {
        this.position.x += this.direction.x;
        this.position.y += this.direction.y;
    }

    display() {
        fill(0, 255, 0);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}

class CannonEnemy {
    constructor(size, position, target) {
        this.size = size;
        this.position = position;
        this.target = target;
        this.speed = 5;
        this.t = 0;
        this.cooldown = 60;
        this.nextShot = this.cooldown;
    }

    display() {
        fill(255, 0, 0);
        ellipse(this.position.x, this.position.y, 30, 30);
    }

    step() {
        this.t += 1;
        if (this.target && this.t >= this.nextShot) {
            let direction = {
                x: this.target.position.x - this.position.x,
                y: this.target.position.y - this.position.y
            };
            let dist = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            let normalizedDirection = {
                x: direction.x / dist,
                y: direction.y / dist
            };
            let bullet = new Bullet({ x: this.position.x, y: this.position.y }, normalizedDirection);
            bullets.push(bullet);
            this.nextShot += this.cooldown;
        }
    }

}

let ronpob;
let maLong;
let clapper;
let cannon;
let homingMissile;
let bullets = [];

function setup() {
    let canvas = createCanvas(800, 600);
    //noStroke();
    ronpob = new Player('ronpob', 20, { x: 10, y: 20 });
    maLong = new Enemy(50, { x: 50, y: 400 });
    clapper = new ClapperEnemy({ x: 15, y: 35 }, { x: 0, y: height / 2 });
    cannon = new CannonEnemy(20, { x: 10, y: 10 }, ronpob);
    homingMissile = new HomingEnemy(20, { x: 10, y: 10 });
}

function draw() {
    background(51);

    if (mouseIsPressed && inCanvas({ x: mouseX, y: mouseY})) {
        ronpob.target = { x: mouseX, y: mouseY };
    }
    ronpob.step();
    cannon.step();
    maLong.move();
    ronpob.isColliding = false;
    if (circleRectCollision(maLong, ronpob)) {
        ronpob.isColliding = true;
    }
    for (let i = 0; i < bullets.length; ++i) {
        bullets[i].step();
        if (circleRectCollision(bullets[i], ronpob)) {
            ronpob.isColliding = true;
        }
        bullets[i].display();
    }
    cannon.display();
    clapper.display();
    maLong.display();
    ronpob.display();
    homingMissile.display();
}

function rectRectCollision(r1, r2) {

}

function circleRectCollision(circle, rect) {
    let cx = circle.position.x;
    let cy = circle.position.y;
    let rx = rect.position.x;
    let ry = rect.position.y;
    let rh = rect.size;
    let rw = rect.size;
    let testX = cx;
    let testY = cy;
    let rad = circle.size / 2;

    if (cx < rx)         testX = rx;      // test left edge
    else if (cx > rx+rw) testX = rx+rw;   // right edge
    if (cy < ry)         testY = ry;      // top edge
    else if (cy > ry+rh) testY = ry+rh;   // bottom edge

    let d = dist(cx, cy, testX, testY);

    if (d <= rad) {
        return true;
    }
    return false;
}

function inCanvas(position) {
    return (position.x <= width && 
        position.x <= width && 
        position.y >= 0 &&
        position.y >= 0);
}

function fillColor(colorObject) {
    fill(colorObject.r, colorObject.g, colorObject.b);
}

class Player {
    constructor(name, size, position) {
        this.name = name;
        this.size = size;
        this.position = position;
        this.speed = 10;
        this.target = null;
    }

    display() {
        if (this.target == null) {
            fillColor(PLAYER_IDLE_COLOR);
        } else {
            fillColor(PLAYER_MOVE_COLOR);
        }
        if (this.isColliding) {
            fill(255, 0, 0);
        }
        rect(this.position.x, this.position.y, 20, 20);
    }

    step() {
        if (this.target) {
            this.moveTowardTarget();
        }
    }

    moveTowardTarget() {
        let tx = this.target.x - this.position.x,
            ty = this.target.y - this.position.y,
            dist = Math.sqrt(tx * tx + ty * ty);

        if (dist == 0) {
            this.target = null;
            return;
        }

        let postPosition = {
            x: this.position.x + (tx / dist) * this.speed,
            y: this.position.y + (ty / dist) * this.speed
        };

        let px = postPosition.x - this.position.x,
            py = postPosition.y - this.position.y;
        let postDist = Math.sqrt(px * px + py * py);

        if (postDist > dist) {
            this.position = this.target;
            this.target = null;
            return;
        } else {
            this.position = postPosition;
        }
    }
}
