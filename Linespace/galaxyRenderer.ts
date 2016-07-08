namespace Linespace {

    const vertexShaderSource = `
            precision mediump float;

            uniform float rotationSpeed;
            uniform float time;
            uniform vec2 viewportSize;            

            attribute vec4 starParams;
            attribute vec3 color;

            varying vec3 vColor;

            void main() {
                float initialRotation = starParams.x;
                float longerRadius = starParams.y;
                float orbitRotation = starParams.z;
                float shorterRadius = starParams.w;

                float r = initialRotation + time * rotationSpeed;
                float x = sin(r) * longerRadius;
                float y = cos(r) * shorterRadius;

                float xx = x * cos(orbitRotation) - y * sin(orbitRotation);
                float yy = x * sin(orbitRotation) + y * cos(orbitRotation);

                vec2 vpos = vec2(xx, yy);
                vec2 screenPos = vpos / (viewportSize * 0.5);

                gl_Position = vec4(screenPos.x, screenPos.y, 0, 1);
                gl_PointSize = 3.0;

                vColor = color;
            }
`;

    const fragmentShaderSource = `
            precision mediump float;

            varying vec3 vColor;

            void main() {
                gl_FragColor = vec4(vColor, 1);
            }
`;

    interface Attributes {
        starParams: number;
        color: number;
    }

    interface Uniforms {
        rotationSpeed: WebGLUniformLocation;
        time: WebGLUniformLocation;
        viewportSize: WebGLUniformLocation;
    }

    export class GalaxyRenderer {

        private galaxy: Galaxy;
        private program: WebGLProgram;
        private vertexBuffer: WebGLBuffer;
        private vertexCount: number;
        private attributes: Attributes;
        private uniforms: Uniforms;

        constructor(gl: WebGLRenderingContext, galaxy: Galaxy) {
            this.galaxy = galaxy;

            this.program = GLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

            gl.useProgram(this.program);

            this.attributes = {
                starParams: gl.getAttribLocation(this.program, "starParams"),
                color: gl.getAttribLocation(this.program, "color")
            };
            gl.enableVertexAttribArray(this.attributes.starParams);
            gl.enableVertexAttribArray(this.attributes.color);

            this.uniforms = {
                rotationSpeed: gl.getUniformLocation(this.program, 'rotationSpeed'),
                time: gl.getUniformLocation(this.program, 'time'),
                viewportSize: gl.getUniformLocation(this.program, 'viewportSize')
            };

            const stars = galaxy.getStars();
            const vertices = new Array(stars.length * 7);

            let index = 0;
            stars.forEach(star => {
                vertices[index++] = star.initialRotation;
                vertices[index++] = star.longerRadius;
                vertices[index++] = star.orbitRotation;
                vertices[index++] = star.shorterRadius;
                vertices[index++] = star.color.r;
                vertices[index++] = star.color.g;
                vertices[index++] = star.color.b;
            });

            this.vertexBuffer = GLUtils.createVertexBuffer(gl, vertices);
            this.vertexCount = stars.length;
        }

        render(gl: WebGLRenderingContext, viewportSize: Vec2D, time: number) {
            gl.useProgram(this.program);
            gl.uniform1f(this.uniforms.rotationSpeed, this.galaxy.rotationSpeed);
            gl.uniform1f(this.uniforms.time, time);
            gl.uniform2f(this.uniforms.viewportSize, viewportSize.x, viewportSize.y);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(this.attributes.starParams, 4, gl.FLOAT, false, 7 * 4, 0);
            gl.vertexAttribPointer(this.attributes.color, 3, gl.FLOAT, false, 7 * 4, 4 * 4);
            gl.drawArrays(gl.POINTS, 0, this.vertexCount);
        }

    }

}