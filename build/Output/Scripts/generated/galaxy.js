var Linespace;
(function (Linespace) {
    var TWO_PI = Math.PI * 2;
    var lerp = function (a, b, t) {
        return a + (b - a) * t;
    };
    var calculateStarColor = function (rng, distance) {
        var x = Math.pow(rng.float(), 5);
        var y = Math.pow(rng.float(), 8);
        var df = Math.pow(1 - distance, 1.1);
        var r = 0.7 + 0.3 * lerp(x, 1, df);
        var g = 0.7 + 0.3 * Math.min(lerp(y, 1, df), r);
        var b = lerp(1 - x, 0.7, df);
        return { r: r, g: g, b: b };
    };
    var generateStars = function (params) {
        var rng = new Linespace.RandomNumberGenerator(JSON.stringify(params));
        var angleDelta = TWO_PI / params.starCount;
        var SIZE_MIN = 1;
        var sizeDelta = (params.size - SIZE_MIN) / params.starCount;
        var size = SIZE_MIN;
        var result = [];
        for (var a = 0; a < TWO_PI; a += angleDelta) {
            var w = Math.max(1, Math.pow(size, rng.floatRange(0.95, 1.05)));
            var h = size * params.sizeRatio;
            var t = rng.floatRange(0, TWO_PI);
            result.push({
                initialRotation: t,
                longerRadius: w,
                shorterRadius: h,
                orbitRotation: a,
                color: calculateStarColor(rng, size / params.size)
            });
            size += sizeDelta;
        }
        return result;
    };
    var Galaxy = (function () {
        function Galaxy(parameters) {
            this.pixelBatch = new Linespace.PixelBatch();
            this.params = parameters;
            this.rngSeed = JSON.stringify(this.params);
            this.stars = generateStars(parameters);
            this.pixelBatch.pixelSize = 2;
        }
        Object.defineProperty(Galaxy.prototype, "rotationSpeed", {
            get: function () {
                return this.params.rotationSpeed;
            },
            enumerable: true,
            configurable: true
        });
        Galaxy.prototype.draw = function (context, time) {
            var _this = this;
            var rng = new Linespace.RandomNumberGenerator(this.rngSeed);
            this.pixelBatch.clear();
            this.stars.forEach(function (star) {
                var pos = _this.calculateStarPosition(star, time);
                _this.pixelBatch.add(pos.x, pos.y, Linespace.rgbToHex(star.color));
            });
            this.pixelBatch.draw(context);
        };
        Galaxy.prototype.getStars = function () {
            return this.stars;
        };
        Galaxy.prototype.getStarPositions = function () {
            var _this = this;
            return this.stars.map(function (star) { return _this.calculateStarPosition(star, 0); });
        };
        Galaxy.prototype.calculateStarPosition = function (star, time) {
            var r = star.initialRotation + time * this.params.rotationSpeed;
            var x = Math.sin(r) * star.longerRadius;
            var y = Math.cos(r) * star.shorterRadius;
            var or = star.orbitRotation;
            var xx = this.params.center.x + x * Math.cos(or) - y * Math.sin(or);
            var yy = this.params.center.y + x * Math.sin(or) + y * Math.cos(or);
            return Linespace.vec(xx, yy);
        };
        return Galaxy;
    })();
    Linespace.Galaxy = Galaxy;
    ;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=galaxy.js.map