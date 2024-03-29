﻿interface Rgb {
    r: number;
    g: number;
    b: number;
}

const clamp = function (x: number, min: number, max: number) {
    return Math.min(max, Math.max(x, min));
};

function rgb(r: number, g: number, b: number) {
    r = clamp(Math.floor(r), 0, 255);
    g = clamp(Math.floor(g), 0, 255);
    b = clamp(Math.floor(b), 0, 255);
    return `rgb(${r}, ${g}, ${b})`;
};

function rgbf(r: number, g: number, b: number) {
    return rgb(r * 255, g * 255, b * 255);
};

function rgbToHex(input: Rgb): string {
    return rgbf(input.r, input.g, input.b);
};
