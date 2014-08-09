function getDistance(x1, y1, x2, y2) {

    return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);

}

function getAngle(x1, y1, x2, y2) {

    var angle;

    if (Math.abs(x1 - x2) < W / 100 && y2 > y1) return 1 * Math.PI / 2;
    if (Math.abs(x1 - x2) < W / 100 && y2 < y1) return 3 * Math.PI / 2;

    angle = Math.atan((y2 - y1) / (x2 - x1));

    if (x1 < x2) {

        if (angle < 0) return angle + 2 * Math.PI;
        return angle;

    }

    return angle + Math.PI;

}
