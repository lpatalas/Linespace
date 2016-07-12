var Linespace;
(function (Linespace) {
    function createFpsCounter(debugDisplay) {
        var frameCounter = 0;
        var fpsMeasureStartTime;
        var fpsMeasureInterval = 1;
        var currentFps = 0;
        return function (time) {
            frameCounter++;
            if (!fpsMeasureStartTime) {
                fpsMeasureStartTime = time;
            }
            else if (time - fpsMeasureStartTime >= fpsMeasureInterval) {
                currentFps = frameCounter / (time - fpsMeasureStartTime);
                fpsMeasureStartTime = time;
                frameCounter = 0;
            }
            debugDisplay.addText("FPS: " + currentFps.toFixed(2));
        };
    }
    Linespace.createFpsCounter = createFpsCounter;
    ;
})(Linespace || (Linespace = {}));
//# sourceMappingURL=fpsCounter.js.map