var RPH = {};

var W, H, minWH;

RPH.dialer = {

    number: "",

    dial: function() {

        window.location = "tel:" + this.number;

    }

};

RPH.mouseUp = function(e) {

    RPH.mouse.get(e);

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

        RPH.phone.alpha = getAngle(W * xc, H * yc, RPH.mouse.x, RPH.mouse.y) - getAngle(W * xc, H * yc, RPH.mouse.xDrag, RPH.mouse.yDrag);

        // dialing only works forward
        RPH.phone.alpha = (RPH.phone.alpha < 0) ? 0 : RPH.phone.alpha;

        if (RPH.phone.alpha > ((10 - RPH.activeDigit) * RPH.phone.dBeta + RPH.phone.rBeta)) {

            RPH.mouse.isDragging = false;

            if (RPH.dialer.number.length < 12) RPH.dialer.number += digit;
            if (RPH.dialer.number.length === 3 || RPH.dialer.number.length === 7) RPH.dialer.number += '-';

            RPH.phone.activeDigit = -1;

        }

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
