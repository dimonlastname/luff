import {LibraryArray} from "../../../Library/Array";
import {LibraryDOM} from "../../../Library/DOM";

export type TListener = (e?: MouseEvent) => void

type TListenerItem = {
    ID: number,
    Listener: TListener;
}
let idCounter = 0;

const documentListener = function(e: MouseEvent) {
    const listeners = [...OutsideClickManager.Listeners];
    for (let listenerItem of listeners) {
        listenerItem.Listener(e);
    }
};
function checkGlobalDialogs(eventTarget: HTMLElement) : boolean {
    //console.info('checkGlobalDialogs', eventTarget);
    if (LibraryDOM.Closest(eventTarget, '.l-cb-offer-list')) {
        return false;
    }
    // else if (LibraryDOM.Closest(eventTarget, '.l-period_picker')) {
    //     return false;
    // }

    return true;
}

class OutsideClickManager {
    static Listeners : TListenerItem[] = [];
    public Add(elem: HTMLElement, onOutsideClick: TListener) : number {
        if (!elem) {
            console.error(`[LuffOutsideClickManager] elem is not defined`, elem, onOutsideClick);
            return void 0;
        }
        // if (elem instanceof DocumentFragment) {
        //     debugger;
        // }
        let outsideClickCheck = (e: MouseEvent) => {
            const eventTarget = <HTMLElement>e.target;
            if (eventTarget !== elem /*&& eventTarget.isConnected*/ && !LibraryDOM.IsDescendant(eventTarget, elem)
                && !eventTarget.classList.contains('l-pop-log__close')
                && checkGlobalDialogs(eventTarget)
            )
            {
                //await event bubbling then call callback:
                //TODO: fix crutch;
                setTimeout(() => onOutsideClick(e), 0)
                //console.log("[outside.click]", e);
            }
        };
        const listenerID = ++idCounter;
        OutsideClickManager.Listeners.push({
            ID: listenerID,
            Listener: outsideClickCheck
        });
        return listenerID;
    }
    public Remove(id: number) {
        LibraryArray.Remove(OutsideClickManager.Listeners, x => x.ID === id);
    }
    constructor() {
        //LibraryDOM.AddEventListenerGlobal('click', documentListener);
        document.addEventListener('click', documentListener, {capture: true});
    }
}

const outsideClickManager = new OutsideClickManager();
//window['LuffOutsideClickManager'] = OutsideClickManager;
//window['outsideClickManager'] = outsideClickManager;

export {outsideClickManager};