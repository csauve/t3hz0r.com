(function () {
    function C() {
        g = [];
        n = [];
        u = {};
        c = null;
        v = !1;
        l = new WebSocket(r);
        l.binaryType = "arraybuffer";
        l.onopen = function (a) {
            v = !0;
            console.log("Socket connected")
        };
        l.onmessage = function (a) {
            a = a.data;
            switch ((new DataView(a)).getUint8(0)) {
            case 0:
                D = (new DataView(a)).getInt32(1, !0);
                break;
            case 1:
                a = new DataView(a);
                for (var f = 0; f < g.length; f++) g[f].wasSeen = !1;
                E = a.getInt32(1, !0);
                for (var b = a.getInt32(5, !0), e = 9, f = 0; f < b; f++) {
                    for (var d = a.getInt32(e + 0, !0), l = a.getInt32(e + 4, !0), m = a.getInt32(e + 8, !0), e = e + 12, h = "";;) {
                        var k = a.getUint8(e++);
                        if (0 == k) break;
                        h += String.fromCharCode(k)
                    }
                    k = u[d];
                    null == k ? (k = new F(d, l, m, h), g.push(k), u[d] = k, k.id == D && null == c && (c = k, null != w && (c.x = w, c.y = y))) : (k.wasSeen = !0, k.update(l, m, h))
                }
                for (f = 0; f < g.length; f++) null == g[f].id || g[f].wasSeen || (delete u[g[f].id], g[f].destroy(), g.splice(f, 1), --f);
                b = a.getInt32(e, !0);
                e += 4;
                for (f = 0; f < b; f++) n.push(new G(a.getInt32(e + 0, !0), a.getInt32(e + 4, !0))), e += 8
            }
        };
        l.onclose = function () {
            v = !1;
            C()
        }
    }

    function H() {
        p = +new Date;
        for (var a = 0; a < g.length; a++) g[a].think()
    }

    function I() {
        p = +new Date;
        b.clearRect(0,
            0, d.width, d.height);
        var a = null != c ? c.x - 100 : 0;
        m = 0 == m ? a : Math.round((m + a) / 2);
        for (a = -(Math.floor(m / 2) % 288); a < d.width;) b.drawImage(h, 0, 0, 288, 512, a, 0, 288, 512), a += 288;
        b.save();
        b.translate(-m, 0);
        for (a = 0; a < n.length; a++) n[a].draw();
        b.restore();
        for (a = -(Math.floor(m) % 336); a < d.width;) b.drawImage(h, 584, 0, 336, 111, a, 401, 336, 111), a += 336;
        b.save();
        b.translate(-m, 0);
        for (a = 0; a < g.length; a++) g[a] != c && g[a].draw();
        null != c && c.draw();
        b.restore();
        v ? b.fillText("Score: " + M() + " | Players: " + E + " | Distance: " + (null == c ? 0 : Math.floor(c.x /
            200)) + " | Server: " + r.slice(5), 20, 20) : b.fillText("Connecting to server " + r.slice(5) + "...", 20, 20);
        z.clearRect(0, 0, d.width, d.height);
        z.drawImage(s, 0, 0, d.width, d.height);
        window.requestAnimationFrame(I)
    }

    function M() {
        if (null == c) return 0;
        for (var a = 0, b = 0; b < n.length; b++) n[b].x < A || c.x > n[b].x + 30 && ++a;
        return a
    }

    function F(a, b, c, e) {
        this.id = a;
        this.x = b;
        this.y = c;
        this.vx = J;
        this.vy = 0;
        this.seed = 9999 * Math.random();
        this.sx = b;
        this.sy = c;
        this.fx = b;
        this.fy = c;
        this.nick = e
    }

    function G(a, b) {
        this.x = a;
        this.y = b
    }

    function N() {
        if (null !=
            c && (~~c.x != w || ~~c.y != y)) {
            var a = new ArrayBuffer(9),
                b = new DataView(a);
            b.setUint8(0, 1);
            b.setInt32(1, ~~c.x, !0);
            b.setInt32(5, ~~c.y, !0);
            l.send(a);
            w = c.x;
            y = c.y
        }
    }

    function x() {
        var a = q.value,
            b = new ArrayBuffer(32),
            c = new DataView(b);
        c.setUint8(0, 5);
        for (var e = 0; e < a.length && 16 > e; e++) {
            var d = a.charCodeAt(e);
            128 <= d || c.setUint8(e + 1, d)
        }
        l.send(b)
    }

    function K(a, b) {
        return a.x + a.r < b.x || a.y + a.r < b.y || a.x - a.r > b.x + b.width || a.y - a.r > b.y + b.height ? !1 : !0
    }
    window.onload = function () {
        q = document.getElementById("nickname");
        q.onchange = x;
        q.onkeydown = x;
        q.onkeyup = x;
        q.onkeypress = x;
        d = document.getElementById("canvas");
        z = d.getContext("2d");
        s = document.createElement("canvas");
        s.width = d.width;
        s.height = d.height;
        b = s.getContext("2d");
        r = "ws://localhost:2828";
        r = L[~~(L.length * Math.random())];
        C();
        H();
        I();
        setInterval(H, 1E3 / 60);
        setInterval(N, 50)
    };
    var d, s, b, z, h = new Image;
    h.src = "atlas.png";
    var m = 0,
        g = [],
        u = {}, n = [],
        p = 0,
        c = null,
        B = !1,
        D = null,
        t = !1,
        E = "?",
        A = 100,
        q, w = null,
        y = null,
        J = 2,
        l, L = "ws://69.164.192.211:2828 ws://69.164.192.211:2829 ws://69.164.192.211:2830 ws://96.126.121.68:2828 ws://96.126.121.68:2829 ws://96.126.121.68:2830 ws://198.58.104.108:2828 ws://198.58.104.108:2829 ws://198.58.104.108:2830 ws://198.58.122.72:2828 ws://198.58.122.72:2829 ws://198.58.122.72:2830".split(" "),
        r = null,
        v = !1;
    F.prototype = {
        id: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        seed: 0,
        wasSeen: !0,
        nick: null,
        rotation: 0,
        targetRotation: 0,
        sx: 0,
        sy: 0,
        fx: 0,
        fy: 0,
        start: 0,
        end: 0,
        draw: function () {
            b.save();
            b.translate(2 * Math.floor(this.x / 2), 2 * Math.floor(this.y / 2));
            var a = Math.floor((p + this.seed) / 200) % 2;
            b.rotate(this.rotation);
            this == c ? (b.beginPath(), b.fillStyle = "rgba(255, 255, 255, 0.5)", b.arc(0, 0, 30, 0, 2 * Math.PI, !1), b.fill(), b.drawImage(h, 230, 762 + 52 * a, 34, 24, -17, -12, 34, 24)) : (b.globalAlpha *= 0.5, b.drawImage(h, 6 + 56 * a, 982, 34, 24, -17, -12, 34, 24), b.globalAlpha /=
                0.5);
            b.rotate(-this.rotation);
            if (a = this.nick) b.textAlign = "center", b.fillStyle = "#000000", b.fillText(a, 1, -20), b.fillText(a, -1, -20), b.fillText(a, 0, -21), b.fillText(a, 0, -19), b.fillStyle = "#FFFFFF", b.fillText(a, 0, -20);
            b.restore()
        },
        think: function () {
            if (this == c) {
                for (var a = 0; a < n.length; a++)
                    if (n[a].collidesWith(this)) {
                        t = !0;
                        break
                    }
                this.vy += 0.4;
                389 <= this.y && (this.vy = this.vx = 0, t = !0);
                t ? (this.vx = 0, 389 < this.y && (this.y = 389)) : B && (B = !1, this.vy = -8);
                this.x += this.vx;
                this.y += this.vy;
                this.targetRotation = Math.atan2(this.vy,
                    this.vx)
            } else a = (p - this.start) / (this.end - this.start), 1 < a && (a = 1), this.x = this.sx + (this.fx - this.sx) * a, this.y = this.sy + (this.fy - this.sy) * a, this.targetRotation = Math.atan2(this.fy - this.sy, this.fx - this.sx);
            for (; 180 < this.targetRotation;) this.targetRotation -= 360;
            for (; - 180 > this.targetRotation;) this.targetRotation += 360;
            this.rotation = (this.rotation + this.targetRotation) / 2
        },
        update: function (a, b, d) {
            this != c && (this.sx = this.x, this.sy = this.y, this.fx = a, this.fy = b, this.start = p, this.end = p + 200);
            d && (this.nick = d)
        },
        destroy: function () {}
    };
    G.prototype = {
        x: 0,
        y: 0,
        getHeight: function () {
            return 124
        },
        draw: function () {
            this.isValid() || (b.globalAlpha *= 0.5);
            b.drawImage(h, 112, 646, 52, 320, this.x, this.y - 320, 52, 320);
            b.drawImage(h, 168, 646, 52, 320, this.x, this.y + this.getHeight(), 52, 320);
            this.isValid() || (b.globalAlpha /= 0.5)
        },
        collidesWith: function (a) {
            return this.isValid() ? K({
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
            return this.x > A + 200
        }
    };
    document.body.onkeydown = function (a) {
        t && (null == c || 389 <= c.y) ? null != c && (c.vx = J, c.vy = 0, c.x = 100, c.y = 50, A = c.x, t = !1) : null != c && 0 < c.y && (B = !0)
    };
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (a) {
        setTimeout(a, 1E3 / 60)
    }
})();