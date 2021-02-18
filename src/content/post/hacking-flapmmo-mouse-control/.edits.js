mycounter = 0;
mybrake = true;

setInterval(function() {
    mycounter += 0.08;
}, 10);

d.addEventListener("mousemove", function(evt) {
    var rect = d.getBoundingClientRect();
    mymousex = evt.clientX - rect.left,
    mymousey = evt.clientY - rect.top
});

d.addEventListener("mousedown", function(evt) {
    mybrake = !mybrake;
});

this.__proto__.think = function () {
    if (this == c) {

        this.vy = 0;
        this.vx = 0;

        if (!mybrake) {
            this.x += (mymousex - 381) * 0.1;
            this.y += (mymousey - 257) * 0.1;
        }

        this.targetRotation = Math.atan2(this.vy,
            this.vx)
    } else a = (p - this.start) / (this.end - this.start), 1 < a && (a = 1), this.x = this.sx + (this.fx - this.sx) * a, this.y = this.sy + (this.fy - this.sy) * a, this.targetRotation = Math.atan2(this.fy - this.sy, this.fx - this.sx);
    for (; 180 < this.targetRotation;) this.targetRotation -= 360;
    for (; - 180 > this.targetRotation;) this.targetRotation += 360;
    this.rotation = (this.rotation + this.targetRotation) / 2
}


//-------------------------------------------


mycounter = 0;
mybrake = true;

setInterval(function() {
    mycounter += 0.08;
}, 10);

d.addEventListener("mousemove", function(evt) {
    var rect = d.getBoundingClientRect();
    mymousex = evt.clientX - rect.left,
    mymousey = evt.clientY - rect.top
});

d.addEventListener("mousedown", function(evt) {
    mybrake = !mybrake;
});

this.__proto__.think = function () {
    ++this.playbackTime;

    this.vy = 0.0;
    this.vx = 0.0;

    this.jumps.push(this.playbackTime);

    389 <= this.y && (this.vy = this.vx = 0, this.gameOver = !0, this == c ? I() : null == this.id && J(this));
    this.gameOver ? (this.vx = 0, 389 < this.y && (this.y = 389), this != c && (0 > this.removeTimer && (this.removeTimer = Math.floor(this.x / 10)), this.removeTimer -= 1, 0 == this.removeTimer && J(this))) : this == c ? A && (this.jumps.push(this.playbackTime), A = !1, this.vy = -8) : -1 != this.jumps.indexOf(this.playbackTime) && (this.vy = -8);
    this.x += this.vx;
    this.y += this.vy;
    for (this.targetRotation = Math.atan2(this.vy, this.vx); 180 < this.targetRotation;) this.targetRotation -=
        360;
    for (; - 180 > this.targetRotation;) this.targetRotation += 360;
    this.rotation = (this.rotation + this.targetRotation) / 2
}


//-------------------------------------


h.onmessage = function (a) {
    a = a.data;

    switch ((new DataView(a)).getUint8(0)) {
    case 0:
        w =
            (new DataView(a)).getInt32(1, !0);
        c = new x(w, [], "");
        g.push(c);
        break;
    case 2:
        a = new DataView(a);
        C = a.getUint32(1, !0);
        for (var b = a.getInt32(5, !0), f = 9, q = 0; q < b; q++) {
            for (var d = a.getInt32(f, !0), f = f + 4, e = "";;) {
                var h = a.getUint8(f++);
                if (0 == h) break;
                e += String.fromCharCode(h)
            }
            for (var h = [], k = a.getUint16(f, !0), f = f + 2, l = 0; l < k; l++) h.push(a.getUint16(f, !0)), f += 2;
            d != w && (d = new x(d, h, e), r.push(d))

            var request = new XMLHttpRequest();
            request.open("POST", "http://localhost:3000");
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request.send(JSON.stringify(d));
        }
        break;
    case 3:
        for (a = new DataView(a), b = 1, f = a.getInt32(b, !0), b += 4, q = 0; q < f; q++) m.push(new D(a.getInt32(b + 0, !0), a.getInt32(b + 4, !0))),
        b += 8
    }
};
