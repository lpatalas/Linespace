var Linespace;
(function (Linespace) {
    var color = '#40a040';
    var fontSize = 20;
    var font = fontSize + "px Consolas";
    var DebugDisplay = (function () {
        function DebugDisplay() {
        }
        DebugDisplay.prototype.reset = function () {
            this.debugLines = [];
        };
        DebugDisplay.prototype.addText = function (text) {
            this.debugLines.push(text);
        };
        DebugDisplay.prototype.addJson = function (obj) {
            this.addText(JSON.stringify(obj));
        };
        DebugDisplay.prototype.draw = function (pos, context) {
            context.setTransform(1, 0, 0, 1, pos.x, pos.y + fontSize);
            context.font = font;
            context.fillStyle = color;
            this.debugLines.forEach(function (line, index) {
                context.fillText(line, 0, index * fontSize);
            });
        };
        return DebugDisplay;
    })();
    Linespace.DebugDisplay = DebugDisplay;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=debugDisplay.js.map