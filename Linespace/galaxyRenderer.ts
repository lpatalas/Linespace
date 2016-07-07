namespace Linespace {

    const vertexShaderSource = `
            attribute vec2 vpos;

            void main() {
                gl_Position = vec4(vpos.x, vpos.y, 0, 1);
                gl_PointSize = 1.0;
            }
`;

    const fragmentShaderSource = `
            void main() {
                gl_FragColor = vec4(1, 1, 1, 1);
            }
`;

    export class GalaxyRenderer {

        private program: WebGLProgram;
        private vposAttribIndex: number;
        private vertexBuffer: WebGLBuffer;

        constructor(gl: WebGLRenderingContext) {
            this.program = GLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

            gl.useProgram(this.program);
            this.vposAttribIndex = gl.getAttribLocation(this.program, "vpos");
            gl.enableVertexAttribArray(this.vposAttribIndex);

            const vertices = [
                0.2, 0.2, 0.0,
                -0.2, 0.2, 0.0,
                0.2, -0.2, 0.0,
                -0.2, -0.2, 0.0
            ];

            this.vertexBuffer = GLUtils.createVertexBuffer(gl, vertices);
        }

        render(gl: WebGLRenderingContext) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(this.vposAttribIndex, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.POINTS, 0, 4);
        }

    }

}