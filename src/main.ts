///<reference path="./game.ts" />

const galaxy = new Galaxy({
    center: vec(0, 0),
    rotationSpeed: 0.05,
    size: 400,
    sizeRatio: 0.875,
    starCount: 10000
});

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const game = new Game(canvas, window, galaxy);
game.run();
