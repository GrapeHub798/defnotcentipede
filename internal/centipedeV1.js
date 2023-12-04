import Helpers from "./helpers.js";
import {CENTIPEDE_SPEEDS, CENTIPEDE_TYPES, DIRECTIONS, SEGMENT_TYPES} from "./types.js";
import {
    BASE_HORIZONTAL_MARGIN,
    BASE_VERTICAL_MARGIN,
    CANVASSIZE,
    CANVASSTART,
    CENTIPEDE_VERTICAL_MOVE
} from "./config.js";

/*
class Parent extends Segment {

}

class Child extends Segment {

}

class Segment {
    constructor(diam, vector, order, customDirection = '') {
        this.id =  Helpers.uuidv4();
        this.order = order;
        this.diam = diam;
        this.vector = vector;
        this.horizontalDirection = customDirection || DIRECTIONS.RIGHT;
        this.verticalDirection = DIRECTIONS.DOWN;
        this.bounceCompensation = 2;
        this.allowMoveVertically = true;
        this.hitBottom = false;
        this.verticalMove = CENTIPEDE_VERTICAL_MOVE;
    }

    getSegment = () => {
        return {
            id: this.id,
            x: this.vector.x,
            y: this.vector.y,
            r: this.diam
        }
    }

    draw = () => {
        fill("#34eb37");
        ellipse(this.vector.x, this.vector.y, this.diam, this.diam);
    }

    moveHorizontally = (velocity) => {
        this.vector.x += this.horizontalDirection === DIRECTIONS.RIGHT ? Math.abs(velocity) : -Math.abs(velocity);
    }

    moveVertically = () => {
        this.vector.y += this.verticalDirection === DIRECTIONS.DOWN ? Math.abs(this.verticalMove) : -Math.abs(this.verticalMove);
    }

    collidedWithEdge = () => {
        //TODO: maybe move this into a smaller function
        const marginLeftX = CANVASSTART + BASE_HORIZONTAL_MARGIN;
        const marginRightX = CANVASSIZE - BASE_HORIZONTAL_MARGIN;

        if (this.vector.x >= marginRightX || this.vector.x <= marginLeftX) {
            this.boundaryCollisionHandler();
        }
    }

    collidedWithBottom = () => {
        const bottomMargin = CANVASSIZE - BASE_VERTICAL_MARGIN;

        if (this.vector.y >= bottomMargin){
            this.hitBottom = true;
            this.verticalDirection = DIRECTIONS.UP;
        }
    }

    collidedWithTop = () => {
        const topMarginAfterHitBottom = (CANVASSIZE / 4) * 3;
        if (!this.hitBottom){
            return;
        }

        if (this.vector.y <= topMarginAfterHitBottom){
            this.verticalDirection = DIRECTIONS.DOWN;
        }
    }

    boundaryCollisionHandler = (isMushroom) => {
        this.horizontalDirection = this.horizontalDirection === DIRECTIONS.RIGHT ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
        if (isMushroom){
            //compensate for weird mushroom bug
            const moveDistance = this.horizontalDirection === DIRECTIONS.RIGHT ? Math.abs(this.bounceCompensation) : -Math.abs(this.bounceCompensation);
            this.vector.x += moveDistance
        }

        //if collided recently disable move down for .5 second
        if (this.allowMoveVertically) {
            this.moveVertically();
            this.disableEnableMoveVertically();
        }
    }

    disableEnableMoveVertically = (fn) => {
        this.allowMoveVertically = false;
        setTimeout(() => {
            this.allowMoveVertically = true;
        }, 100)
    }

    collidedWithCircularObject = (obj) => {
        return collideCircleCircle(this.vector.x, this.vector.y, this.diam, obj.x, obj.y, obj.r);
    }
    collidedWithMushroom = (mushroom) => {
        const hit = collideRectCircle(mushroom.x, mushroom.y, mushroom.w, mushroom.h, this.vector.x, this.vector.y, this.diam + -Math.abs(this.bounceCompensation));
        if (hit){
            this.boundaryCollisionHandler(true);
        }
    }
}
*/

class Segment {
    constructor(diam, x, y) {
        this.id = Helpers.uuidv4();
        this.diam = diam;
        this.x = x;
        this.y = y;
        this.verticalMove = CENTIPEDE_VERTICAL_MOVE;
        this.verticalDirection = DIRECTIONS.DOWN;
    }
    draw = () => {
        fill("#34eb37");
        ellipse(this.x, this.y, this.diam, this.diam);
    }

    collidedWithCircularObject = (obj) => {
        return collideCircleCircle(this.x, this.y, this.diam, obj.x, obj.y, obj.r);
    }

    moveVertically = () => {
        this.y += this.verticalDirection === DIRECTIONS.DOWN ? Math.abs(this.verticalMove) : -Math.abs(this.verticalMove);
    }
}

class Parent extends Segment {
    constructor(diam, x, y, customDirection = '') {
        super(diam, x, y);
        this.type = SEGMENT_TYPES.PARENT;
        this.horizontalDirection = customDirection || DIRECTIONS.RIGHT;
        this.allowMoveVertically = true;
        this.hitBottom = false;
        this.bounceCompensation = 2;
    }

    moveHorizontally = (velocity) => {
        this.x += this.horizontalDirection === DIRECTIONS.RIGHT ? Math.abs(velocity) : -Math.abs(velocity);
    }

    collidedWithEdge = () => {
        //TODO: maybe move this into a smaller function
        const marginLeftX = CANVASSTART + BASE_HORIZONTAL_MARGIN;
        const marginRightX = CANVASSIZE - BASE_HORIZONTAL_MARGIN;

        if (this.x >= marginRightX || this.x <= marginLeftX) {
            this.boundaryCollisionHandler();
        }
    }

    boundaryCollisionHandler = (isMushroom) => {
        this.horizontalDirection = this.horizontalDirection === DIRECTIONS.RIGHT ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
        if (isMushroom){
            //compensate for weird mushroom bug
            const moveDistance = this.horizontalDirection === DIRECTIONS.RIGHT ? Math.abs(this.bounceCompensation) : -Math.abs(this.bounceCompensation);
            this.x += moveDistance
        }

        //if collided recently disable move down for .5 second
        if (this.allowMoveVertically) {
            this.moveVertically();
            this.disableEnableMoveVertically();
        }
    }

    disableEnableMoveVertically = (fn) => {
        this.allowMoveVertically = false;
        setTimeout(() => {
            this.allowMoveVertically = true;
        }, 100)
    }

    collidedWithMushroom = (mushroom) => {
        const hit = collideRectCircle(mushroom.x, mushroom.y, mushroom.w, mushroom.h, this.x, this.y, this.diam + -Math.abs(this.bounceCompensation));
        if (hit){
            this.boundaryCollisionHandler(true);
        }
    }

    collidedWithBottom = () => {
        const bottomMargin = CANVASSIZE - BASE_VERTICAL_MARGIN;

        if (this.y >= bottomMargin){
            this.hitBottom = true;
            this.verticalDirection = DIRECTIONS.UP;
        }
    }

    collidedWithTop = () => {
        const topMarginAfterHitBottom = (CANVASSIZE / 4) * 3;
        if (!this.hitBottom){
            return;
        }

        if (this.y <= topMarginAfterHitBottom){
            this.verticalDirection = DIRECTIONS.DOWN;
        }
    }
}

class Child extends Segment {
    constructor(diam, x, y) {
        super(diam, x, y);

        this.type = SEGMENT_TYPES.CHILD;
    }

    //adjust the x and y coords
    // .01, .02, .04, .06, .08
    adjustSelf = (previousSegment, speed) => {
        const lerpSpeed = CENTIPEDE_SPEEDS.get(speed);
        this.x = lerp(this.x, previousSegment.x, lerpSpeed);
        this.y = lerp(this.y, previousSegment.y, lerpSpeed);
    }
}


export default class CentipedeV1 {
    constructor(startX, startY, speed, length, customDirection = '') {
        this.id =  Helpers.uuidv4();
        this.head = '';
        this.length = length;
        this.segments = [];
        this.diam = 10;
        this.startX = startX;
        this.startY = startY
        this.speed = speed;
        this.minimumPiece = 1;
        this.value = 100;

        this.createSegment(customDirection);
    }

    createSegment = (customDirection = '') => {
        if (this.length < this.minimumPiece){
            this.length = this.minimumPiece;
        }

        this.segments.push(new Parent(this.diam, this.startX, this.startY, createVector(this.startX, this.startY), customDirection));
        for (let x = 1; x < this.length; x++) {
            this.segments.push(new Child(this.diam, this.startX, this.startY));
        }
    }

    run = () => {
        this.move();
        this.draw();
    }

    draw = () => {
        for (let i = 0; i < this.segments.length; i++){
            this.segments[i].draw();
        }
    }

    move = () => {
        const newSpeed = new createVector(this.speed, 0)
        //move first piece
        const firstSegment = this.segments[0];
        firstSegment.collidedWithEdge();
        firstSegment.collidedWithTop();
        firstSegment.collidedWithBottom();
        firstSegment.moveHorizontally(newSpeed.x);


        for(let i= 1; i < this.segments.length; i++){
            const currentSegment = this.segments[i];

            if (this.segments[i-1]) {
                const parentSegment = this.segments[i-1]
                currentSegment.adjustSelf(parentSegment, newSpeed.x);
            }
            /*
            currentSegment.collidedWithEdge();
            currentSegment.collidedWithTop();
            currentSegment.collidedWithBottom();

            //look at the distance from the piece behind and the piece ahead

            //first, is there a segment in front of this?

            currentSegment.moveHorizontally(newSpeed.x);
            */
        }
    }

    handleBulletCollision = (bullets) => {
        if (!bullets || bullets.length === 0 || !this.segments || this.segments.length === 0){
            return {
                newCentipedes: []
            }
        }

        for (let x = 0; x < bullets.length; x++) {
            const currentBullet = bullets[x];
            for(let i= 0; i < this.segments.length; i++){
                const currentCentipedePiece = this.segments[i];
                if (currentCentipedePiece.collidedWithCircularObject(currentBullet.getBullet())){
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
                            centipedeStartPiece.moveVertically()

                        newCentipedes.push({
                            start: centipedeStartPiece,
                            length: this.segments.slice(0, i).length,
                        })
                    }

                    if (this.segments[i+1]){
                        const centipedeStartPiece = this.segments[i+1];
                        if (randomCentipede == CENTIPEDE_TYPES.TAIL)
                            centipedeStartPiece.moveVertically()

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

    handleMushroomCollision = (mushrooms) => {
        if (!mushrooms || mushrooms.length === 0){
            return;
        }

        const parentSegment = this.segments[0];
        for (let x = 0; x < mushrooms.length; x++){
            const currentMushroom = mushrooms[x];
            parentSegment.collidedWithMushroom(currentMushroom);
        }
    }
}
