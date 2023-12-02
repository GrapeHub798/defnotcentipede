export default class Helpers {
    static uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    static getDistance(xA, yA, xB, yB) {
        const xDiff = xA - xB;
        const yDiff = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
}
