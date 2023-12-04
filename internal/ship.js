import {BASE_HORIZONTAL_MARGIN, CANVASSIZE} from "./config.js";

export default class Ship {

    shipId = "ship";
    defaultColor = "#d2daea";
    constructor(canvasSize, baseBottomMargin, mushrooms) {
        this.id = this.shipId;
        this.x = canvasSize/2;
        this.y = 350;
        this.r = 10;
        this.col = this.defaultColor;
        this.lives = 4;
        this.show = true;

        this.canvasSize = canvasSize;
        this.baseHorizontalMargin = BASE_HORIZONTAL_MARGIN;
        this.baseBottomMargin = baseBottomMargin;
        this.mushrooms = mushrooms;
    }

    updateMushrooms = (newMushrooms) => {
        this.mushrooms = newMushrooms;
    }

    getShipPosition = () =>{
        return this;
    }

    calculateMouseHorizontalPosition = () => {
        const rightMargin = this.canvasSize - this.baseHorizontalMargin;
        const leftMargin = this.baseHorizontalMargin;

        if (mouseX > rightMargin) {
            this.x = rightMargin;
            return;
        }


        if (mouseX < leftMargin) {
            this.x = leftMargin;
            return;
        }

        //handle mushroom collisions
        this.x = this.checkMushroomsHorizontally();
    }

    calculateMouseVerticalPosition = () => {
        const topMargin = (this.canvasSize / 4) * 3;
        const bottomMargin = this.canvasSize - this.baseBottomMargin;
        if (mouseY < topMargin) {
            this.y = topMargin;
            return;
        }

        if (mouseY > bottomMargin) {
            this.y = bottomMargin;
            return;
        }
        this.y = this.checkMushroomsVertically();
    }

    checkMushroomsHorizontally = () => {
        if (!this.mushrooms || this.mushrooms.length === 0){
            return mouseX;
        }

        for (let i = 0; i < this.mushrooms.length; i++) {
            const currentMushroom = this.mushrooms[i];
            const collidedWithMushroom = this.collidedWithObject(currentMushroom);
            if (collidedWithMushroom){
                const leftBoundary = currentMushroom.x - currentMushroom.w;
                const rightBoundary = currentMushroom.x + currentMushroom.w;

                const shipLeftX = mouseX - this.r;
                const shipRightX = mouseX + this.r;
                const xLeftDistance =  Math.abs(leftBoundary - shipRightX);
                const xRightDistance =  Math.abs(rightBoundary - shipLeftX);

                if (xLeftDistance > xRightDistance){
                    return rightBoundary;
                }

                if (xRightDistance > xLeftDistance){
                    return leftBoundary;
                }

                if (xRightDistance === xLeftDistance){
                    return Math.random() < 0.5 ? leftBoundary : rightBoundary;
                }
                break;
            }
        }

        return mouseX;
    }

    collidedWithObject = (obj) => {
        if (!obj || (!obj.x || !obj.y)){
            return false;
        }
        return collideRectRect(mouseX, mouseY, this.r, this.r, obj.x, obj.y, obj.w, obj.h);
    }
    checkMushroomsVertically = (arrayOfMushrooms, y) => {

        if (!this.mushrooms || this.mushrooms.length === 0){
            return mouseY;
        }

        for (let i = 0; i < this.mushrooms.length; i++) {
            const currentMushroom = this.mushrooms[i];
            const collidedWithMushroom = this.collidedWithObject(currentMushroom);
            if (collidedWithMushroom){
                const topBoundary = currentMushroom.y - currentMushroom.h;
                const bottomBoundary = currentMushroom.y + currentMushroom.h;

                const shipTopY = mouseY + this.r;
                const shipBottomY = mouseY + this.r;
                const yTopDistance =  Math.abs(topBoundary - shipTopY);
                const yBottomDistance =  Math.abs(bottomBoundary - shipBottomY);

                if (yTopDistance > yBottomDistance){
                    return topBoundary;
                }

                if (yBottomDistance > yTopDistance){
                    return bottomBoundary;
                }

                if (yBottomDistance === yTopDistance){
                    return Math.random() < 0.5 ? bottomBoundary : topBoundary;
                }
                break;
            }
        }

        return mouseY;
    }

    didCollideWithSpider = (obj) => {
        return collideRectCircle(this.x, this.y, this.r, this.r, obj.x, obj.y, obj.r);
    }

    didCollideWithCentipedeSegment = (obj) => {
        return collideRectCircle(this.x, this.y, this.r, this.r, obj.x, obj.y, obj.diameter);
    }

    handleSpiderCollision = (spiders) => {
        if (!spiders || spiders.length === 0){
            return;
        }

        for (let x = 0; x < spiders.length; x++){
            const currentSpider = spiders[x];

            if (this.didCollideWithSpider(currentSpider.getSpider())){
                //delete spider
                document.dispatchEvent(new CustomEvent("deleteSpider", {
                    detail: currentSpider
                }));

                //delete ship
                this.show = false;
                document.dispatchEvent(new CustomEvent("destroyShip", {
                    detail: null
                }));
            }
        }
    }

    handleCentipedeCollision = (centipedes) => {
        if (!centipedes || centipedes.length === 0){
            return;
        }

        for (let x = 0; x < centipedes.length; x++){
            const currentCentipede = centipedes[x];
            //loop through the centipede pieces
            for (let i = 0; i < currentCentipede.segments.length; i++){
                const currentSegment = currentCentipede.segments[i];

                //only care when below a certain level
                if (currentSegment.y < (CANVASSIZE / 4) * 3){
                    continue;
                }

                if (this.didCollideWithCentipedeSegment(currentSegment)){
                    //delete ship
                    this.show = false;
                    document.dispatchEvent(new CustomEvent("destroyShip", {
                        detail: null
                    }));

                    //delete centipede
                    document.dispatchEvent(new CustomEvent("deleteCentipede", {
                        detail: currentCentipede.id
                    }));
                    break;
                }
            }
        }
    }

    display = () => {
        if (!this.show){
            return;
        }
        fill(this.col);
        rect(this.x, this.y, this.r, this.r);
    }
}
