/*! RetroPhone v1.0.0 - 2014-08-09 
 *  Copyright: Peter Szerzo, 2014 */

var RPH = {};

var W, H, minWH;

RPH.dialer = {

    number: "",

    dial: function() {

        window.location = "tel:" + this.number;

    }

};

RPH.mouseUp = function(e) {

    RPH.mouse.up(e);

};

RPH.mouseDown = function(e) {

    RPH.mouse.down(e);

    RPH.mouse.isDragging = (RPH.phone.alpha < 0.03 && RPH.phone.activeDigit !== -1);

    if (RPH.phone.text.isHovered()) {

        RPH.dialer.dial();

    }

};

RPH.mouseMove = function(e) {

    var xc = RPH.phone.centroid.x,
        yc = RPH.phone.centroid.y,
        angle, i, xt, yt;

    RPH.mouse.move(e);

    if (RPH.mouse.isDragging) {

        RPH.phone.setDrag();

    } else if (RPH.phone.alpha < 0.03) {

        RPH.phone.setActiveDigit();

    }

    RPH.fontString = (RPH.phone.text.isHovered()) ? "bold " : "";
    RPH.fontString += minWH / 30 + "px Courier";


};

// !main
RPH.draw = function() {

    RPH.pen.clear();

    RPH.ctx.textAlign = "center";
    RPH.ctx.textBaseline = "middle";

    RPH.phone.drawRing();
    RPH.phone.drawLine();
    RPH.phone.drawNumber();
    RPH.phone.drawDigits();

    if (RPH.phone.alpha > 0 && !RPH.mouse.isDragging) RPH.phone.alpha -= 0.02;

    RPH.canvas.addEventListener('mousedown', RPH.mouseDown);
    RPH.canvas.addEventListener('mousemove', RPH.mouseMove);
    RPH.canvas.addEventListener('mouseup', RPH.mouseUp);

};

function touchHandler(event) {

    var touch = event.changedTouches[0],
        simulatedEvent = document.createEvent("MouseEvent");

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

RPH.init = function() {

    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);

    RPH.canvas = document.getElementById("retrophone");
    RPH.ctx = RPH.canvas.getContext("2d");

    this.resizeCanvas();
    return setInterval(RPH.draw, 10);

};

RPH.resizeCanvas = function() {

    RPH.canvas.width = window.innerWidth;
    RPH.canvas.height = window.innerHeight;
    W = RPH.canvas.width;
    H = RPH.canvas.height;
    minWH = Math.min(W, H);

};

RPH.init();

window.addEventListener('resize', RPH.resizeCanvas, false);

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

    },

    draw: function(e) {

        RPH.pen.circle(this.x, this.y, 5);

    }

};

RPH.pen = {

    clear: function() {

        RPH.ctx.clearRect(0, 0, W, H);

    },

    rect: function(x, y, w, h) {

        RPH.ctx.beginPath();
        RPH.ctx.rect(x, y, w, h);
        RPH.ctx.closePath();
        RPH.ctx.fill();

    },

    circle: function(x, y, r) {

        RPH.ctx.beginPath();
        RPH.ctx.arc(x, y, r, 0, Math.PI * 2, true);
        RPH.ctx.fill();

    }

};

RPH.phone = {

    alpha: 0,
    alphaPrev: 0,
    oBeta: Math.PI * 4 / 9,
    dBeta: Math.PI / 7,
    rBeta: Math.PI / 24,

    r0: 0.35,
    r2: 0.23,
    r1: 0.29,
    r3: 0.04,

    fontString: "",

    activeDigit: -1,

    setDrag: function() {

        var xc = this.centroid.x,
            yc = this.centroid.y;

        this.alpha = RPH.math.getAngle(W * xc, H * yc, RPH.mouse.x, RPH.mouse.y) - RPH.math.getAngle(W * xc, H * yc, RPH.mouse.xDrag, RPH.mouse.yDrag);

        // dialing only works forward
        this.alpha = (this.alpha < 0) ? 0 : this.alpha;

        if (this.alpha > ((10 - this.activeDigit) * this.dBeta + this.rBeta)) {

            RPH.mouse.isDragging = false;

            if (RPH.dialer.number.length < 12) RPH.dialer.number += this.activeDigit;
            if (RPH.dialer.number.length === 3 || RPH.dialer.number.length === 7) RPH.dialer.number += '-';

            this.activeDigit = -1;

        }

    },

    setActiveDigit: function() {

        var angle;

        this.activeDigit = -1;

        for (i = 0; i < 10; i += 1) {

            angle = this.oBeta + this.dBeta * i + this.alpha;

            xt = W * this.centroid.x + minWH * this.r1 * Math.cos(angle);
            yt = H * this.centroid.y + minWH * this.r1 * Math.sin(angle);

            if (RPH.math.getDistance(RPH.mouse.x, RPH.mouse.y, xt, yt) < minWH * this.r3) {

                this.activeDigit = i;

            }

        }

    },

    drawRing: function() {

        var xc = this.centroid.x,
            yc = this.centroid.y;

        RPH.ctx.fillStyle = "#444444";
        RPH.pen.circle(W * xc, H * yc, minWH * this.r0);

        RPH.ctx.fillStyle = "rgb(240,245,240)";
        RPH.pen.circle(W * xc, H * yc, minWH * this.r2);

    },

    drawLine: function() {

        var angle = this.oBeta + 10 * this.dBeta + this.rBeta,
            xc = this.centroid.x,
            yc = this.centroid.y;

        RPH.ctx.strokeStyle = "rgb(240,245,240)";

        RPH.ctx.beginPath();
        RPH.ctx.moveTo(W * xc + this.r0 * minWH * Math.cos(angle), H * yc + this.r0 * minWH * Math.sin(angle));
        RPH.ctx.lineTo(W * xc + this.r1 * minWH * Math.cos(angle), H * yc + this.r1 * minWH * Math.sin(angle));
        RPH.ctx.lineWidth = minWH / 150;
        RPH.ctx.stroke();

    },

    drawNumber: function() {

        RPH.ctx.font = minWH / 25 + "px " + this.fontString;
        RPH.ctx.fillStyle = "#444444";
        RPH.ctx.fillText(RPH.dialer.number, W * this.text.x, H * this.text.y);

    },

    drawDigits: function() {

        var i, angle;

        RPH.ctx.font = minWH / 18 + "px Courier";

        for (i = 0; i < 10; i += 1) {

            RPH.ctx.fillStyle = (this.activeDigit === i) ? "rgb(180,205,200)" : "rgb(240,245,240)";

            angle = RPH.phone.oBeta + RPH.phone.dBeta * i + RPH.phone.alpha;
            RPH.pen.circle(
                W * this.centroid.x + minWH * this.r1 * Math.cos(angle),
                H * this.centroid.y + minWH * this.r1 * Math.sin(angle),
                minWH * this.r3
            );

            RPH.ctx.fillStyle = "#444444";
            angle = RPH.phone.oBeta + RPH.phone.dBeta * i;

            RPH.ctx.fillText(
                i,
                W * this.centroid.x + minWH * this.r1 * Math.cos(angle),
                H * this.centroid.y + minWH * this.r1 * Math.sin(angle)
            );

        }

    },

    centroid: {

        x: 0.5,
        y: 0.55

    },

    text: {

        x: 0.5,
        y: 0.1,
        isHovered: function() {

            return (RPH.mouse.y / minWH < this.y + 0.02) && (RPH.mouse.y / minWH > this.y - 0.02);

        }

    }

};

RPH.math = {

    getDistance: function(x1, y1, x2, y2) {

        return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);

    },

    getAngle: function(x1, y1, x2, y2) {

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

};
