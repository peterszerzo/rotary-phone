var RPH = {};

var valid = true;
var fullCircle = 0;
var digit = -1;

var fontString; // font of the string

RPH.dialer = {

    number: "",

    dial: function() {

        window.location = "tel:" + this.number;

    }

};

RPH.mouse = {

    x: 0,
    y: 0,
    xDrag: 0,
    yDrag: 0,
    isDragging: false,

    get: function(e) {

        var rect = RPH.canvas.getBoundingClientRect();
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;

    },

    down: function(e) {

        this.get(e);
        this.xDrag = this.x;
        this.yDrag = this.y;
        this.isDragging = true;

    },

    up: function(e) {

        this.get(e);
        this.isDragging = false;

    },

    move: function(e) {

        this.get(e);

    }

};

var W, H, minWH;

RPH.phone = {

    alpha: 0,
    alphaPrev: 0,
    oBeta: Math.PI * 4 / 9,
    dBeta: Math.PI / 7,
    rBeta: Math.PI / 24,

    r0: 0.35,
    r2: 0.23,
    r1: 0.29,
    r3: 4,
    xc: 0.5,
    yc: 0.55,

    text: {

        x: 0.5,
        y: 0.1,
        isHovered: function() {

            return (RPH.mouse.y / minWH < RPH.phone.text.y + 0.02) && (RPH.mouse.y / minWH > RPH.phone.text.y - 0.02);

        }

    }

};

// !geometric parameters
var alpha = 0,
    alphaPrev = 0; // phone angle
var oBeta = Math.PI * 4 / 9,
    dBeta = Math.PI / 7,
    rBeta = Math.PI / 24;
var r0 = 0.35,
    r2 = 0.23,
    r1 = (r0 + r2) / 2,
    r3 = (r0 - r2) / 3;
var xc = 0.5,
    yc = 0.55,
    xText = 0.5,
    yText = 0.1; //centroid of shape

// !drawing

function circle(x, y, r) {

    RPH.ctx.beginPath();
    RPH.ctx.arc(x, y, r, 0, Math.PI * 2, true);
    RPH.ctx.fill();

}

function rect(x, y, w, h) {

    RPH.ctx.beginPath();
    RPH.ctx.rect(x, y, w, h);
    RPH.ctx.closePath();
    RPH.ctx.fill();

}

function clear() {

    RPH.ctx.clearRect(0, 0, W, H);

}

// !geometry calc

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

// !mouse event functions

RPH.mouseUp = function(e) {

    RPH.mouse.up();

}

RPH.mouseDown = function(e) {

    RPH.mouse.down(e);

    RPH.mouse.isDragging = (alpha < 0.03 && digit != -1);

    // check if call link is clicked
    if (RPH.phone.text.isHovered()) {
        RPH.dialer.dial();
    }

}

RPH.mouseMove = function(e) {

    RPH.mouse.move(e);

    if (RPH.mouse.isDragging) {

        alpha = getAngle(W * xc, H * yc, RPH.mouse.x, RPH.mouse.y) - getAngle(W * xc, H * yc, RPH.mouse.xDrag, RPH.mouse.yDrag);

        alpha = (alpha < 0) ? 0 : alpha;

        if (alpha > ((10 - digit) * dBeta + rBeta)) {

            RPH.mouse.isDragging = false;

            if (RPH.dialer.number.length < 12) RPH.dialer.number += digit;
            if (RPH.dialer.number.length === 3 || RPH.dialer.number.length === 7) RPH.dialer.number += '-';

            digit = -1;

        }

    }

    if (alpha < 0.03) {

        var digitTemp = -1;

        for (var i = 0; i < 10; i += 1) {

            angle = oBeta + dBeta * i + alpha;
            var xt = W * xc + minWH * r1 * Math.cos(angle);
            var yt = H * yc + minWH * r1 * Math.sin(angle);

            if (getDistance(RPH.mouse.x, RPH.mouse.y, xt, yt) < minWH * r3) {

                digitTemp = i;

            }

        }

        digit = digitTemp;

    }

    fontString = (RPH.phone.text.isHovered()) ? "bold " : "";
    fontString += minWH / 30 + "px Courier";


}

RPH.mouseUp = function(e) {

    RPH.mouse.up(e);

}

// !main

function draw() {

    var angle, xt, yt, xc1, yc1, i;

    clear();

    RPH.ctx.textAlign = "center";
    RPH.ctx.textBaseline = "middle";

    RPH.ctx.fillStyle = "#444444";
    circle(W * xc, H * yc, minWH * r0);

    RPH.ctx.fillStyle = "rgb(240,245,240)";
    circle(W * xc, H * yc, minWH * r2);

    RPH.ctx.strokeStyle = "rgb(240,245,240)";


    angle = oBeta + 10 * dBeta + rBeta;

    RPH.ctx.beginPath();
    RPH.ctx.moveTo(W * xc + r0 * minWH * Math.cos(angle), H * yc + r0 * minWH * Math.sin(angle));
    RPH.ctx.lineTo(W * xc + r1 * minWH * Math.cos(angle), H * yc + r1 * minWH * Math.sin(angle));
    RPH.ctx.lineWidth = minWH / 150;
    RPH.ctx.stroke();

    RPH.ctx.lineWidth = 0;


    if (alpha > 0 && !RPH.mouse.isDragging) alpha -= 0.02;


    RPH.ctx.font = fontString;
    RPH.ctx.fillStyle = "#444444";

    RPH.ctx.fillText(RPH.dialer.number, W * xText, H * yText);

    RPH.ctx.font = minWH / 18 + "px Courier";

    for (i = 0; i < 10; i += 1) {
        if (digit === i) RPH.ctx.fillStyle = "rgb(180,205,200)";
        else RPH.ctx.fillStyle = "rgb(240,245,240)";

        angle = oBeta + dBeta * i + alpha;
        xc1 = W * xc + minWH * r1 * Math.cos(angle);
        yc1 = H * yc + minWH * r1 * Math.sin(angle);
        circle(xc1, yc1, minWH * r3);

        RPH.ctx.fillStyle = "#444444";
        angle = oBeta + dBeta * i;

        xt = W * xc + minWH * r1 * Math.cos(angle);
        yt = H * yc + minWH * r1 * Math.sin(angle);
        RPH.ctx.fillText(i, xt, yt);
    }

    RPH.canvas.addEventListener('mousedown', RPH.mouseDown);
    RPH.canvas.addEventListener('mousemove', RPH.mouseMove);
    RPH.canvas.addEventListener('mouseup', RPH.mouseUp);

}

function touchHandler(event) {
    var touch = event.changedTouches[0];
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent({
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup"
        }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() {

    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);

    RPH.canvas = document.getElementById("retrophone");
    RPH.ctx = RPH.canvas.getContext("2d");

    resizeCanvas();

    return setInterval(draw, 10);
}

function resizeCanvas() {
    RPH.canvas.width = window.innerWidth;
    RPH.canvas.height = window.innerHeight;
    W = RPH.canvas.width;
    H = RPH.canvas.height;
    minWH = Math.min(W, H);

}

init();

window.addEventListener('resize', resizeCanvas, false);
