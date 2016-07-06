namespace Linespace {

    const clamp = function(x: number, min: number, max: number) {
        return Math.min(max, Math.max(x, min));
    };

    export function rgb(r: number, g: number, b: number) {
        r = clamp(Math.floor(r), 0, 255);
        g = clamp(Math.floor(g), 0, 255);
        b = clamp(Math.floor(b), 0, 255);
        return `rgb(${r}, ${g}, ${b})`;
    };

    export function rgbf(r: number, g: number, b: number) {
        return rgb(r * 255, g * 255, b * 255);
    };

}