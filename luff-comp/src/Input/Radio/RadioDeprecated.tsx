import './Radio.scss';
import Luff, {React, TContentCtor, IObservableStateSimple  } from "luff";


type RadioProps = {
    checked?: IObservableStateSimple<boolean>;
    disabled?: IObservableStateSimple<boolean>;
    indeterminate?: IObservableStateSimple<boolean>;


    onChange?: (val?: boolean) => void;
    radioGroup: string;
    defaultChecked?: boolean;
    className?: string;
}

type TState = {
    IsChecked: boolean;
    IsDisabled: boolean;
    IsIndeterminate: boolean;
}

class LuffRadio extends Luff.Content<RadioProps, TState> {
    static defaultProps = {
        className: '',
        checked: false,
        disabled: false,
        indeterminate: false,
    };
    static GetRadioGroup() : string {
        return 'lrg-' + Luff.Number.GetID();
    }

    get IsChecked() : boolean {
        return this.State.IsChecked.SValue;
    }
    set IsChecked(val: boolean) {
        this.State.IsChecked.SValue = val;
    }
    get IsDisabled() : boolean {
        return this.State.IsDisabled.SValue;
    }
    set IsDisabled(val: boolean) {
        this.State.IsDisabled.SValue = val;
    }
    get IsIndeterminate() : boolean {
        return this.State.IsIndeterminate.SValue;
    }
    set IsIndeterminate(val: boolean) {
        this.State.IsIndeterminate.SValue = val;
    }
    Render(): any {
        return (
            <>
                <input type='radio' className="l-radio" id={"l-radio-id-" + this._ID}
                       radioGroup={this.props.radioGroup}
                       name={this.props.radioGroup}
                       onChange={(e) => {
                           const isChecked = e.target.checked;
                           e.target.checked = !isChecked; //prevent value;
                           if (this.props.onChange) {
                               return this.props.onChange(isChecked);
                           }
                           this.State.IsChecked.SValue = isChecked;
                       }}
                       checked={this.State.IsChecked as any}
                       disabled={this.State.IsDisabled as any}
                       indeterminate={this.State.IsIndeterminate}
                />
                <label
                    for={"l-radio-id-" + this._ID}
                    className={"l-radio-label " + this.props.className}
                >{this.props.children}</label>
            </>
        )

    }
    Ctor(): TContentCtor {

        return {

            State: {
                IsChecked: this.props.checked,
                IsDisabled: this.props.disabled,
                IsIndeterminate: this.props.indeterminate,

            }
        }
    }
}