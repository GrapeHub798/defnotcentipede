import Helpers from "./helpers.js";
import { DIRECTIONS } from "./types.js";
import {
    BASE_HORIZONTAL_MARGIN,
    BASE_TOP_MARGIN, BASE_TOP_SPIDER_MARGIN,
    BASE_VERTICAL_MARGIN,
    CANVASSIZE,
    CANVASSTART
} from "./config.js";

export default class Spider {
    constructor(speed) {
        this.id =  Helpers.uuidv4();
        this.diam = 14;
        this.startX = 0;
        this.vector = null;
        this.speed = speed;
        this.horizontalDirection = DIRECTIONS.LEFT;
        this.verticalDirection = DIRECTIONS.DOWN;
        this.paused = false;
        this.value = 300;

        this.init();
        this.randomPause();
    }

    init = () => {
        this.horizontalDirection = Math.random() < 0.5 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
        this.startX = this.horizontalDirection === DIRECTIONS.LEFT ? CANVASSTART + BASE_HORIZONTAL_MARGIN : CANVASSIZE - BASE_HORIZONTAL_MARGIN;
        this.vector = new createVector(this.startX, BASE_TOP_SPIDER_MARGIN);
    }

    getSpider = () => {
        return {
            id: this.id,
            x: this.vector.x,
            y: this.vector.y,
            r: this.diam
        }
    }

    randomPause = () => {
        let spiderPauseTimer = Math.floor(Math.random() * 2000);
        setTimeout(pauseSpider, spiderPauseTimer);

        let thisSpider = this;
        function pauseSpider() {
            spiderPauseTimer = Math.floor(Math.random() * 3000);
            thisSpider.paused = true;
            setTimeout(pauseSpider, spiderPauseTimer);
        }
    }

    run = () => {
        this.move();
        this.draw();
    }

    draw = () => {
        fill("#e30ddd");
        ellipse(this.vector.x, this.vector.y, this.diam, this.diam);
    }

    move = () => {
        //this.randomPause();
        this.moveDiagonally();
        this.collidedWithHorizontalEdge();
        this.collidedWithVerticalEdge();
    }

    didCollideWithCircularObject = (obj) => {
        return collideCircleCircle(this.vector.x, this.vector.y, this.diam, obj.x, obj.y, obj.r);
    }

    handleBulletCollisions = (bullets) => {
        if (!bullets || bullets.length === 0){
            return;
        }
        for (let x = 0; x < bullets.length; x++) {
            const currentBullet = bullets[x];
            if (this.didCollideWithCircularObject(currentBullet.getBullet())){
                document.dispatchEvent(new CustomEvent("deleteBullet", {
                    detail: {
                        bulletId: currentBullet.id,
                        score: this.value
                    }
                }));

                document.dispatchEvent(new CustomEvent("deleteSpider", {
                    detail: this
                }));

                break;
            }
        }
    }

    moveDiagonally = () => {
        if (this.paused){
            this.moveVertically();
            return;
        }

        this.vector.x += this.horizontalDirection === DIRECTIONS.LEFT ? Math.abs(this.speed) : -Math.abs(this.speed);
        this.vector.y += this.verticalDirection === DIRECTIONS.UP ? -Math.abs(this.speed) : Math.abs(this.speed);
    }

    moveVertically = () => {
        let thisSpider = this;
        this.vector.y += this.verticalDirection === DIRECTIONS.UP ? -Math.abs(this.speed) : Math.abs(this.speed);
        setTimeout(() => {
            thisSpider.paused = false;
        }, 2000);
    }

    collidedWithHorizontalEdge = () => {
        const marginLeftX = CANVASSTART + BASE_HORIZONTAL_MARGIN;
        const marginRightX = CANVASSIZE - BASE_HORIZONTAL_MARGIN;

        if (this.vector.x >= marginRightX || this.vector.x <= marginLeftX) {
            document.dispatchEvent(new CustomEvent("deleteSpider", {
                detail: this
            }));
        }
    }

    collidedWithVerticalEdge = () => {
        const marginTopY = BASE_TOP_SPIDER_MARGIN;
        const marginBottomY = CANVASSIZE - BASE_VERTICAL_MARGIN;

        if (this.vector.y <= marginTopY || this.vector.y >= marginBottomY) {
            this.verticalDirection = this.verticalDirection === DIRECTIONS.UP ? DIRECTIONS.DOWN : DIRECTIONS.UP;
        }
    }
}
