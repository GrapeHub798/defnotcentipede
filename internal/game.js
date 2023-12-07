import Ship from "./ship.js";
import MushroomHelper from "./mushroomHelper.js";
import BulletHelper from "./bulletHelper.js";
import {CANVASSIZE, CENTIPEDE_START_X} from "./config.js";
import Grid from "./grid.js";
import {
    CENTIPEDE_COLORS,
    CENTIPEDE_LEVEL_COUNT,
    CENTIPEDE_SPEEDS,
    DIRECTIONS, MUSHROOM_COLORS,
    MUSHROOM_LEVEL_COUNT,
    SPIDER_LEVEL_COUNT
} from "./types.js";
import Spider from "./spider.js"
import CentipedeV2 from "./centipedeV2.js";

//base constants
const baseBottomMargin = 30;
const maxTopBoundary = 0;

let grid;
let level = 1;

let mushroomsToCreate = MUSHROOM_LEVEL_COUNT.get(level);

let mushroomHandler;
let bulletHandler;

let centipedes = [];
let spiders = [];

let ship;
let shipLives = 3;

let isPaused = false;
let score = 0;

let centipedeSpeed = CENTIPEDE_SPEEDS.get(level);
let centipedeColor = CENTIPEDE_COLORS.get(level);

let mushroomColor = MUSHROOM_COLORS.get(level);
function setup() {
    createCanvas(CANVASSIZE, CANVASSIZE);
    noCursor();

    //create the grid
    grid = new Grid();

    mushroomHandler = new MushroomHelper(mushroomsToCreate, grid, mushroomColor);
    bulletHandler = new BulletHelper(maxTopBoundary);

    centipedes.push(new CentipedeV2(CENTIPEDE_START_X, 10, centipedeColor, centipedeSpeed , 10 ));

    ship = new Ship(CANVASSIZE, baseBottomMargin, mushroomHandler.mushrooms);

    //add spider delay using interval
    startSpiderCreation();
    spiders.push(new Spider(1))

    document.addEventListener("createMushroom", function (e) {
        mushroomHandler.createSingleMushroom(e.detail, mushroomColor)
    });

    /* CENTIPEDE EVENT LISTENERS */
    document.addEventListener("bulletHitCentipede", async function (e) {
        const centipedeCollisionData = e.detail;
        score += 100;
        const deletedCentipedeIndex = centipedes.findIndex(singleCentipede => singleCentipede.id == centipedeCollisionData.singlePieceDestroyedId)
        centipedes.splice(deletedCentipedeIndex, 1);
        if (centipedeCollisionData?.newCentipedesToCreate?.length > 0) {
            //get the pieces and make new centipede
            centipedeCollisionData?.newCentipedesToCreate.forEach(newCentipede => {
                const newX = newCentipede.start.x
                const newY = newCentipede.start.y
                const newDirection = newCentipede.start.horizontalDirection === DIRECTIONS.RIGHT ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
                centipedes.push(
                    new CentipedeV2(newX, newY, centipedeColor, centipedeSpeed, newCentipede.length, newDirection)
                )
            });
        }

        //advance the level if we have no centipedes
        if (centipedes.length === 0) {
            await advanceLevel();
        }
    })

    document.addEventListener("deleteCentipede", async function (e) {
        const deletedCentipedeIndex = centipedes.findIndex(singleCentipede => singleCentipede.id == e.detail)
        centipedes.splice(deletedCentipedeIndex, 1);
        if (centipedes.length === 0) {
            await advanceLevel();
        }
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
            singleCentipede.run(mushroomHandler.mushrooms);
            singleCentipede.handleBulletCollision(bulletHandler.getBullets());
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

const delay = (delayInMs) => new Promise(resolve => setTimeout(resolve, delayInMs));

const advanceLevel = async () => {
    level++
    //get the mushrooms we want to create
    mushroomsToCreate = MUSHROOM_LEVEL_COUNT.get(level);
    mushroomColor = MUSHROOM_COLORS.get(level);
    mushroomHandler = new MushroomHelper(mushroomsToCreate, grid, mushroomColor);

    //get the number of centipedes
    const centipedeCount = CENTIPEDE_LEVEL_COUNT.get(level);

    //get centipede colors
    centipedeColor = CENTIPEDE_COLORS.get(level);

    //get the centipede speed
    centipedeSpeed = CENTIPEDE_SPEEDS.get(level);
    for (let x = 0; x < centipedeCount; x++) {
        const newDirection = Math.random() < 0.5 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
        await delay(3000);
        centipedes.push(new CentipedeV2(CENTIPEDE_START_X, 10, centipedeColor, centipedeSpeed , 10, newDirection));
    }
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
        spiderStartTimer = Math.floor(Math.random() * 10000);

        //get max spiders
        const maxSpiders = SPIDER_LEVEL_COUNT.get(level);
        if (spiders.length < maxSpiders) {
            document.dispatchEvent(new CustomEvent("createSpider", {
                detail: ""
            }));
        }

        setTimeout(createSingleSpider, spiderStartTimer);
    }
}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
