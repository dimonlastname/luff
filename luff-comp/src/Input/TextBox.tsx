import Luff, {React, IObservableStateSimple} from "luff";

import './TextBox.scss';
import InputBoxBase, {TInputValidResult} from "./_InputBoxBase";


type TProps = {
    value: IObservableStateSimple<string>;

    type?: string;
    className?: string;

    onClick?: (e: Luff.MouseEvent) => void;
    onChange?: (val?: string) => void;
    onKeyUp?: (e: Luff.KeyboardEvent) => void;
    onKeyDown?: (e: Luff.KeyboardEvent) => void;
    onKeyEnter?: () => void;
    onKeyEsc?: () => void;
    placeholder?: string;
    autocomplete?: string;
}
const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function validateEmail(email) {
    return regexEmail.test(String(email).toLowerCase());
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
    public IsInputValidDefault() : TInputValidResult {
        const { type, value } = this.props;
        if (type == TextBox.Type.Email && validateEmail(value.SValue.trim()) ) {
            return {
                IsValid: false,
                Message: 'Формат электронной почты неверен'
            };
        }
        // if (type == TextBox.Type.Text) {
        //     return value.SValue.trim().length > 0;
        // }
        if (type == TextBox.Type.Phone) {

        }
        if (value.SValue.trim().length == 0) {
            return {
                IsValid: false,
                Message: 'Поле не может быть пустым',
            }
        }
        return {
            IsValid: true,
            Message: ''
        };
    }
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
                   onClick={this.props.onClick}
                   onKeyUp={keyUpFn}
                   onKeyDown={this.props.onKeyDown}
                   placeholder={this.props.placeholder}
                   disabled={this._IsDisabled}
            />
        )

    }
}
___LuffGlobal.Inputs.TextBox = TextBox;
