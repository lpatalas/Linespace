namespace Linespace {

    export function rgb(r: number, g: number, b: number) {
        r = Math.floor(r);
        g = Math.floor(g);
        b = Math.floor(b);
        return `rgb(${r}, ${g}, ${b})`;
    };

    export function rgbf(r: number, g: number, b: number) {
        return rgb(r * 255, g * 255, b * 255);
    };

}