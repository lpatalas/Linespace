namespace Linespace {

    const vertexShaderSource = `
            uniform vec2 viewportSize;            

            attribute vec2 vpos;

            void main() {
                vec2 screenPos = (vpos * 0.5) / (viewportSize * 0.5);
                gl_Position = vec4(screenPos.x, screenPos.y, 0, 1);
                gl_PointSize = 1.0;
            }
`;

    const fragmentShaderSource = `
            void main() {
                gl_FragColor = vec4(1, 1, 1, 1);
            }
`;

    interface Attributes {
        vpos: number;
    }

    interface Uniforms {
        viewportSize: WebGLUniformLocation;
    }

    export class GalaxyRenderer {

        private program: WebGLProgram;
        private vertexBuffer: WebGLBuffer;
        private attributes: Attributes;
        private uniforms: Uniforms;

        constructor(gl: WebGLRenderingContext) {
            this.program = GLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

            gl.useProgram(this.program);

            this.attributes = {
                vpos: gl.getAttribLocation(this.program, "vpos")
            };
            gl.enableVertexAttribArray(this.attributes.vpos);

            this.uniforms = {
                viewportSize: gl.getUniformLocation(this.program, 'viewportSize')
            };

            const vertices = [
                200.2, 200.2, 0.0,
                -200.2, 200.2, 0.0,
                200.2, -200.2, 0.0,
                -200.2, -200.2, 0.0
            ];

            this.vertexBuffer = GLUtils.createVertexBuffer(gl, vertices);
        }

        render(gl: WebGLRenderingContext, viewportSize: Vec2D) {
            gl.useProgram(this.program);
            gl.uniform2f(this.uniforms.viewportSize, viewportSize.x, viewportSize.y);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(this.attributes.vpos, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.POINTS, 0, 4);
        }

    }

}