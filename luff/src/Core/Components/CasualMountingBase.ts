import {ElementBase} from "./ElementBase";
import Application from "../Application/Application";

class CasualMountingBase extends ElementBase {
    _Mount(isFirstMount: boolean = false) : void {
        if (!this._IsShown || this._IsMount)
            return;
        this._IsMount = true;

        // if (this._TargetRenderComp) {
        //     console.warn('[RENDER.DOM] experimental ', this);
        //     this._TargetRenderComp.DOM.appendChild(this.DOM);
        //     return;
        // }
        // if (!this.DOM) {
        //     //special components like <Each/>
        //     console.warn('[RENDER.DOM] impossible branch ', this);
        //     return;
        // }

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

        // if (isFirstMount){
        //     try {
        //         container.appendChild(this.DOM);
        //     }
        //     catch (e) {
        //         debugger;
        //     }
        //     return;
        // }

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