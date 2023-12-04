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

export const CENTIPEDE_SPEEDS = new Map();
CENTIPEDE_SPEEDS.set(1, 1);
CENTIPEDE_SPEEDS.set(2, 1);
CENTIPEDE_SPEEDS.set(3, 1.5);
CENTIPEDE_SPEEDS.set(4, 1.5);
CENTIPEDE_SPEEDS.set(5, 2);

export const CENTIPEDE_COLORS = new Map();
CENTIPEDE_COLORS.set(1, "#34eb37");
CENTIPEDE_COLORS.set(2, "#eb9334");
CENTIPEDE_COLORS.set(3, "#343aeb");
CENTIPEDE_COLORS.set(4, "#d934eb");
CENTIPEDE_COLORS.set(5, "#ffff00");

export const MUSHROOM_COLORS = new Map();
MUSHROOM_COLORS.set(1, "#ff0000");
MUSHROOM_COLORS.set(2, "#0035ff");
MUSHROOM_COLORS.set(3, "#ffe000");
MUSHROOM_COLORS.set(4, "#0eff00");
MUSHROOM_COLORS.set(5, "#00fbbc");


export const CENTIPEDE_LEVEL_COUNT = new Map();
CENTIPEDE_LEVEL_COUNT.set(1, 1);
CENTIPEDE_LEVEL_COUNT.set(2, 1);
CENTIPEDE_LEVEL_COUNT.set(3, 2);
CENTIPEDE_LEVEL_COUNT.set(4, 2);
CENTIPEDE_LEVEL_COUNT.set(5, 3);

export const MUSHROOM_LEVEL_COUNT = new Map();
MUSHROOM_LEVEL_COUNT.set(1, 20);
MUSHROOM_LEVEL_COUNT.set(2, 22);
MUSHROOM_LEVEL_COUNT.set(3, 25);
MUSHROOM_LEVEL_COUNT.set(4, 27);
MUSHROOM_LEVEL_COUNT.set(5, 30);

export const SPIDER_LEVEL_COUNT = new Map();
SPIDER_LEVEL_COUNT.set(1, 1);
SPIDER_LEVEL_COUNT.set(2, 2);
SPIDER_LEVEL_COUNT.set(3, 2);
SPIDER_LEVEL_COUNT.set(4, 3);
SPIDER_LEVEL_COUNT.set(5, 4);

