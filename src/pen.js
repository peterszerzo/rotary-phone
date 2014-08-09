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

RPH.pen = {

    clear: function() {

        RPH.ctx.clearRect(0, 0, W, H);

    }

};
