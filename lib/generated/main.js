var Linespace;
(function (Linespace) {
    var getWebGLContext = function (canvas) {
        var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return WebGLDebugUtils.makeDebugContext(context);
    };
    var parseStarCountParam = function () {
        var regex = /starCount=([0-9]+)/;
        var matches = window.location.search.match(regex);
        if (matches && matches.length > 1) {
            return parseInt(matches[1], 10);
        }
        else {
            return 10000;
        }
    };
    var starCountParam = parseStarCountParam();
    function runGame(canvas) {
        var gl = getWebGLContext(canvas);
        var getCenter = function () {
            return { x: canvas.width / 2, y: canvas.height / 2 };
        };
        var galaxy = new Linespace.Galaxy({
            center: Linespace.vec(0, 0),
            rotationSpeed: 0.05,
            size: 400,
            sizeRatio: 0.875,
            starCount: starCountParam
        });
        var galaxyRenderer;
        var setupWebGL = function () {
            gl.clearColor(0.0, 0.0, 0, 0);
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);
            galaxyRenderer = new Linespace.GalaxyRenderer(gl, galaxy);
        };
        var clearCanvas = function () {
            gl.clear(gl.COLOR_BUFFER_BIT);
        };
        var setupViewport = function () {
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        var fitCanvasToWindow = function () {
            var sizeChanged = false;
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
        var worldPosition;
        var worldScale = 1;
        //const getScreenTopLeftPosition = function(scale?: number) {
        //    scale = scale || worldScale;
        //    return vec(worldPosition.x * scale - (canvas.width / 2), worldPosition.y * scale - canvas.height / 2);
        //};
        var drawObjects = function (time) {
            worldPosition = worldPosition || getCenter();
            galaxyRenderer.render(gl, time, {
                scale: worldScale,
                viewportSize: Linespace.vec(canvas.width, canvas.height)
            });
            //const topLeft = getScreenTopLeftPosition();
            //context.setTransform(worldScale, 0, 0, worldScale, -topLeft.x, -topLeft.y);
            //galaxy.draw(context, time);
        };
        var processFrame = function (dt, time) {
            fitCanvasToWindow();
            clearCanvas();
            drawObjects(time);
        };
        var hookMouseEvents = function () {
            var body = document.getElementsByTagName('body')[0];
            var initialMousePos = null;
            var mousePressed = false;
            var initialPosition;
            body.addEventListener('mousedown', function (event) {
                if (event.button == 0) {
                    mousePressed = true;
                    initialMousePos = Linespace.vec(event.pageX, event.pageY);
                    initialPosition = Linespace.vcopy(worldPosition);
                }
            });
            body.addEventListener('mouseup', function (event) {
                if (event.button == 0) {
                    mousePressed = false;
                }
            });
            body.addEventListener('mousemove', function (event) {
                if (mousePressed) {
                    var currentMousePos = Linespace.vec(event.pageX, event.pageY);
                    var offset = Linespace.vsub(currentMousePos, initialMousePos);
                    offset.x /= worldScale;
                    offset.y /= worldScale;
                    worldPosition = Linespace.vsub(initialPosition, offset);
                }
            });
            body.addEventListener('wheel', function (event) {
                worldScale -= event.deltaY * 0.001;
                if (worldScale < 0.0001) {
                    worldScale = 0.0001;
                }
            });
        };
        var runMainLoop = function () {
            var getCurrentTime = function () { return new Date().getTime() / 1000; };
            var lastTime = getCurrentTime();
            var elapsedTime = 0;
            setupWebGL();
            setupViewport();
            var mainLoopStep = function () {
                var currentTime = getCurrentTime();
                var deltaTime = currentTime - lastTime;
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
    Linespace.runGame = runGame;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=main.js.map