
export class EventManager {

    public static GetGameEventHandle(){
        return document.getElementById('game-event-handle');
    }

    public static CreateCustomEvent() {
        let ce: CustomEvent = new CustomEvent('celestialBodyHover');
        ce.initCustomEvent('celestialBodyHover', true, true, { event: event });

        return ce;
    }

    public static DispatchEvent(elem: HTMLElement, event: Event) {
        if (elem) {
            return elem.dispatchEvent(event);
        }

        return false;
    }

    public CreateListener(elem: HTMLElement, eventName: string, func: any){
        if(elem)
            elem.addEventListener(eventName, func);
    }

    public RemoveListener(elem: HTMLElement, eventName: string,  func: any){
        if(elem)
            elem.removeEventListener(eventName, func);
    }
}