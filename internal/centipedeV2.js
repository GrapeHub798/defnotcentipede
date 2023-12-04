import Helpers from "./helpers.js";
import {CENTIPEDE_TYPES, DIRECTIONS} from "./types.js";
import {BASE_HORIZONTAL_MARGIN, BASE_VERTICAL_MARGIN, CANVASSIZE, CANVASSTART, CENTIPEDE_DIAMETER} from "./config.js";

class Segment {
    constructor(x, y, color, direction) {
        this.id =  Helpers.uuidv4();
        this.x = x;
        this.y = y;
        this.color = color;
        this.diameter = CENTIPEDE_DIAMETER;
        this.directionX = direction || DIRECTIONS.RIGHT;
        this.directionY = DIRECTIONS.DOWN;
        this.setBoundaries()
    }

    draw = () => {
        fill(this.color);
        ellipse(this.x, this.y,  this.diameter);
    }

    setBoundaries = () => {
        this.marginLeftX = CANVASSTART + BASE_HORIZONTAL_MARGIN;
        this.marginRightX = CANVASSIZE - BASE_HORIZONTAL_MARGIN;
        this.marginTopY = (CANVASSIZE / 4) * 3;
        this.marginBottomY = CANVASSIZE - BASE_VERTICAL_MARGIN;
    }

    didCollideWithEdge = () => {
        return this.x < this.marginLeftX  || this.x >= this.marginRightX;
    }

    moveToMarginX = () => {
        this.x = this.directionX === DIRECTIONS.RIGHT ? this.marginRightX : this.marginLeftX;
    }

    moveToMarginY = () => {
        this.y = this.directionY === DIRECTIONS.UP ? this.marginTopY : this.marginBottomY;
    }

    catchUpToSibling = (previousSegment) => {
        const distance = Math.abs(this.x - previousSegment.x);
        if (distance !== CENTIPEDE_DIAMETER){
            this.x = this.directionX === DIRECTIONS.RIGHT ? previousSegment.x - CENTIPEDE_DIAMETER : previousSegment.x + CENTIPEDE_DIAMETER
        }
    }

    moveX = (speed) => {
        this.x += this.directionX === DIRECTIONS.RIGHT ? Math.abs(speed) : -Math.abs(speed);
    }

    moveY = (speed) => {
        this.y += this.directionY === DIRECTIONS.DOWN ? Math.abs(speed) : -Math.abs(speed);
    }

    changeXDirection = () => {
        this.directionX = this.directionX === DIRECTIONS.RIGHT ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
    }

    changeYDirection = () => {
        this.directionY = this.directionY === DIRECTIONS.UP ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    }

    didCollidedWithBottom = () => {
        return this.y >= this.marginBottomY;
    }

    didCollideWithTop = () => {
        return this.y <= this.marginTopY
    }

    didCollideWithMushroom = (mushroom) => {
        return collideRectCircle(mushroom.x, mushroom.y, mushroom.w, mushroom.h, this.x, this.y, this.diameter-1);
    }

    moveToOutsideOfMushroom = (mushroom) => {
        this.x = this.directionX === DIRECTIONS.RIGHT ?  mushroom.x - (mushroom.w/2)  : mushroom.x + (mushroom.w * 1.5);
    }

    didCollideWithBullet = (bullet) => {
        return collideCircleCircle(this.x, this.y, this.diameter, bullet.x, bullet.y, bullet.r);
    }
}
export default class CentipedeV2 {
    constructor(x, y, color, speed, length, direction = '') {
        this.id = Helpers.uuidv4();
        this.length = length;
        this.segments = [];
        this.speed = speed;
        this.hitBottom = false;
        this.direction = direction || DIRECTIONS.RIGHT;
        this.createSegments(x, y, color, length, direction);
    }

    createSegments = (x, y, color, length, direction) => {
        let localX = x
        //depending on the direction we adjust the x and y
        for (let i = 0; i < this.length; i++) {
            this.segments.push(new Segment(localX, y, color, direction));
            localX += this.direction === DIRECTIONS.RIGHT ? -Math.abs(CENTIPEDE_DIAMETER) : Math.abs(CENTIPEDE_DIAMETER);
        }
    }

    run = (mushrooms) => {
        this.move(mushrooms);
        this.draw();
    }

    draw = () => {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw();
        }
    }

    move = (mushrooms) => {
        //loop through all the segments
        for (let i = 0; i < this.segments.length; i++) {
            const currentSegment = this.segments[i];
            const previousSegment = this.segments[i - 1];
            //did we collide with a mushroom
            this.handleSegmentEdgeCollision(currentSegment, previousSegment);

            //did we collide with a mushroom
            this.handleCollisionWithMushrooms(currentSegment, previousSegment, mushrooms);
        }
    }

    handleBulletCollision = (bullets) => {
        if (!bullets || bullets.length === 0 || !this.segments || this.segments.length === 0){
            return;
        }

        for (let x = 0; x < bullets.length; x++) {
            const currentBullet = bullets[x];
            for(let i= 0; i < this.segments.length; i++){
                const currentCentipedePiece = this.segments[i];
                if (currentCentipedePiece.didCollideWithBullet(currentBullet.getBullet())){
                    //remove this piece
                    const oldPiece = this.segments.splice(i, 1);

                    //create a mushroom when hit
                    document.dispatchEvent(new CustomEvent("createMushroom", {
                        detail: oldPiece[0]
                    }));

                    //random pick one of the 2 centipedes to move down a position
                    const randomCentipede = Math.random() < 0.5 ? CENTIPEDE_TYPES.HEAD : CENTIPEDE_TYPES.TAIL;

                    const newCentipedes = [];
                    if (this.segments[i-1]){
                        const centipedeStartPiece = this.segments[i-1];
                        if (randomCentipede == CENTIPEDE_TYPES.HEAD)
                            centipedeStartPiece.moveY(CENTIPEDE_DIAMETER);

                        newCentipedes.push({
                            start: centipedeStartPiece,
                            length: this.segments.slice(0, i).length,
                        })
                    }

                    if (this.segments[i+1]){
                        const centipedeStartPiece = this.segments[i+1];
                        if (randomCentipede == CENTIPEDE_TYPES.TAIL)
                            centipedeStartPiece.moveY(CENTIPEDE_DIAMETER);

                        newCentipedes.push({
                            start: centipedeStartPiece,
                            length: this.segments.slice(i).length,
                        })
                    }

                    document.dispatchEvent(new CustomEvent("deleteBullet", {
                        detail: {
                            bulletId: currentBullet.id,
                            score: this.value
                        }
                    }));

                    document.dispatchEvent(new CustomEvent("bulletHitCentipede", {
                        detail: {
                            newCentipedesToCreate: newCentipedes,
                            singlePieceDestroyedId: this.id
                        }
                    }));
                }
            }
        }
    }

    handleSegmentEdgeCollision = (currentSegment, previousSegment) => {
        //try to move left or right
        this.handleXCollision(currentSegment, previousSegment);
        this.handleYCollision(currentSegment);
    }

    handleXCollision = (currentSegment, previousSegment) => {
        currentSegment.moveX(this.speed);

        //did we collide with an edge
        if (currentSegment.didCollideWithEdge()) {
            currentSegment.moveToMarginX();
            currentSegment.changeXDirection();
            currentSegment.moveY(CENTIPEDE_DIAMETER);
            if (currentSegment.id === this.segments[0].id) {
                return;
            }

            //otherwise catch up to previous
            if (previousSegment) {
                currentSegment.catchUpToSibling(previousSegment);
            }
        }
    }

    handleYCollision = (currentSegment) => {
        this.handleYBottomCollision(currentSegment);
        this.handleYTopCollision(currentSegment);
    }

    handleYBottomCollision = (currentSegment) => {
        if (currentSegment.didCollidedWithBottom()) {
            //move to margin
            currentSegment.moveToMarginY();
            currentSegment.changeYDirection();
            //change horizontal direction
            currentSegment.changeXDirection();
            this.hitBottom = true
        }
    }

    handleYTopCollision = (currentSegment) => {
        if (this.hitBottom && currentSegment.didCollideWithTop()) {
            currentSegment.moveToMarginY();
            currentSegment.changeYDirection();
            //change horizontal direction
            currentSegment.changeXDirection();
        }
    }

    handleCollisionWithMushrooms = (currentSegment, previousSegment, mushrooms) => {
        //loop through the mushroom
        for (let i = 0; i < mushrooms.length; i++) {
            const currentMushroom = mushrooms[i];
            //did we collide with a mushroom
            if (currentSegment.didCollideWithMushroom(currentMushroom)){
                //move to outside of the mushroom
                currentSegment.moveToOutsideOfMushroom(currentMushroom)
                //change X direction
                currentSegment.changeXDirection();
                //move Y direction
                currentSegment.moveY(CENTIPEDE_DIAMETER);

                //did we collide with the top? and is hitBottom on?
                if (this.hitBottom && currentSegment.didCollideWithTop()) {
                    currentSegment.changeYDirection();
                    currentSegment.changeXDirection();
                    currentSegment.moveY(CENTIPEDE_DIAMETER);
                }

                if (currentSegment.id === this.segments[0].id) {
                    return;
                }

                //otherwise catch up to previous
                if (previousSegment) {
                    currentSegment.catchUpToSibling(previousSegment);
                }
            }
        }
    }
}
