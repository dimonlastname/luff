import {TRawComponent} from "./IElement";
import {StateSingle} from "../State";
import {CasualMountingBase} from "./CasualMountingBase";

function decodeHtmlEntities(text: string) {
    let testArea = document.createElement("textarea");
    testArea.innerHTML = text;
    return testArea.value;
}
class CasualTextComponent extends CasualMountingBase {
    _NodeValue: string;
    _NodeValueGetter: () => any = null;
    _IsDynamic : boolean = false;

    _CompileNodeValue() : void {
        if (this._RawComponent){
            const nodeValue = this._RawComponent.Attributes['textNode'];
            if (nodeValue instanceof StateSingle) {
                this._IsDynamic = true;
                let state: StateSingle = this._RawComponent.Attributes['textNode'] as StateSingle;
                this._NodeValueGetter = () => {
                    return state.SValue;
                };
                //if (!this._IsChildOfEach)
                state._AddOnChange(() => {
                    this.Refresh();
                });
            }
            else if (Array.isArray(nodeValue)) { // when Array.map in JSX html
                //impossible for textNode
                console.error("[Luff] array has been passed as text component value \n", nodeValue, this);
            }
            else { // just text
                this._NodeValue = nodeValue;
            }
        }
    }

    _GenerateDOM() : HTMLElement {
        super._GenerateDOM();
        if (this._IsDynamic) {
            this._NodeValue = this._NodeValueGetter();
        }
        if (this._NodeValue === void 0 || this._NodeValue === null)
            this._NodeValue = '';

        this.DOM = <any>document.createTextNode(this._NodeValue);
        return this.DOM;

    }


    Refresh() : void {
        if (!this.DOM) //if state updated before first render called
            return;
        if (!this._IsDynamic)
            return;

        let newValue = this._NodeValueGetter();
        if (newValue === void 0 || newValue === null)
            newValue = '';

        if (this._NodeValue !== newValue || typeof newValue === 'object'){
            this._NodeValue = newValue;
            this.DOM.nodeValue = newValue;
        }
    }
    constructor(rawComponent: TRawComponent){
        super(rawComponent);
        this._CompileNodeValue();
    }
}

export {CasualTextComponent}