(function () {
    function B() {
        g = [];
        c = null;
        t = !1;
        n = "ws://localhost:2828";
        n = u[~~(u.length * Math.random())];
        h = new WebSocket(n, "flapmmo.com");
        h.binaryType = "arraybuffer"; - 1 == window.location.href.indexOf("flapmmo.com") && -1 == window.location.href.indexOf("162.243.44.70") && -1 == window.location.href.indexOf("96.126.121.68") && (window.location = "http://flapmmo.com");
        h.onopen = function (a) {
            m = [];
            null != c && (v = c.x);
            t = !0;
            console.log("Socket connected");
            p()
        };
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
                }
                break;
            case 3:
                for (a = new DataView(a), b = 1, f = a.getInt32(b, !0), b += 4, q = 0; q < f; q++) m.push(new D(a.getInt32(b + 0, !0), a.getInt32(b + 4, !0))),
                b += 8
            }
        };
        h.onclose = function () {
            t = !1;
            B()
        }
    }

    function E() {
        y = +new Date;
        var a = 1 + Math.ceil(r.length / 4);
        a > r.length && (a = r.length);
        for (; a--;) g.push(r.shift());
        for (a = 0; a < g.length; a++) g[a].think()
    }

    function F() {
        y = +new Date;
        b.clearRect(0, 0, d.width, d.height);
        var a = null != c ? c.x - 100 : 0;
        e = 0 == e ? a : Math.round((e + a) / 2);
        for (a = -(Math.floor(e / 2) % 288); a < d.width;) b.drawImage(k, 0, 0, 288, 512, a, 0, 288, 512), a += 288;
        b.save();
        b.translate(-e, 0);
        for (a = 0; a < m.length; a++) m[a].draw();
        b.restore();
        for (a = -(Math.floor(e) % 336); a < d.width;) b.drawImage(k,
            584, 0, 336, 111, a, 401, 336, 111), a += 336;
        b.save();
        b.translate(-e, 0);
        for (a = 0; a < g.length; a++) g[a] != c && g[a].draw();
        null != c && c.draw();
        b.restore();
        t ? b.fillText("Score: " + L() + " | Players: " + C + " | Distance: " + (null == c ? 0 : Math.floor(c.x / 200)) + " | Server #" + (u.indexOf(n) + 1), 20, 20) : b.fillText("Connecting to server " + n.slice(5) + "...", 20, 20);
        z.clearRect(0, 0, d.width, d.height);
        z.drawImage(s, 0, 0, d.width, d.height);
        window.requestAnimationFrame(F)
    }

    function G() {
        null != c && (c.vx = H, c.vy = 0, I(), c.reset(), v = c.x)
    }

    function L() {
        if (null ==
            c) return 0;
        for (var a = 0, b = 0; b < m.length; b++) c.x > m[b].x + 30 && ++a;
        return a
    }

    function x(a, b, c) {
        this.id = a;
        this.reset();
        this.seed = 9999 * Math.random();
        this.nick = c;
        this.jumps = b || [];
        this.playbackTime = 0
    }

    function D(a, b) {
        this.x = a;
        this.y = b
    }

    function J(a) {
        var b = g.indexOf(a); - 1 != b && (a.destroy(), g.splice(b, 1))
    }

    function I() {
        if (null != c && 0 != c.jumps.length) {
            var a = new ArrayBuffer(3 + 2 * c.jumps.length),
                b = new DataView(a);
            b.setUint8(0, 2);
            b.setUint16(1, c.jumps.length, !0);
            for (var f = 3, d = 0; d < c.jumps.length; d++) b.setUint16(f, c.jumps[d], !0), f += 2;
            h.send(a);
            c.jumps.length = 0
        }
    }

    function p() {
        var a = l.value,
            b = new ArrayBuffer(32),
            d = new DataView(b);
        d.setUint8(0, 5);
        for (var e = 0; e < a.length && 16 > e; e++) {
            var g = a.charCodeAt(e);
            128 <= g || d.setUint8(e + 1, g)
        }
        null != c && (c.nick = a);
        h.send(b)
    }

    function K(a, b) {
        return a.x + a.r < b.x || a.y + a.r < b.y || a.x - a.r > b.x + b.width || a.y - a.r > b.y + b.height ? !1 : !0
    }
    window.onload = function () {
        l = document.getElementById("nickname");
        l.onchange = p;
        l.onkeydown = p;
        l.onkeyup = p;
        l.onkeypress = p;
        d = document.getElementById("canvas");
        z = d.getContext("2d");
        s = document.createElement("canvas");
        s.width = d.width;
        s.height = d.height;
        b = s.getContext("2d");
        G();
        B();
        E();
        F();
        setInterval(E, 1E3 / 60)
    };
    var d, s, b, z, k = new Image;
    k.src = "atlas.png";
    var e = 0,
        g = [],
        m = [],
        y = 0,
        c = null,
        A = !1,
        w = null,
        C = "?",
        v = 100,
        l, H = 2,
        h, r = [],
        u = "ws://162.243.44.70:2828 ws://162.243.44.70:2829 ws://162.243.44.70:2830 ws://162.243.44.70:2831 ws://162.243.44.70:2832 ws://162.243.44.70:2833 ws://162.243.86.251:2828 ws://162.243.86.251:2829 ws://162.243.86.251:2830 ws://162.243.86.251:2831 ws://162.243.86.251:2832 ws://162.243.86.251:2833".split(" "),
        n = null,
        t = !1;
    x.prototype = {
        id: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        seed: 0,
        wasSeen: !0,
        nick: null,
        jumps: null,
        playbackTime: 0,
        gameOver: !1,
        rotation: 0,
        targetRotation: 0,
        removeTimer: -1,
        reset: function () {
            this.x = 100;
            this.y = 50;
            this.vx = H;
            this.vy = 0;
            this.jumps = [];
            this.playbackTime = 0;
            this.gameOver = !1;
            this.removeTimer = -1
        },
        draw: function () {
            if (!(-100 > this.x - e || 1E3 < this.x - e)) {
                b.save();
                b.translate(2 * Math.floor(this.x / 2), 2 * Math.floor(this.y / 2));
                var a = Math.floor((y + this.seed) / 200) % 2;
                b.rotate(this.rotation);
                this == c ? (b.beginPath(), b.fillStyle =
                    "rgba(255, 255, 255, 0.5)", b.arc(0, 0, 30, 0, 2 * Math.PI, !1), b.fill(), b.drawImage(k, 230, 762 + 52 * a, 34, 24, -17, -12, 34, 24)) : (b.globalAlpha *= 0.5, b.drawImage(k, 6 + 56 * a, 982, 34, 24, -17, -12, 34, 24), b.globalAlpha /= 0.5);
                b.rotate(-this.rotation);
                if (a = this.nick) b.textAlign = "center", b.fillStyle = "#000000", b.fillText(a, 1, -20), b.fillText(a, -1, -20), b.fillText(a, 0, -21), b.fillText(a, 0, -19), b.fillStyle = "#FFFFFF", b.fillText(a, 0, -20);
                b.restore()
            }
        },
        think: function () {
            ++this.playbackTime;
            for (var a = 0; a < m.length; a++)
                if (m[a].collidesWith(this)) {
                    this.gameOver = !0;
                    break
                }
            this.vy += 0.4;
            389 <= this.y && (this.vy = this.vx = 0, this.gameOver = !0, this == c ? I() : null == this.id && J(this));
            this.gameOver ? (this.vx = 0, 389 < this.y && (this.y = 389), this != c && (0 > this.removeTimer && (this.removeTimer = Math.floor(this.x / 10)), this.removeTimer -= 1, 0 == this.removeTimer && J(this))) : this == c ? A && (this.jumps.push(this.playbackTime), A = !1, this.vy = -8) : -1 != this.jumps.indexOf(this.playbackTime) && (this.vy = -8);
            this.x += this.vx;
            this.y += this.vy;
            for (this.targetRotation = Math.atan2(this.vy, this.vx); 180 < this.targetRotation;) this.targetRotation -=
                360;
            for (; - 180 > this.targetRotation;) this.targetRotation += 360;
            this.rotation = (this.rotation + this.targetRotation) / 2
        },
        setPlayback: function (a, b) {
            this != c && this.reset();
            this.jumps = a;
            b && (this.nick = b)
        },
        destroy: function () {}
    };
    D.prototype = {
        x: 0,
        y: 0,
        getHeight: function () {
            return 124
        },
        draw: function () {
            this.isValid() || (b.globalAlpha *= 0.5);
            b.drawImage(k, 112, 646, 52, 320, this.x, this.y - 320, 52, 320);
            b.drawImage(k, 168, 646, 52, 320, this.x, this.y + this.getHeight(), 52, 320);
            this.isValid() || (b.globalAlpha /= 0.5)
        },
        collidesWith: function (a) {
            return this.isValid() ?
                K({
                    x: a.x,
                    y: a.y,
                    r: 12
                }, {
                    x: this.x,
                    y: this.y - 320,
                    width: 52,
                    height: 320
                }) || K({
                    x: a.x,
                    y: a.y,
                    r: 12
                }, {
                    x: this.x,
                    y: this.y + this.getHeight(),
                    width: 52,
                    height: 320
                }) : !1
        },
        isValid: function () {
            return this.x > v + 200
        }
    };
    document.body.onkeydown = function (a) {
        null != c && c.gameOver && 389 <= c.y ? G() : null != c && 0 < c.y && (A = !0)
    };
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (a) {
        setTimeout(a, 1E3 / 60)
    }
})();