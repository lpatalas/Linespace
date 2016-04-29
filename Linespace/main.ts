///<reference path="definitions.d.ts" />

module Linespace {

    interface Vec2D {
        x: number;
        y: number;
    }

    const vec = function(x: number, y: number): Vec2D {
        return { x, y };
    }

    const vadd = function(a: Vec2D, b: Vec2D): Vec2D {
        return { x: a.x + b.x, y: a.y + b.y };
    }

    const vsub = function(a: Vec2D, b: Vec2D): Vec2D {
        return vec(a.x - b.x, a.y - b.y);
    }

    const vmul = function(a: Vec2D, b: Vec2D): Vec2D {
        return { x: a.x * b.x, y: a.y * b.y };
    }

    const vsqrt = function(v: Vec2D): Vec2D {
        return { x: Math.sqrt(v.x), y: Math.sqrt(v.y) };
    }

    interface Transform2D {
        m11: number;
        m12: number;
        m21: number;
        m22: number;
        dx: number;
        dy: number;
    }

    const xform = function(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): Transform2D {
        return { m11, m12, m21, m22, dx, dy };
    }

    const xidentity = function(): Transform2D {
        return xform(1, 0, 0, 1, 0, 0);
    }

    const xtranslate = function(original: Transform2D, dx: number, dy: number): Transform2D {
        return xform(original.m11, original.m12, original.m21, original.m22, original.dx + dx, original.dy + dy);
    }

    const xapply = function(t: Transform2D, context: CanvasRenderingContext2D) {
        context.setTransform(t.m11, t.m12, t.m21, t.m22, t.dx, t.dy);
    }

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
            { color: '#804000', radius: 10, speed: 0.7, orbit: { radius: { x: 120, y: 100 }, orientation: 100 } },
            { color: '#804080', radius: 10, speed: 0.4, orbit: { radius: { x: 220, y: 200 }, orientation: 100 } },
            { color: '#3040F0', radius: 20, speed: 0.2, orbit: { radius: { x: 500, y: 450 }, orientation: 100 } }
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
            stars.forEach(star => drawPixel(vmul(star.position, getSize()), star.color));
        };

        let currentTransform = xidentity();

        const drawObjects = function(time: number) {
            xapply(currentTransform, context);
            drawStars();
            fillCircle(getCenter(), 30, '#ff8000');
            planets.forEach(planet => drawPlanet(time, planet));
        };

        const drawDebugOverlay = function() {
            const transformJson = JSON.stringify(currentTransform);
            context.fillStyle = 'red';
            context.setTransform(2, 0, 0, 2, 0, 0);
            context.fillText(transformJson, 10, 10);
        };

        const update = function(dt: number, time: number) {
            fitCanvasToWindow();
            clearCanvas();
            drawObjects(time);
            drawDebugOverlay();
        };

        const hookMouseEvents = function() {
            const body = document.getElementsByTagName('body')[0];
            let initialMousePos: Vec2D = null;
            let mousePressed = false;
            let initialTransform = currentTransform;

            body.addEventListener('mousedown', event => {
                if (event.button == 0) {
                    mousePressed = true;
                    initialMousePos = vec(event.pageX, event.pageY);
                    initialTransform = currentTransform;
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
                    currentTransform = xtranslate(initialTransform, offset.x, offset.y);
                    xapply(currentTransform, context);
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