import { GuiUtils } from './gui-utils';
export abstract class GuiBase {

    protected element: HTMLElement;
    protected get fileName(): string { return null; };

    protected LoadElement(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.LoadFile(this.fileName).then(succ => {
                this.element = GuiUtils.injectHtml(succ);
                resolve(succ);
            }).catch(err => {
                reject(err);
            });
        });

    }

    protected addAction(eventName:string, elementId: string, action: () => any) {
        let mainContainer
        this.element.addEventListener(eventName, (ev: MouseEvent) => {
            let evExt = <Ext.EventTargetExt>ev.target;

            if (evExt != undefined && evExt.id == elementId) {
                action();
            }

        }, false);

    }

    private LoadFile(path: string): Promise<string> {
        return GuiUtils.LoadFile(path);
    }


}