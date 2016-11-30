import { GuiBase } from '../gui-base';
import { Guid } from '../../common/guid';
import { GuiUtils } from '../gui-utils';

export class GameUi extends GuiBase {
    protected get fileName(): string { return 'game/game-ui.html'; };

    init() {

        const placeholders = {
            uiId: Guid.newGuid(),
            title: 'Galactic zoom'
        }

        this.LoadElement(placeholders).then(succ => {

            this.addAction('click', 'zoom_1', () => {
                this.changeZoom(1);
            });

            this.addAction('click', 'zoom_2', () => {
                this.changeZoom(2);
            });

            this.addAction('click', 'zoom_3', () => {
                this.changeZoom(3);
            });
        });
    }


    changeZoom(zoom: number) {
        console.log('zoom change to: ' + zoom);
    }
}