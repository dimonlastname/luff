import './Checkbox.scss';
import Luff, {React, IObservableStateSimple, TContentCtor} from "luff"

type CheckBoxProps = {
    checked?: IObservableStateSimple<boolean>;
    disabled?: IObservableStateSimple<boolean>;
    indeterminate?: IObservableStateSimple<boolean>;


    onChange?: (val?: boolean) => void;
    onChangeAsync?: (val?: boolean) => Promise<number>;
    checkBoxGroup?: string;
    className?: string;
    style?: Luff.AttributeStyleType<string>;
}

type TState = {
    IsChecked: boolean;
    IsDisabled: boolean;
    IsIndeterminate: boolean;
}

export default class CheckBox extends Luff.Content<CheckBoxProps, TState> {
    static defaultProps = {
        className: '',
        checked: false,
        disabled: false,
        indeterminate: false,
    };

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
                       disabled={this.State.IsDisabled}
                       indeterminate={this.State.IsIndeterminate}
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
                IsIndeterminate: this.props.indeterminate,
            }
        }
    }
}
