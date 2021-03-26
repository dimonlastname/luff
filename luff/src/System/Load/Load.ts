import {ElementBase} from "../../Core/Components/ElementBase";
import {LuffLoadNative} from "./LoadNative";


type TLoadProps = {
    name: string;
    customSvg?: string;
    //zIndex?: number;
}

export class LuffLoad extends ElementBase<TLoadProps> {
    private _Load: LuffLoadNative;
    public Show() : void {
        this._Load.Show();
    }
    public Hide() : void {
        this._Load.Hide();
    }
    _GenerateDOM()  {
        super._GenerateDOM();
        this._Load = new LuffLoadNative({
            Target: this.ParentElement.GetFirstDOM(),
            CustomSvg: this.props.customSvg
        });
        this.DOM = (this._Load as any).DOM;
        return this.DOM;
    }
}