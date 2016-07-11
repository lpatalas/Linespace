var Linespace;
(function (Linespace) {
    var GLUtils;
    (function (GLUtils) {
        var createShader = function (gl, source, shaderType) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var infoLog = gl.getShaderInfoLog(shader);
                throw "Can't compile shader: " + infoLog;
            }
            return shader;
        };
        function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
            var vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
            var fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw "Can't create program";
            }
            return program;
        }
        GLUtils.createProgram = createProgram;
        function createVertexBuffer(gl, vertexData) {
            var bufferData = new Float32Array(vertexData);
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
            return buffer;
        }
        GLUtils.createVertexBuffer = createVertexBuffer;
    })(GLUtils = Linespace.GLUtils || (Linespace.GLUtils = {}));
})(Linespace || (Linespace = {}));
//# sourceMappingURL=glUtils.js.map