class GLUtils {
	private static createShader = function(gl: WebGLRenderingContext, source: string, shaderType: number) {
		const shader = gl.createShader(shaderType);
		if (!shader) {
			throw new Error("Can't create shader");
		}

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const infoLog = gl.getShaderInfoLog(shader);
			throw `Can't compile shader: ${infoLog}`;
		}

		return shader;
	};

	static createProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
		const vertexShader = GLUtils.createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
		const fragmentShader = GLUtils.createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
		const program = gl.createProgram();
		if (!program) {
			throw new Error("Can't create shader program");
		}

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw "Can't create program";
		}

		return program;
	}

	static createVertexBuffer(gl: WebGLRenderingContext, vertexData: number[]): WebGLBuffer {
		const bufferData = new Float32Array(vertexData);
		const buffer = gl.createBuffer();
		if (!buffer) {
			throw new Error("Can't create vertex buffer");
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
		return buffer;
	}
}
