namespace Linespace {

    const getWebGLContext = function(canvas: HTMLCanvasElement): WebGLRenderingContext {
        const context = <WebGLRenderingContext>canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return WebGLDebugUtils.makeDebugContext(context);
    };

    export function runGame(canvas: HTMLCanvasElement) {
        const gl = getWebGLContext(canvas);
        
        const getCenter = function(): Vec2D {
            return { x: canvas.width / 2, y: canvas.height / 2 };
        };

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

        const createShader = function(source: string, shaderType: number) {
            const shader = gl.createShader(shaderType);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw "Can't compile shader";
            }

            return shader;
        };

        const createShaderProgram = function() {
            const vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
            const fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw "Can't create program";
            }

            return program;
        };

        const createPointsBuffer = function() {
            var vertices = [
                0.2, 0.2, 0.0,
                -0.2, 0.2, 0.0,
                0.2, -0.2, 0.0,
                -0.2, -0.2, 0.0
            ];

            const vertexData = new Float32Array(vertices);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);


            return buffer;
        };

        let pointsBuffer: WebGLBuffer;
        let vposAttrib: number;

        const setupWebGL = function() {
            gl.clearColor(0.0, 0.0, 0, 0);
            gl.disable(gl.DEPTH_TEST);

            pointsBuffer = createPointsBuffer();

            const program = createShaderProgram();
            gl.useProgram(program);


            vposAttrib = gl.getAttribLocation(program, "vpos");
            gl.enableVertexAttribArray(vposAttrib);
        };

        const clearCanvas = function() {
            gl.clear(gl.COLOR_BUFFER_BIT);
        };

        const setupViewport = function() {
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        const fitCanvasToWindow = function() {
            let sizeChanged = false;

            if (canvas.width != window.innerHeight) {
                canvas.width = window.innerWidth;
                sizeChanged = true;
            }
            if (canvas.height != window.innerHeight) {
                canvas.height = window.innerHeight;
                sizeChanged = true;
            }

            if (sizeChanged) {
                setupViewport();
            }
        };

        let worldPosition: Vec2D;
        let worldScale = 1;

        //const getScreenTopLeftPosition = function(scale?: number) {
        //    scale = scale || worldScale;
        //    return vec(worldPosition.x * scale - (canvas.width / 2), worldPosition.y * scale - canvas.height / 2);
        //};

        //const galaxy = new Galaxy({
        //    center: vec(400, 400),
        //    rotationSpeed: 0.05,
        //    size: 400,
        //    sizeRatio: 0.875,
        //    starCount: 10000
        //});

        const drawObjects = function(time: number) {
            worldPosition = worldPosition || getCenter();

            gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
            gl.vertexAttribPointer(vposAttrib, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.POINTS, 0, 4);
            //const topLeft = getScreenTopLeftPosition();
            //context.setTransform(worldScale, 0, 0, worldScale, -topLeft.x, -topLeft.y);
            //galaxy.draw(context, time);
        };

        const processFrame = function(dt: number, time: number) {
            fitCanvasToWindow();
            clearCanvas();
            drawObjects(time);
        };

        const hookMouseEvents = function() {
            const body = document.getElementsByTagName('body')[0];
            let initialMousePos: Vec2D = null;
            let mousePressed = false;
            let initialPosition: Vec2D;

            body.addEventListener('mousedown', event => {
                if (event.button == 0) {
                    mousePressed = true;
                    initialMousePos = vec(event.pageX, event.pageY);
                    initialPosition = vcopy(worldPosition);
                }
            });

            body.addEventListener('mouseup', event => {
                if (event.button == 0) {
                    mousePressed = false;
                }
            });

            body.addEventListener('mousemove', event => {
                if (mousePressed) {
                    const currentMousePos = vec(event.pageX, event.pageY);
                    const offset = vsub(currentMousePos, initialMousePos);
                    offset.x /= worldScale;
                    offset.y /= worldScale;
                    worldPosition = vsub(initialPosition, offset);
                }
            });

            body.addEventListener('wheel', event => {
                worldScale -= event.deltaY * 0.0001;
                if (worldScale < 0.0001) {
                    worldScale = 0.0001;
                }
            });
        };

        const runMainLoop = function() {
            const getCurrentTime = () => new Date().getTime() / 1000;
            let lastTime = getCurrentTime();

            setupWebGL();
            setupViewport();

            const mainLoopStep = function() {
                const currentTime = getCurrentTime();
                processFrame(currentTime - lastTime, currentTime);
                lastTime = currentTime;
                requestAnimationFrame(mainLoopStep);
            };

            mainLoopStep();
        };

        hookMouseEvents();
        runMainLoop();
    }

}