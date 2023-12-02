export const OBJECT_TYPES = Object.freeze({
    MUSHROOM: "mushroom"
});

export const DIRECTIONS = Object.freeze({
    LEFT: "left",
    RIGHT: "right",
    DOWN: "down",
    UP: "up"
})

export const SHIPID = "ship"

export const CENTIPEDE_TYPES = Object.freeze({
    HEAD: "head",
    TAIL: "tail"
})

export const SEGMENT_TYPES = Object.freeze({
    PARENT: "parent",
    CHILD: "child"
})

//    // .01, .02, .04, .06, .08
export const CENTIPEDE_SPEEDS = new Map();
CENTIPEDE_SPEEDS.set(1, .09);
CENTIPEDE_SPEEDS.set(1.5, .13);
CENTIPEDE_SPEEDS.set(2, .16);
CENTIPEDE_SPEEDS.set(2.5, .19);
CENTIPEDE_SPEEDS.set(3, .22);
