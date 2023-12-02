import {BASE_BOTTOM_MARGIN, BASE_HORIZONTAL_MARGIN, BASE_TOP_MARGIN, CANVASSIZE} from "./config.js";

export default class MushroomGrid {
    constructor() {
        this.grid = new Map();
        this.createGrid();
    }

    createGrid() {
        let gridKey = 1;
        for (let a = 5; a < CANVASSIZE; a += 10) {
            for (let b = 5; b < CANVASSIZE; b += 10) {
                this.grid.set(gridKey,{gridKey:gridKey, x: b, y: a});
                gridKey++
            }
        }
    }

    getGridKeys() {
        // limit keys to a specific area
        const allowedKeys = [];
        //limit Xs

        for (const [key, value] of this.grid) {
            if (value.x >= BASE_HORIZONTAL_MARGIN && value.x <= (CANVASSIZE - BASE_HORIZONTAL_MARGIN) && value.y >= BASE_TOP_MARGIN && value.y <= BASE_BOTTOM_MARGIN){
                //console.log(value.y);
                allowedKeys.push(key);
            }
        }
        return allowedKeys;
    }

    getPositionForKey(key){
        return this.grid.get(key);
    }
}
