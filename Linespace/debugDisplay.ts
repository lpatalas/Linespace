namespace Linespace {

    const color = '#40a040';
    const fontSize = 20;
    const font = `${fontSize}px Consolas`;

    export class DebugDisplay {
        
        private debugLines: string[];

        reset() {
            this.debugLines = [];
        }

        addText(text: string) {
            this.debugLines.push(text);
        }

        addJson(obj: any) {
            this.addText(JSON.stringify(obj));
        }
        
        draw(pos: Vec2D, context: CanvasRenderingContext2D) {
            context.setTransform(1, 0, 0, 1, pos.x, pos.y + fontSize);
            context.font = font;
            context.fillStyle = color;

            this.debugLines.forEach((line, index) => {
                context.fillText(line, 0, index * fontSize);
            });
        }
    }

}