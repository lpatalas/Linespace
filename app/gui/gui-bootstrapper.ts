
import { GameUi } from './game/game-ui';
export class GuiBootstrapper {
    init() {
        const gameUi = new GameUi();
        gameUi.init();
    }
}