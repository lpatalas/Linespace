var Linespace;
(function (Linespace) {
    var clamp = function (x, min, max) {
        return Math.min(max, Math.max(x, min));
    };
    function rgb(r, g, b) {
        r = clamp(Math.floor(r), 0, 255);
        g = clamp(Math.floor(g), 0, 255);
        b = clamp(Math.floor(b), 0, 255);
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    Linespace.rgb = rgb;
    ;
    function rgbf(r, g, b) {
        return rgb(r * 255, g * 255, b * 255);
    }
    Linespace.rgbf = rgbf;
    ;
    function rgbToHex(input) {
        return rgbf(input.r, input.g, input.b);
    }
    Linespace.rgbToHex = rgbToHex;
    ;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=color.js.map