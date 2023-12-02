import Bullet from "./bullet.js";

export default class BulletHelper {
    constructor(yBoundary) {
        this.yBoundary = yBoundary;
        this.bullets = [];
        this.velocity = new createVector(0, -5);
        this.diam = 5;
    }

    run = () => {
        this.move();
        this.draw();
        this.edges();
    }

    getBullets = () => {
        return this.bullets;
    }

    fire = (x,y) => {
        //adjust for ship position
        const adjustedX = x + this.diam;
        this.bullets.push(
            new Bullet(this.diam, createVector(adjustedX,y))
        );
    }

    draw = () => {
        for (let i = 0; i < this.bullets.length; i++){
            this.bullets[i].draw();
        }
    }

    move = () => {
        for(let i=0; i< this.bullets.length; i++){
            this.bullets[i].move(this.velocity.y);
        }
    }

    edges = () => {
        for (let i =0; i< this.bullets.length; i++){
            if (this.bullets[i].getEdge < this.yBoundary){
                this.bullets.splice(i,1);
            }
        }
    }

    removeCollidedBullets = (arrayOfBulletIds) => {
        if (!arrayOfBulletIds || arrayOfBulletIds.length === 0){
            return;
        }
        arrayOfBulletIds.forEach(singleBulletId => {
            this.bullets = this.bullets.filter(singleBullet => singleBullet.id !== singleBulletId);
        })
    }
}
