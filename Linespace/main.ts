///<reference path="definitions.d.ts" />
///<reference path="vec2D.ts" />
///<reference path="debugDisplay.ts" />

module Linespace {

    const isDebugMode = window.location.search.indexOf('debug=1') >= 0;
    const debugDisplay = new DebugDisplay();

    interface Orbit {
        radius: Vec2D;
        orientation: number;
    }

    interface Planet {
        color: string;
        orbit: Orbit;
        radius: number;
        speed: number;
    }

    const TWO_PI = Math.PI * 2;

    const rgb = function(r: number, g: number, b: number) {
        r = Math.floor(r);
        g = Math.floor(g);
        b = Math.floor(b);
        return `rgb(${r}, ${g}, ${b})`;
    };

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

        const drawCircle = function(position: Vec2D, radius: number, color: string) {
            context.strokeStyle = color;
            context.beginPath();
            context.arc(position.x, position.y, radius, 0, TWO_PI);
            context.stroke();
        };

        const fillCircle = function(position: Vec2D, radius: number, color: string) {
            context.fillStyle = color;
            context.beginPath();
            context.arc(position.x, position.y, radius, 0, TWO_PI);
            context.fill();
        };

        const drawEllipse = function(center: Vec2D, radius: Vec2D, color: string) {
            context.strokeStyle = color;
            context.beginPath();
            context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, TWO_PI);
            context.stroke();
        };

        const fillEllipse = function(center: Vec2D, radius: Vec2D, number, color: string) {
            context.strokeStyle = color;
            context.beginPath();
            context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, TWO_PI);
            context.fill();
        };

        const planets: Planet[] = [
            { color: '#804000', radius: 10, speed: 0.7, orbit: { radius: { x: 120, y: 115 }, orientation: 100 } },
            { color: '#804080', radius: 10, speed: 0.4, orbit: { radius: { x: 220, y: 210 }, orientation: 100 } },
            { color: '#3040F0', radius: 20, speed: 0.2, orbit: { radius: { x: 500, y: 470 }, orientation: 100 } }
        ];

        const drawPlanet = function(time: number, planet: Planet) {
            const a = planet.orbit.radius.x;
            const b = planet.orbit.radius.y;
            const c = Math.sqrt(a * a - b * b);
            
            drawEllipse(vadd(getCenter(), { x: c, y: 0 }), planet.orbit.radius, 'white');

            const offset = {
                x: Math.sin(planet.speed * time) * planet.orbit.radius.x + c,
                y: Math.cos(planet.speed * time) * planet.orbit.radius.y
            };
            fillCircle(vadd(getCenter(), offset), planet.radius, planet.color);
        };

        const repeat = function(times: number, callback: Function) {
            while (times-- > 0) {
                callback();
            }
        }

        const generate = function <T>(count: number, generator: (i: number) => T): T[] {
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(generator(i));
            }
            return result;
        };

        interface Star {
            position: Vec2D;
            color: string;
        }

        const starRng = new Math.seedrandom(':)');
        //starRng.
        
        const stars: Star[] = generate(1000, () => {
            const intensity = 100 + starRng.double() * 155;
            return {
                position: {
                    x: starRng.double(),
                    y: starRng.double()
                },
                color: rgb(intensity, intensity, intensity)
            };
        });

        const drawStars = function() {
            const tileSize = 1000;
            const starsPerTile = 100;

            const roundToTile = function(x: number) {
                return Math.floor(x / tileSize) * tileSize;
            }

            const minStarScale = 0.1;
            const maxStarScale = 0.5;

            let cint = (worldScale - minStarScale) / (maxStarScale - minStarScale);
            cint = Math.min(1, Math.max(0, cint));
            debugDisplay.addText(`cint: ${cint}`);

            const drawTile = function(tileX: number, tileY: number) {
                tileX = Math.round(tileX);
                tileY = Math.round(tileY);

                debugDisplay.addText(`Drawing tile: ${tileX}, ${tileY}`);

                var rng = new Math.seedrandom(`${tileX},${tileY}`);
                for (let i = 0; i < starsPerTile; i++) {
                    const x = tileX + rng.quick() * tileSize;
                    const y = tileY + rng.quick() * tileSize;
                    const c = 100 + rng.quick() * 155;
                    drawPixel(vec(x, y), rgb(c * cint, c * cint, c * cint));
                }
                context.strokeStyle = rgb(80, 80, 80);
                context.setLineDash([10, 10]);
                context.beginPath();
                context.moveTo(tileX, tileY);
                context.lineTo(tileX + tileSize, tileY);
                context.moveTo(tileX, tileY);
                context.lineTo(tileX, tileY + tileSize);
                context.stroke();
                context.fillStyle = rgb(80, 80, 80);
                context.fillText(`(${tileX}, ${tileY})`, tileX + 10, tileY + 20);
            };

            const pos = vec(worldPosition.x, worldPosition.y);
            const topLeft = vec(pos.x - canvas.width / worldScale / 2, pos.y - canvas.height / worldScale / 2);
            const maxX = canvas.width / worldScale + topLeft.x;
            const maxY = canvas.height / worldScale + topLeft.y;
            const startX = roundToTile(topLeft.x);
            const startY = roundToTile(topLeft.y);

            debugDisplay.addJson({ maxX, maxY, startX, startY });

            for (let tileY = startY; tileY < maxY; tileY += tileSize) {
                for (let tileX = startX; tileX < maxX; tileX += tileSize) {
                    drawTile(tileX, tileY);
                }
            }

            context.setLineDash([]);
        };

        const drawGrid = function(position: Vec2D, scale: number, gridSize: number) {
            const topLeftX = position.x - (canvas.width / 2) / scale;
            const topLeftY = position.y - (canvas.height / 2) / scale;
            const gridOffsetX = (topLeftX % gridSize) * scale;
            const gridOffsetY = (topLeftY % gridSize) * scale;
            const screenGridSize = gridSize * scale;

            debugDisplay.addJson({ gridOffsetX, gridOffsetY, gridSize, screenGridSize });

            context.setLineDash([10, 10]);
            context.strokeStyle = 'gray';
            context.beginPath();
            for (let y = -gridOffsetY; y < canvas.height; y += screenGridSize) {
                context.moveTo(-gridOffsetX - screenGridSize, y);
                context.lineTo(canvas.width + screenGridSize - gridOffsetX, y);
            }
            for (let x = -gridOffsetX; x < canvas.width; x += screenGridSize) {
                context.moveTo(x, -gridOffsetY - screenGridSize);
                context.lineTo(x, canvas.height + screenGridSize - gridOffsetY);
            }
            context.stroke();
            context.setLineDash([]);
        };

        let worldPosition;
        let worldScale = 1;

        const getScreenTopLeftPosition = function(scale?: number) {
            scale = scale || worldScale;
            return vec(worldPosition.x * scale - (canvas.width / 2), worldPosition.y * scale - canvas.height / 2);
        };

        const drawObjects = function(time: number) {
            worldPosition = worldPosition || getCenter();

            //const starsTopLeft = getScreenTopLeftPosition(1);
            //context.setTransform(1, 0, 0, 1, -starsTopLeft.x, -starsTopLeft.y);
            //drawStars();

            drawGrid(worldPosition, worldScale, 1000);

            const topLeft = getScreenTopLeftPosition();
            context.setTransform(worldScale, 0, 0, worldScale, -topLeft.x, -topLeft.y);
            fillCircle(getCenter(), 30, '#ff8000');
            planets.forEach(planet => drawPlanet(time, planet));
        };

        const updateFpsCounter = (() => {
            let frameCounter = 0;
            let fpsMeasureStartTime = null;
            const fpsMeasureInterval = 1;
            let currentFps = 0;

            return function(time: number) {
                frameCounter++;

                if (!fpsMeasureStartTime) {
                    fpsMeasureStartTime = time;
                }
                else if (time - fpsMeasureStartTime >= fpsMeasureInterval) {
                    currentFps = frameCounter / (time - fpsMeasureStartTime);
                    fpsMeasureStartTime = time;
                    frameCounter = 0;
                }

                debugDisplay.addText(`FPS: ${currentFps.toFixed(2)}`);
            };
        })();

        const update = function(dt: number, time: number) {
            debugDisplay.reset();
            updateFpsCounter(time);

            debugDisplay.addJson({ worldPosition, worldScale });
            debugDisplay.addText(`Zoom: ${worldScale}`);

            fitCanvasToWindow();
            clearCanvas();
            drawObjects(time);

            if (isDebugMode) {
                // World (0, 0) position
                fillCircle(vec(0, 0), 10, 'red');

                // Circle centered in the screen
                context.setTransform(1, 0, 0, 1, 0, 0);
                drawCircle(vec(canvas.width / 2, canvas.height / 2), 20, 'white');

                debugDisplay.draw(vec(10, 10), context);
            }
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
            
            setInterval(() => {
                const currentTime = getCurrentTime();
                update(currentTime - lastTime, currentTime);
                lastTime = currentTime;
            }, 33);
        };

        hookMouseEvents();
        runMainLoop();
    }

}