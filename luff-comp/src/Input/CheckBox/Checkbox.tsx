import './Checkbox.scss';
import Luff, {React, IObservableStateSimple, TContentCtor, IObservableStateSimpleOrValue} from "luff"
import {IDisableSwitchable, initDisabled, TDisableSwitchableProps} from "../_DisableSwitchable";

type CheckBoxProps = {
    checked?: IObservableStateSimple<boolean>;

    onChange?: (val?: boolean) => void;
    onChangeAsync?: (val?: boolean) => Promise<number>;
    checkBoxGroup?: string;
    className?: string;
    style?: Luff.AttributeStyleType<string>;

} & TDisableSwitchableProps

type TState = {
    IsChecked: boolean;
    //IsDisabled: boolean;
    IsIndeterminate: boolean;
}

export default class CheckBox extends Luff.Content<CheckBoxProps, TState> implements IDisableSwitchable<CheckBoxProps> {
    static defaultProps = {
        className: '',
        checked: false,
        disabled: false,
        indeterminate: false,
        isPermissionWriteRequired: false,
    };

    _IsDisabled: IObservableStateSimple<boolean>;



    get IsChecked() : boolean {
        return this.State.IsChecked.SValue;
    }
    set IsChecked(val: boolean) {
        this.State.IsChecked.SValue = val;
    }
    // get IsDisabled() : boolean {
    //     return this.State.IsDisabled.SValue;
    // }
    // set IsDisabled(val: boolean) {
    //     this.State.IsDisabled.SValue = val;
    // }
    get IsDisabled() : boolean {
        return this._IsDisabled.SValue;
    }
    set IsDisabled(val: boolean) {
        this._IsDisabled.SValue = val;
    }

    protected BeforeBuild(): void {
        initDisabled(this);
    }

    Render(): Luff.Node {
        return (
            <>
                <input type='checkbox'
                       className="l-checkbox"
                       id={"l-checkbox-id-" + this._ID}
                       //checkboxGroup={this.props.radioGroup}
                       name={this.props.checkBoxGroup}
                       onChange={(e) => {
                           const isChecked = e.target.checked;
                           e.target.checked = !isChecked; //prevent value;
                           if (this.props.onChangeAsync) {
                               const wasDisabled = this.IsDisabled;
                               this.IsDisabled = true;
                               this.props.onChangeAsync(isChecked)
                                   .finally(() => this.IsDisabled = wasDisabled);
                               return;
                           }
                           if (this.props.onChange) {
                               return this.props.onChange(isChecked);
                           }
                           this.State.IsChecked.SValue = isChecked;
                       }}
                       checked={this.State.IsChecked}
                       disabled={this._IsDisabled}
                       indeterminate={this.State.IsChecked.SubState(isChecked => isChecked === void 0 || isChecked === null)}
                />
                <label
                    for={"l-checkbox-id-" + this._ID}
                    className={"l-checkbox-label " + this.props.className}
                    style={this.props.style}
                >{this.props.children}</label>
            </>
        )

    }
    Ctor(): TContentCtor {
        return {
            State: {
                IsChecked: this.props.checked,
                IsDisabled: this.props.disabled,
            }
        }
    }
}
