var Linespace;
(function (Linespace) {
    var Camera = (function () {
        function Camera() {
        }
        Camera.prototype.moveBy = function (offset) {
            Linespace.vaddM(this.position, offset);
        };
        return Camera;
    })();
    Linespace.Camera = Camera;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=camera.js.map