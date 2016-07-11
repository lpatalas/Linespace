var Linespace;
(function (Linespace) {
    function vec(x, y) {
        return { x: x, y: y };
    }
    Linespace.vec = vec;
    function vcopy(v) {
        return { x: v.x, y: v.y };
    }
    Linespace.vcopy = vcopy;
    function vadd(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    Linespace.vadd = vadd;
    function vsub(a, b) {
        return vec(a.x - b.x, a.y - b.y);
    }
    Linespace.vsub = vsub;
    function vmul(a, b) {
        return { x: a.x * b.x, y: a.y * b.y };
    }
    Linespace.vmul = vmul;
    function vsqrt(v) {
        return { x: Math.sqrt(v.x), y: Math.sqrt(v.y) };
    }
    Linespace.vsqrt = vsqrt;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=vec2D.js.map