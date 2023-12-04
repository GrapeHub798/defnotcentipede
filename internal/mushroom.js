import {OBJECT_TYPES} from "./types.js";

export default class Mushroom {
    constructor(id, key, x, y, color) {
        this.type = OBJECT_TYPES.MUSHROOM;
        this.id = id;
        this.key = key;
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 10;
        this.col = color;
        this.hp = 4;
    }

    display = () => {
        fill(this.col);
        rect(this.x, this.y, this.w, this.h);
    }

    didNotSurvivedHit = () => {
        this.hp -= 1;
        if (this.hp <= 1){
            return true;
        }
        //resize the mushroom vertically
        this.h -= 3;
        return false;
    }

    didCollideWithCircularObject = (obj) => {
        return collideRectCircle(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.r);
    }

    handleBulletCollision = (bullets) => {
        if (!bullets || bullets.length === 0){
            return;
        }

        for (let x = 0; x < bullets.length; x++) {
            const currentBullet = bullets[x];
            if (this.didCollideWithCircularObject(currentBullet.getBullet())) {
                document.dispatchEvent(new CustomEvent("deleteBullet", {
                    detail: {
                        bulletId: currentBullet.id,
                        score: this.value
                    }
                }));

                this.checkMushroomSurvival();
            }
        }
    }

    checkMushroomSurvival = () => {
        if (this.didNotSurvivedHit()){
            document.dispatchEvent(new CustomEvent("deleteMushroom", {
                detail: {
                    mushroomId: this.id
                }
            }));
        }
    }
}
