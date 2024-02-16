import {TPropsDefault} from "./IElement";
import {CasualMountingBase} from "./CasualMountingBase";

type TRProps = {
    html: HTMLElement;
} & TPropsDefault;

export class RawHtmlComponent extends CasualMountingBase<TRProps>  {
    _Dismount() : void {
        this._IsMount = false;
        this.DOM.remove();
    }

    _GenerateDOM() {
        this._GenerateDOM = null;
        this.DOM = this.props.html;
        return this.DOM;
    }
}