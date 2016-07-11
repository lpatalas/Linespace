var Linespace;
(function (Linespace) {
    var options = {
        minSize: 100,
        maxSize: 1000,
        minScreenSize: 100,
        maxOpacity: 0.8,
        incrementSize: function (size) { return size * 2; }
    };
    var roundTo = function (x, rounding) {
        return Math.floor(x / rounding) * rounding;
    };
    var computeMinVisibleSize = function (scale) {
        var minVisibleSize = options.minSize;
        var screenSize = minVisibleSize * scale;
        while (minVisibleSize < options.maxSize && screenSize < options.minScreenSize) {
            minVisibleSize *= 2;
            screenSize *= 2;
        }
        return minVisibleSize;
    };
    var computeOpacity = function (gridSize, scale) {
        var screenSize = gridSize * scale;
        var minScreenSize = options.minScreenSize;
        var maxScreenSize = minScreenSize * 2;
        var opacity = (screenSize - minScreenSize) / (maxScreenSize - minScreenSize);
        return opacity * options.maxOpacity;
    };
    function drawGrid(context, position, scale) {
        var canvas = context.canvas;
        var gridSize = computeMinVisibleSize(scale);
        while (gridSize < options.maxSize) {
            var opacity = computeOpacity(gridSize, scale);
            var topLeftX = position.x - (canvas.width / 2) / scale;
            var topLeftY = position.y - (canvas.height / 2) / scale;
            var gridOffsetX = (topLeftX % gridSize) * scale;
            var gridOffsetY = (topLeftY % gridSize) * scale;
            var screenGridSize = gridSize * scale;
            context.setLineDash([10, 10]);
            context.strokeStyle = Linespace.rgb(opacity * 255, opacity * 255, opacity * 255);
            context.beginPath();
            for (var y = -gridOffsetY; y < canvas.height; y += screenGridSize) {
                context.moveTo(-gridOffsetX - screenGridSize, y);
                context.lineTo(canvas.width + screenGridSize - gridOffsetX, y);
            }
            for (var x = -gridOffsetX; x < canvas.width; x += screenGridSize) {
                context.moveTo(x, -gridOffsetY - screenGridSize);
                context.lineTo(x, canvas.height + screenGridSize - gridOffsetY);
            }
            context.stroke();
            gridSize *= 2;
        }
        context.setLineDash([]);
    }
    Linespace.drawGrid = drawGrid;
    ;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=grid.js.map