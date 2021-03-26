import {ElementBase} from "./ElementBase";
import Application from "../Application/Application";

class CasualMountingBase extends ElementBase {
    _Mount(isFirstMount: boolean = false) : void {
        if (!this._IsShown)
            return;
        this._IsMount = true;

        const parent = this.ParentElement as ElementBase;
        if (!parent) {
            Application.RootElement.appendChild(this.DOM);
            return;
        }
        let container = this.GetTargetRenderDOM();
        if (!container) {
            this._IsMount = false;
            return;
        }

        if (isFirstMount){
            try {
                container.appendChild(this.DOM);
            }
            catch (e) {
                debugger;
            }
            return;
        }

        const nextDomTreeSibling = this.GetNextSibling();
        if (nextDomTreeSibling) {
            try {

                container.insertBefore(this.DOM, nextDomTreeSibling);
            }
            catch (e) {
                //debugger;
                console.warn('[Mount] error CasualMountingBase');
                container.appendChild(this.DOM);
            }
        }
        else {
            try {
                container.appendChild(this.DOM);
            }
            catch (e) {
                debugger;
                console.warn('[Mount] error CasualMountingBase');
                container.appendChild(this.DOM);
            }
        }
    }
}

export {CasualMountingBase}