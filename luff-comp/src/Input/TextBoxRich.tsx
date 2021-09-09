import Luff, {React, IObservableStateSimple} from "luff";

import './TextBox.scss';
import InputBoxBase, {TInputValidResult} from "./_InputBoxBase";


type TProps = {
    value: IObservableStateSimple<string>;
    className?: string;
    onChange?: (val?: string) => void;
    placeholder?: string;

    onKeyUp?: (e: Luff.KeyboardEvent) => void;
    onKeyDown?: (e: Luff.KeyboardEvent) => void;
    onKeyEnter?: () => void;
    onKeyEsc?: () => void;
}

export default class TextBoxRich extends InputBoxBase<TProps> {
    static defaultProps = {
        className: '',
        placeholder: '',
        isPermissionWriteRequired: false,
    };

    public IsInputValidDefault() : TInputValidResult {
        const { value } = this.props;
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
            <textarea
                   class={"l-textbox l-textarea " + this.props.className}
                   value={this.props.value}
                   onChange={e => {
                       let value = e.currentTarget.value;
                       if (this.props.onChange) {
                           return this.props.onChange(value);
                       }
                       this.props.value.SValue = value;
                   }}
                   onKeyUp={keyUpFn}
                   onKeyDown={this.props.onKeyDown}
                   placeholder={this.props.placeholder}
                   disabled={this._IsDisabled as any}
            />
        )

    }
}
