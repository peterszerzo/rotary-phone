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

    setActiveDigit: function() {

        var angle;

        this.activeDigit = -1;

        for (i = 0; i < 10; i += 1) {

            angle = this.oBeta + this.dBeta * i + this.alpha;

            xt = W * this.centroid.xc + minWH * this.r1 * Math.cos(angle);
            yt = H * this.centroid.yc + minWH * this.r1 * Math.sin(angle);

            if (getDistance(RPH.mouse.x, RPH.mouse.y, xt, yt) < minWH * this.r3) {

                this.activeDigit = i;

            }

        }

    },

    drawRing: function() {

        var xc = this.centroid.x,
            yc = this.centroid.y;

        RPH.ctx.fillStyle = "#444444";
        circle(W * xc, H * yc, minWH * this.r0);

        RPH.ctx.fillStyle = "rgb(240,245,240)";
        circle(W * xc, H * yc, minWH * this.r2);

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

        RPH.ctx.font = this.fontString;
        RPH.ctx.fillStyle = "#444444";
        RPH.ctx.fillText(RPH.dialer.number, W * this.text.x, H * this.text.y);

    },

    drawDigits: function() {

        var i, angle;

        RPH.ctx.font = minWH / 18 + "px Courier";

        for (i = 0; i < 10; i += 1) {

            RPH.ctx.fillStyle = (this.activeDigit === i) ? "rgb(180,205,200)" : "rgb(240,245,240)";

            angle = RPH.phone.oBeta + RPH.phone.dBeta * i + RPH.phone.alpha;
            circle(
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

    xc: 0.5,
    yc: 0.55,

    text: {

        x: 0.5,
        y: 0.1,
        isHovered: function() {

            return (RPH.mouse.y / minWH < this.y + 0.02) && (RPH.mouse.y / minWH > this.y - 0.02);

        }

    }

};
