namespace Linespace {

    export function createFpsCounter(debugDisplay: DebugDisplay) {
        let frameCounter = 0;
        let fpsMeasureStartTime: number;
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
    };

}