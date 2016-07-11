var Linespace;
(function (Linespace) {
    var RandomNumberGenerator = (function () {
        function RandomNumberGenerator(seed) {
            if (seed != null) {
                this.rng = new Math.seedrandom(JSON.stringify(seed));
            }
            else {
                this.rng = new Math.seedrandom();
            }
        }
        RandomNumberGenerator.prototype.float = function () {
            return this.rng.quick();
        };
        RandomNumberGenerator.prototype.floatRange = function (min, max) {
            return min + this.float() * (max - min);
        };
        RandomNumberGenerator.prototype.intRange = function (min, max) {
            return min + (this.rng.int32() % (max - min));
        };
        return RandomNumberGenerator;
    })();
    Linespace.RandomNumberGenerator = RandomNumberGenerator;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=randomNumberGenerator.js.map