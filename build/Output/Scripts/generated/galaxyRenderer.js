var Linespace;
(function (Linespace) {
    var vertexShaderSource = "\n            precision mediump float;\n\n            uniform float scale;\n            uniform float rotationSpeed;\n            uniform float time;\n            uniform vec2 viewportSize;            \n\n            attribute vec4 starParams;\n            attribute vec3 color;\n\n            varying vec3 vColor;\n\n            void main() {\n                float initialRotation = starParams.x;\n                float longerRadius = starParams.y;\n                float orbitRotation = starParams.z;\n                float shorterRadius = starParams.w;\n\n                float r = initialRotation + time * rotationSpeed;\n                float x = sin(r) * longerRadius * scale;\n                float y = cos(r) * shorterRadius * scale;\n\n                float xx = x * cos(orbitRotation) - y * sin(orbitRotation);\n                float yy = x * sin(orbitRotation) + y * cos(orbitRotation);\n\n                vec2 vpos = vec2(xx, yy);\n                vec2 screenPos = vpos / (viewportSize * 0.5);\n\n                gl_Position = vec4(screenPos.x, screenPos.y, 0, 1);\n                gl_PointSize = 3.0;\n\n                vColor = color;\n            }\n";
    var fragmentShaderSource = "\n            precision mediump float;\n\n            varying vec3 vColor;\n\n            void main() {\n                gl_FragColor = vec4(vColor, 1);\n            }\n";
    var GalaxyRenderer = (function () {
        function GalaxyRenderer(gl, galaxy) {
            this.galaxy = galaxy;
            this.program = Linespace.GLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
            gl.useProgram(this.program);
            this.attributes = {
                starParams: gl.getAttribLocation(this.program, "starParams"),
                color: gl.getAttribLocation(this.program, "color")
            };
            gl.enableVertexAttribArray(this.attributes.starParams);
            gl.enableVertexAttribArray(this.attributes.color);
            this.uniforms = {
                scale: gl.getUniformLocation(this.program, 'scale'),
                rotationSpeed: gl.getUniformLocation(this.program, 'rotationSpeed'),
                time: gl.getUniformLocation(this.program, 'time'),
                viewportSize: gl.getUniformLocation(this.program, 'viewportSize')
            };
            var stars = galaxy.getStars();
            var vertices = new Array(stars.length * 7);
            var index = 0;
            stars.forEach(function (star) {
                vertices[index++] = star.initialRotation;
                vertices[index++] = star.longerRadius;
                vertices[index++] = star.orbitRotation;
                vertices[index++] = star.shorterRadius;
                vertices[index++] = star.color.r;
                vertices[index++] = star.color.g;
                vertices[index++] = star.color.b;
            });
            this.vertexBuffer = Linespace.GLUtils.createVertexBuffer(gl, vertices);
            this.vertexCount = stars.length;
        }
        GalaxyRenderer.prototype.render = function (gl, time, view) {
            gl.useProgram(this.program);
            gl.uniform1f(this.uniforms.scale, view.scale);
            gl.uniform1f(this.uniforms.rotationSpeed, this.galaxy.rotationSpeed);
            gl.uniform1f(this.uniforms.time, time);
            gl.uniform2f(this.uniforms.viewportSize, view.viewportSize.x, view.viewportSize.y);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(this.attributes.starParams, 4, gl.FLOAT, false, 7 * 4, 0);
            gl.vertexAttribPointer(this.attributes.color, 3, gl.FLOAT, false, 7 * 4, 4 * 4);
            gl.drawArrays(gl.POINTS, 0, this.vertexCount);
        };
        return GalaxyRenderer;
    })();
    Linespace.GalaxyRenderer = GalaxyRenderer;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=galaxyRenderer.js.map