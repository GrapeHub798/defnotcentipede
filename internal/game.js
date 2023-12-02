import Ship from "./ship.js";
import MushroomHelper from "./mushroomHelper.js";
import BulletHelper from "./bulletHelper.js";
import Centipede from "./centipede.js";
import {CANVASSIZE, CENTIPEDE_START_X} from "./config.js";
import Grid from "./grid.js";
import {DIRECTIONS} from "./types.js";
import Spider from "./spider.js"

//base constants
const baseBottomMargin = 30;
const maxTopBoundary = 0;

let grid;

const mushroomsToCreate = 20;

let mushroomHandler;
let bulletHandler;

let centipedes = [];
let spiders = [];

let ship;
let shipLives = 3;

let isPaused = false;
let score = 0;
function setup() {
    createCanvas(CANVASSIZE, CANVASSIZE);
    noCursor();

    //create the grid
    grid = new Grid();

    mushroomHandler = new MushroomHelper(mushroomsToCreate, grid);
    bulletHandler = new BulletHelper(maxTopBoundary);

    centipedes.push(new Centipede(CENTIPEDE_START_X, 10, 1.5, 2));

    ship = new Ship(CANVASSIZE, baseBottomMargin, mushroomHandler.mushrooms);

    //add spider delay using interval
    startSpiderCreation();
    //spiders.push(new Spider(1))

    //const createMushroomEvent = new Event("createMushroom", {mushroom: });

    document.addEventListener("createMushroom", function (e) {
        mushroomHandler.createSingleMushroom(e.detail)
    });

    /* CENTIPEDE EVENT LISTENERS */
    document.addEventListener("bulletHitCentipede", function (e) {
        const centipedeCollisionData = e.detail;
        if (centipedeCollisionData?.newCentipedesToCreate?.length > 0) {
            const deletedCentipedeIndex = centipedes.findIndex(singleCentipede => singleCentipede.id == centipedeCollisionData.singlePieceDestroyedId)
            centipedes.splice(deletedCentipedeIndex, 1);
            //get the pieces and make new centipede
            centipedeCollisionData?.newCentipedesToCreate.forEach(newCentipede => {
                const newX = newCentipede.start.vector.x
                const newY = newCentipede.start.vector.y
                const newDirection = newCentipede.start.horizontalDirection === DIRECTIONS.RIGHT ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
                centipedes.push(new Centipede(newX, newY, 1, newCentipede.length, newDirection))
            });
            return;
        }

        //advance the level
    })

    document.addEventListener("deleteCentipede", function (e) {
        const deletedCentipedeIndex = centipedes.findIndex(singleCentipede => singleCentipede.id == e.detail)
        centipedes.splice(deletedCentipedeIndex, 1);
    })

    /* SPIDER EVENT LISTENERS */
    //create spider event Listener
    document.addEventListener("createSpider", function (e) {
        spiders.push(new Spider(1))
    })

    //delete spider event Listener
    document.addEventListener("deleteSpider", function (e) {
        spiders = spiders.filter(singleSpider => singleSpider.id != e.detail.id)
    })

    /* BULLET COLLISION EVENT LISTENTS */
    document.addEventListener("deleteBullet", function (e) {
        //delete a bullet when colliding with a centipede or spider
        bulletHandler.removeCollidedBullets([e.detail.bulletId]);
        //add the score
        score += e?.detail?.score ? e.detail.score : 0
    })

    /* MUSHROOM COLLISION EVENT LISTENERS */
    document.addEventListener("deleteMushroom", function (e) {
        //delete a bullet when colliding with a centipede or spider
        mushroomHandler.removeCollidedMushrooms(e.detail.mushroomId);
    })

    /*SHIP COLLISION EVENT LISTENERS */
    document.addEventListener("destroyShip", function (e) {
        shipLives--
        if (shipLives){
            setTimeout(() => {
                ship = new Ship(CANVASSIZE, baseBottomMargin, mushroomHandler.mushrooms);
            }, 2000)
            return;
        }
        endGame();
    })

    /*GAME OVER EVENT LISTENER */
    document.addEventListener("gameOver", function (e) {
        //delete a bullet when colliding with a centipede or spider
        mushroomHandler.removeCollidedMushrooms(e.detail.mushroomId);
    })
}

/*Mouse Click/Fire */
function draw() {
    background("#000000");
    //find all mushrooms that are collable with ship
    //const collableMushrooms = mushroomHelper.getCollidableMushrooms(mushrooms, topCollidableMargin, bbottomMushroomMargin);


    //custom render
    //https://editor.p5js.org/slow_izzm/sketches/8-7c1RdrO
    bulletHandler.run();

    mushroomHandler.mushrooms.forEach(singleMushroom => {
        singleMushroom.display();
    })
    mushroomHandler.handleBulletCollision(bulletHandler.getBullets());

    if (spiders && spiders.length > 0) {
        for (let x = 0; x < spiders.length; x++) {
            const singleSpider = spiders[x];
            singleSpider.run();
            singleSpider.handleBulletCollisions(bulletHandler.getBullets())
        }
    }

    if (centipedes && centipedes.length > 0) {
        for (let x = 0; x < centipedes.length; x++) {
            const singleCentipede = centipedes[x];
            singleCentipede.run();
            singleCentipede.handleMushroomCollision(mushroomHandler.mushrooms);
            //singleCentipede.handleBulletCollision(bulletHandler.getBullets());
        }
    }

    manageShip();

    //move this functionality into the mushroom itself
    manageScore();
}

//handle firing
const mousePressed = () => {
    if (!ship){
        return;
    }
    const {x, y} = ship.getShipPosition();
    bulletHandler.fire(x, y);
}

//handle pause
function keyPressed(){
    if (key == ' ') { //this means space bar, since it is a space inside of the single quotes
        isPaused = !isPaused;
    }
    if (isPaused){
        noLoop()
    }else{
        loop()
    }
}

const pauseGame = () => {
    if (!isPaused){
        noLoop()
    }else{
        loop()
    }
    isPaused = !isPaused;
}

const start = () => {

}

const endGame = () => {
    pauseGame();
    displayGameOver();
}
const manageScore = () => {
    textSize(10);
    fill("#FFFFFF");
    text(score, 360, 10);
}

const displayGameOver = () => {
    textSize(30);
    fill("#FFFFFF");
    text("GAME OVER", 110, 200);
}

const manageShip = () => {
    if (!ship || !ship.show){
        ship = null;
        return;
    }
    ship.calculateMouseHorizontalPosition();
    ship.calculateMouseVerticalPosition();
    ship.updateMushrooms(mushroomHandler.mushrooms);
    ship.handleSpiderCollision(spiders);
    ship.handleCentipedeCollision(centipedes);
    ship.display();
}

//random spider creation
const startSpiderCreation = () => {

    let spiderStartTimer = Math.floor(Math.random() * 1000);
    setTimeout(createSingleSpider, spiderStartTimer);

    function createSingleSpider() {
        spiderStartTimer = Math.floor(Math.random() * 30000);

        document.dispatchEvent(new CustomEvent("createSpider", {
            detail: ""
        }));

        setTimeout(createSingleSpider, spiderStartTimer);
    }
}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
