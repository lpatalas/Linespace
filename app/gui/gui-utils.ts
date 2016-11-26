import { StringDictionary } from '../common/infotypes';
import { Guid } from '../common/guid';
export class GuiUtils {

    private static mainContainer: HTMLElement;
    private static appUiFileBase: string = '/app/gui/';


    static LoadFile(path: string): Promise<string> {

        return new Promise((resolve, reject) => {
            var req: XMLHttpRequest = new XMLHttpRequest();
            req.open('GET', GuiUtils.appUiFileBase + path, true);

            req.onreadystatechange = (ev: ProgressEvent) => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        resolve(req.response);
                    }
                    else {
                        reject(req.response);
                    }
                }
            };

            req.send();
        });
    }

    static getMainUiContainer(): HTMLElement {
        if (this.mainContainer == null) {
            this.mainContainer = document.getElementById("main-container");
        }
        return this.mainContainer;
    }

    static injectHtml(htmlToInject: string, placeholders: StringDictionary = null): HTMLElement {
        let mainContainer = GuiUtils.getMainUiContainer();
        var elem: HTMLElement = document.createElement("div");
        let popupId = Guid.newGuid();

        if (placeholders != null && placeholders.count() > 0) {
            let keys = placeholders.keys;
            for (let key in keys) {
                let value = placeholders.get(key);
                htmlToInject = htmlToInject.replace("{{" + key + "}}", value);
            }
        }
        elem.innerHTML = htmlToInject;
        mainContainer.insertAdjacentElement('beforeEnd', elem);

        return elem;
    }
}