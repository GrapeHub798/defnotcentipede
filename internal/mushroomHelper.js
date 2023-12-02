import Mushroom from "./mushroom.js";
import {CANVASSIZE} from "./config.js";
import Helpers from "./helpers.js";

export default class MushroomHelper {

    constructor(mushroomToCreate, grid) {
        this.grid = grid;
        this.mushrooms = this.createMushrooms(mushroomToCreate);
    }

    static getCollidableMushrooms = (mushrooms, topLimit, bottomLimit) => {

    }

    createSingleMushroom = (newMushroomDetails) => {
        const closestCell = this.findClosestCell(newMushroomDetails);

        //make sure a mushroom is not there already
        const existingMushroom = this.getExistingMushroom(closestCell);

        const maxId = this.getMaxMushroomId();
        //create a mushroom there
        if (!existingMushroom){
            this.mushrooms.push(new Mushroom(maxId+1, closestCell.gridKey, closestCell.x, closestCell.y));
        }
    }

    getMaxMushroomId = () => {
        return this.mushrooms.reduce((max, singleMushroom) => singleMushroom.id > max ? singleMushroom.id : max,0);
    }

    getExistingMushroom = (potentialMushroom) => {
        return this.mushrooms.find(singleMushroom => singleMushroom.x === potentialMushroom.x && singleMushroom.y === potentialMushroom.y);
    }

    findClosestCell = (newMushroomDetails) => {
        //loop through the grid for the closest position
        const potentialMushroomX = newMushroomDetails.vector.x;
        const potentialMushroomY = newMushroomDetails.vector.y;

        let smallest = this.grid.getPositionForKey(1);
        let smallestDistance = CANVASSIZE;

        const gridKeys = this.grid.getGridKeys();

        for (const key of gridKeys) {
            const gridCellValue = this.grid.getPositionForKey(key)
            //find the smallest
            const dist = Helpers.getDistance(gridCellValue.x, gridCellValue.y, potentialMushroomX, potentialMushroomY);
            if (dist < smallestDistance) {
                smallestDistance = dist
                smallest = gridCellValue;
            }
        }
        return smallest;
    }

    createMushrooms = (mushroomCount) => {
        const mushrooms = [];
        const mushroomKeys = [];

        for (let x = 0; x < mushroomCount; x++){
            const newMushroomKey = this.generateSingleMushroom(mushroomKeys);
            mushroomKeys.push(newMushroomKey);
            const mushroomPositions = this.grid.getPositionForKey(newMushroomKey);
            //why am I saving the index of the for loop???
            mushrooms.push(new Mushroom(x, mushroomPositions.gridKey, mushroomPositions.x, mushroomPositions.y));
        }
        return mushrooms;
    }

    generateSingleMushroom = (existingMushroomKeys) => {
        const gridKeys = this.grid.getGridKeys();

        let found = false;
        let singleMushroomKey = Math.floor(Math.random() * gridKeys.length);
        while (!found) {
            if (!existingMushroomKeys.includes(gridKeys[singleMushroomKey])){
                found = true;
            }
            singleMushroomKey = Math.floor(Math.random() * gridKeys.length);
        }
        return gridKeys[singleMushroomKey];
    }

    handleBulletCollision = (bullets) => {
        const collidedBullets = [];
        if (!bullets || bullets.length === 0 || !this.mushrooms || this.mushrooms.length === 0){
            return collidedBullets;
        }

        for (let x = 0; x < this.mushrooms.length; x++) {
            this.mushrooms[x].handleBulletCollision(bullets);
        }
    }

    removeCollidedMushrooms = (mushroomId) => {
        this.mushrooms = this.mushrooms.filter(singleMushroom => singleMushroom.id !== mushroomId);
    }
}
