import Helpers from "./helpers.js";

export default class Bullet {
    constructor(diam, vector) {
        this.id =  Helpers.uuidv4();
        this.diam = diam;
        this.vector = vector;
    }

    getBullet = () => {
        return {
            id: this.id,
            x: this.vector.x,
            y: this.vector.y,
            r: this.diam
        }
    }

    draw = () => {
        fill("#d2daea");
        ellipse(this.vector.x, this.vector.y, this.diam, this.diam);
    }

    move = (velocity) => {
        this.vector.y += velocity;
    }

    getEdge = () => {
        return this.vector.y;
    }
}
