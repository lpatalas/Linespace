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

        const galaxy = new Galaxy({
            center: vec(0, 0),
            rotationSpeed: 0.05,
            size: 400,
            sizeRatio: 0.875,
            starCount: 50000
        });

        let galaxyRenderer: GalaxyRenderer;

        const setupWebGL = function() {
            gl.clearColor(0.0, 0.0, 0, 0);
            gl.disable(gl.DEPTH_TEST);

            galaxyRenderer = new GalaxyRenderer(gl, galaxy);
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

        const drawObjects = function(time: number) {
            worldPosition = worldPosition || getCenter();

            galaxyRenderer.render(gl, vec(canvas.width, canvas.height), time);
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
            let elapsedTime = 0;

            setupWebGL();
            setupViewport();

            const mainLoopStep = function() {
                const currentTime = getCurrentTime();
                const deltaTime = currentTime - lastTime;

                elapsedTime += deltaTime;

                processFrame(deltaTime, elapsedTime);
                lastTime = currentTime;
                requestAnimationFrame(mainLoopStep);
            };

            mainLoopStep();
        };

        hookMouseEvents();
        runMainLoop();
    }

}