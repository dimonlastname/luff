import {IContent, React, ComponentSimple, IObservableStateSimple} from "luff";
import {IDisableSwitchable, initDisabled, TDisableSwitchableProps} from "./_DisableSwitchable";



export default class InputBoxBase<TProps> extends ComponentSimple<TProps & TDisableSwitchableProps>  implements IDisableSwitchable<TDisableSwitchableProps> {
    protected Input: HTMLInputElement;
    _IsDisabled: IObservableStateSimple<boolean>;

    protected BeforeBuild() : void {
        initDisabled(this);
    }

    get IsDisabled() : boolean {
        return this._IsDisabled.SValue;
    }
    set IsDisabled(val: boolean) {
        this._IsDisabled.SValue = val;
    }


    Focus() : void {
        this.Input.focus();
    }
    Select() : void {
        this.Input.select();
    }

    AfterBuild(): void {
        this.Input = this.GetFirstDOM() as HTMLInputElement;
    }
}