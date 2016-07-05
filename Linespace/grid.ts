namespace Linespace {

    const options = {
        minSize: 100,
        maxSize: 1000,
        minScreenSize: 100,
        maxOpacity: 0.8,
        incrementSize: (size: number) => size * 2
    };

    const roundTo = function(x: number, rounding: number) {
        return Math.floor(x / rounding) * rounding;
    };

    const computeMinVisibleSize = function(scale: number) {
        let minVisibleSize = options.minSize;
        let screenSize = minVisibleSize * scale;

        while (minVisibleSize < options.maxSize && screenSize < options.minScreenSize) {
            minVisibleSize *= 2;
            screenSize *= 2;
        }

        return minVisibleSize;
    };

    const computeOpacity = function(gridSize: number, scale: number) {
        const screenSize = gridSize * scale;
        const minScreenSize = options.minScreenSize;
        const maxScreenSize = minScreenSize * 2;
        const opacity = (screenSize - minScreenSize) / (maxScreenSize - minScreenSize);
        return opacity * options.maxOpacity;
    }

    export function drawGrid(context: CanvasRenderingContext2D, position: Vec2D, scale: number) {
        const canvas = context.canvas;

        let gridSize = computeMinVisibleSize(scale);

        while (gridSize < options.maxSize) {
            const opacity = computeOpacity(gridSize, scale);

            const topLeftX = position.x - (canvas.width / 2) / scale;
            const topLeftY = position.y - (canvas.height / 2) / scale;
            const gridOffsetX = (topLeftX % gridSize) * scale;
            const gridOffsetY = (topLeftY % gridSize) * scale;
            const screenGridSize = gridSize * scale;

            context.setLineDash([10, 10]);
            context.strokeStyle = rgb(opacity * 255, opacity * 255, opacity * 255);
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

            gridSize *= 2;
        }

        context.setLineDash([]);
    };

}