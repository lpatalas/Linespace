var Linespace;
(function (Linespace) {
    var PixelBatch = (function () {
        function PixelBatch() {
            this._pixelSize = 1;
        }
        Object.defineProperty(PixelBatch.prototype, "pixelSize", {
            get: function () {
                return this._pixelSize;
            },
            set: function (size) {
                this._pixelSize = size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PixelBatch.prototype, "count", {
            get: function () {
                return this.buffer.length;
            },
            enumerable: true,
            configurable: true
        });
        PixelBatch.prototype.clear = function () {
            this.buffer = [];
        };
        PixelBatch.prototype.add = function (x, y, color) {
            this.buffer.push({ x: x, y: y, color: color });
        };
        PixelBatch.prototype.draw = function (context) {
            var _this = this;
            var currentColor = null;
            var hs = this.pixelSize / 2;
            this.buffer.forEach(function (pixel) {
                context.fillStyle = pixel.color;
                context.fillRect(pixel.x - hs, pixel.y - hs, _this.pixelSize, _this.pixelSize);
            });
        };
        return PixelBatch;
    })();
    Linespace.PixelBatch = PixelBatch;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=pixelBatch.js.map