import Luff, {React, IObservableStateSimple} from "luff";

import './TextBox.scss';
import InputBoxBase from "./_InputBoxBase";


type TProps = {
    value: IObservableStateSimple<string>;

    type?: string;
    className?: string;

    onChange?: (val?: string) => void;
    onKeyUp?: (e: Luff.KeyboardEvent) => void;
    onKeyDown?: (e: Luff.KeyboardEvent) => void;
    onKeyEnter?: () => void;
    onKeyEsc?: () => void;
    placeholder?: string;
    autocomplete?: string;
}

export default class TextBox extends InputBoxBase<TProps> {
    DOM: HTMLInputElement;
    static Type = {
        Text: 'text',
        Email: 'email',
        Phone: 'tel'
    };
    static defaultProps = {
        type: TextBox.Type.Text,
        className: '',
        disabled: false,
        placeholder: '',
        isPermissionWriteRequired: false,
    };
    Render(): any {

        let keyUpFn;
        if (this.props.onKeyUp || this.props.onKeyEnter || this.props.onKeyEsc) {
            keyUpFn = e => {
                if (this.props.onKeyUp)
                    this.props.onKeyUp(e);
                if (this.props.onKeyEnter && e.keyCode === 13) {
                    this.props.onKeyEnter();
                }
                if (this.props.onKeyEsc && e.keyCode === 27) {
                    this.props.onKeyEsc();
                }
            }
        }

        return (
            <input type={this.props.type}
                   className={"l-textbox " + this.props.className}
                   value={this.props.value}
                   onChange={e => {
                       let value = e.target.value;
                       if (this.props.onChange) {
                           return this.props.onChange(value);
                       }
                       this.props.value.SValue = value;
                   }}
                   autocomplete={this.props.autocomplete}
                   onKeyUp={keyUpFn}
                   onKeyDown={this.props.onKeyDown}
                   placeholder={this.props.placeholder}
                   disabled={this._IsDisabled}
            />
        )

    }
}
___LuffGlobal.Inputs.TextBox = TextBox;
