namespace Linespace {

    const isDebugMode = window.location.search.indexOf('debug=1') >= 0;
    const debugDisplay = new DebugDisplay();

    const TWO_PI = Math.PI * 2;

    export function runGame(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d');

        const getCenter = function(): Vec2D {
            return { x: canvas.width / 2, y: canvas.height / 2 };
        };

        const getSize = function(): Vec2D {
            return { x: canvas.width, y: canvas.height };
        }

        const fitCanvasToWindow = function() {
            if (canvas.width != window.innerHeight) {
                canvas.width = window.innerWidth;
            }
            if (canvas.height != window.innerHeight) {
                canvas.height = window.innerHeight;
            }
        };

        const clearCanvas = function() {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        const drawPixel = function(position: Vec2D, color: string) {
            context.fillStyle = color;
            context.fillRect(position.x, position.y, 1, 1);
        };

        let worldPosition: Vec2D;
        let worldScale = 1;

        const getScreenTopLeftPosition = function(scale?: number) {
            scale = scale || worldScale;
            return vec(worldPosition.x * scale - (canvas.width / 2), worldPosition.y * scale - canvas.height / 2);
        };

        

        const drawObjects = function(time: number) {
            worldPosition = worldPosition || getCenter();

            drawGrid(context, worldPosition, worldScale);

            const topLeft = getScreenTopLeftPosition();
            context.setTransform(worldScale, 0, 0, worldScale, -topLeft.x, -topLeft.y);
            drawGalaxy(context, vec(400, 400), 200, time);
        };

        const updateFpsCounter = createFpsCounter(debugDisplay);

        const update = function(dt: number, time: number) {
            debugDisplay.reset();
            updateFpsCounter(time);

            debugDisplay.addJson({ worldPosition, worldScale });
            debugDisplay.addText(`Zoom: ${worldScale}`);

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

            const updateFrame = function() {
                const currentTime = getCurrentTime();
                update(currentTime - lastTime, currentTime);
                lastTime = currentTime;
                requestAnimationFrame(updateFrame);
            };

            updateFrame();
        };

        hookMouseEvents();
        runMainLoop();
    }

}