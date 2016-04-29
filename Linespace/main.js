var Linespace;
(function (Linespace) {
    var vadd = function (a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    };
    var vmul = function (a, b) {
        return { x: a.x * b.x, y: a.y * b.y };
    };
    var vsqrt = function (v) {
        return { x: Math.sqrt(v.x), y: Math.sqrt(v.y) };
    };
    var TWO_PI = Math.PI * 2;
    var rgb = function (r, g, b) {
        r = Math.floor(r);
        g = Math.floor(g);
        b = Math.floor(b);
        return "rgb(" + r + ", " + g + ", " + b + ")";
    };
    function runGame(canvas) {
        var context = canvas.getContext('2d');
        var getCenter = function () {
            return { x: canvas.width / 2, y: canvas.height / 2 };
        };
        var getSize = function () {
            return { x: canvas.width, y: canvas.height };
        };
        var fitCanvasToWindow = function () {
            if (canvas.width != window.innerHeight) {
                canvas.width = window.innerWidth;
            }
            if (canvas.height != window.innerHeight) {
                canvas.height = window.innerHeight;
            }
        };
        var clearCanvas = function () {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, canvas.width, canvas.height);
        };
        var drawPixel = function (position, color) {
            context.fillStyle = color;
            context.fillRect(position.x, position.y, 1, 1);
        };
        var drawCircle = function (position, radius, color) {
            context.strokeStyle = color;
            context.beginPath();
            context.arc(position.x, position.y, radius, 0, TWO_PI);
            context.stroke();
        };
        var fillCircle = function (position, radius, color) {
            context.fillStyle = color;
            context.beginPath();
            context.arc(position.x, position.y, radius, 0, TWO_PI);
            context.fill();
        };
        var drawEllipse = function (center, radius, color) {
            context.strokeStyle = color;
            context.beginPath();
            context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, TWO_PI);
            context.stroke();
        };
        var fillEllipse = function (center, radius, number, color) {
            context.strokeStyle = color;
            context.beginPath();
            context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, TWO_PI);
            context.fill();
        };
        var planets = [
            { color: '#804000', radius: 10, speed: 0.7, orbit: { radius: { x: 120, y: 100 }, orientation: 100 } },
            { color: '#804080', radius: 10, speed: 0.4, orbit: { radius: { x: 220, y: 200 }, orientation: 100 } },
            { color: '#3040F0', radius: 20, speed: 0.2, orbit: { radius: { x: 500, y: 450 }, orientation: 100 } }
        ];
        var drawPlanet = function (time, planet) {
            var a = planet.orbit.radius.x;
            var b = planet.orbit.radius.y;
            var c = Math.sqrt(a * a - b * b);
            drawEllipse(vadd(getCenter(), { x: c, y: 0 }), planet.orbit.radius, 'white');
            var offset = {
                x: Math.sin(planet.speed * time) * planet.orbit.radius.x + c,
                y: Math.cos(planet.speed * time) * planet.orbit.radius.y
            };
            fillCircle(vadd(getCenter(), offset), planet.radius, planet.color);
        };
        var repeat = function (times, callback) {
            while (times-- > 0) {
                callback();
            }
        };
        var generate = function (count, generator) {
            var result = [];
            for (var i = 0; i < count; i++) {
                result.push(generator(i));
            }
            return result;
        };
        var stars = generate(1000, function () {
            var intensity = 100 + Math.random() * 155;
            return {
                position: {
                    x: Math.random(),
                    y: Math.random()
                },
                color: rgb(intensity, intensity, intensity)
            };
        });
        var drawStars = function () {
            stars.forEach(function (star) { return drawPixel(vmul(star.position, getSize()), star.color); });
        };
        var drawObjects = function (time) {
            drawStars();
            fillCircle(getCenter(), 30, '#ff8000');
            planets.forEach(function (planet) { return drawPlanet(time, planet); });
        };
        var update = function (dt, time) {
            fitCanvasToWindow();
            clearCanvas();
            drawObjects(time);
        };
        var runMainLoop = function () {
            var getCurrentTime = function () { return new Date().getTime() / 1000; };
            var lastTime = getCurrentTime();
            setInterval(function () {
                var currentTime = getCurrentTime();
                update(currentTime - lastTime, currentTime);
                lastTime = currentTime;
            }, 33);
        };
        runMainLoop();
    }
    Linespace.runGame = runGame;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=main.js.map