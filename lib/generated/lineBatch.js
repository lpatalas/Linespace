var Linespace;
(function (Linespace) {
    ;
    var lineColorComparer = function (first, second) {
        if (first.color < second.color)
            return -1;
        else if (first.color > second.color)
            return 1;
        else
            return 0;
    };
    var LineBatch = (function () {
        function LineBatch() {
        }
        LineBatch.prototype.clear = function () {
            this.batchedLines = [];
        };
        LineBatch.prototype.add = function (start, end, color) {
            this.batchedLines.push({ start: start, end: end, color: color });
        };
        LineBatch.prototype.draw = function (context) {
            if (this.batchedLines.length == 0)
                return;
            this.batchedLines.sort(lineColorComparer);
            var currentColor = this.batchedLines[0].color;
            context.strokeStyle = currentColor;
            context.beginPath();
            this.batchedLines.forEach(function (line) {
                if (line.color != currentColor) {
                    context.stroke();
                    currentColor = line.color;
                    context.strokeStyle = currentColor;
                    context.beginPath();
                }
                context.moveTo(line.start.x, line.start.y);
                context.lineTo(line.end.x, line.end.y);
            });
            context.stroke();
        };
        return LineBatch;
    })();
    Linespace.LineBatch = LineBatch;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=lineBatch.js.map