import Luff, {React, IObservableStateSimple, IObservableOrValue, IObservableState, Dict} from "luff";

import './TextBox.scss';
import InputBoxBase, {TInputValidResult} from "./_InputBoxBase";

type Char = '!'|'"'|'#'|'$'|'%'|'&'|"'"|'('|')'|'*'|'+'|','|'-'|'.'|'/'|'0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|':'|';'|'<'|'='|'>'|'?'|'@'|'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z'|'['|'\\'|']'|'^'|'_'|'`'|'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'|'{'|'|'|'}'|'~';

export type TInputMask = {
    Mask: string;
    AcceptRegex?: string; //default: numbers only
    SlotChar?: Char; //default: "_"
}

type TProps = {
    value: IObservableStateSimple<string>;

    mask?: IObservableOrValue<TInputMask>;
    type?: string;
    className?: string;
    classDict?: Dict<IObservableStateSimple<boolean>>;

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

    AfterBuild(): void {
        super.AfterBuild();
        this.InitMask();
    }
    public static IsValidEmail(text: string) : boolean {
        return validateEmail(text.trim());
    }

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


    private IsMasking = false;
    private CheckMask: () => string;
    private Clean: (input: any) => any;
    private MaskPackState: IObservableState<TInputMask>;
    private pattern;
    private slot;
    private accept;
    private prev;
    private first;
    private back;
    private InitFuck() {
        const maskPack = this.MaskPackState.SValue;

        this.pattern = maskPack.Mask;
        this.slot = maskPack.SlotChar || "_";
        this.accept = new RegExp(maskPack.AcceptRegex || "\\d", "g");
        this.prev = (j => Array.from(this.pattern, (c,i) => c == this.slot? j = i + 1: j))(0);
        this.first = [...this.pattern].findIndex(c => c == this.slot);

        this.DOM.placeholder = this.pattern;
    }
    private InitMask() {
        if (this.props.mask) {
            this.IsMasking = true;

        }
        const el = this.DOM;
        if (this.IsMasking) {
            this.MaskPackState = Luff.State<TInputMask>(this.props.mask as any);
            this.MaskPackState.SValue = {
                AcceptRegex: "\\d",
                SlotChar: "_",
                ...this.MaskPackState.SValue
            };
            this.MaskPackState.AddOnChange(() => {
                this.InitFuck();
                this.props.value.SValue = this.CheckMask();
            });

            this.IsMasking = true;

            this.InitFuck();


            this.Clean = input => {
                input = input.match(this.accept) || [];
                return Array.from(this.pattern, c =>
                    input[0] === c || this.slot == c ? input.shift() || c : c
                );
            };
            this.CheckMask = () => {
                const [i, j] = [el.selectionStart, el.selectionEnd].map(i => {
                    i = this.Clean(el.value.slice(0, i)).findIndex(c => c == this.slot);
                    return i < 0 ? this.prev[this.prev.length-1]: this.back? this.prev[i-1] || this.first: i;
                });
                el.value = this.Clean(el.value).join('');
                el.setSelectionRange(i, j);
                this.back = false;
                return el.value;
            };
            this.back = false;
        }

        el.addEventListener("keydown", (e) => {
            if (this.IsMasking) {
                this.back = e.key === "Backspace";
            }
            if (this.props.onKeyDown)
                this.props.onKeyDown(e as Luff.KeyboardEvent);

        });
        el.addEventListener("input", () => {
            if (this.IsMasking) {
                this.CheckMask();
            }

            let value = el.value;
            if (this.props.onChange) {
                return this.props.onChange(value);
            }
            this.props.value.SValue = value;
        });

        if (this.IsMasking) {
            el.addEventListener("focus", () => {
                this.IsMasking && this.CheckMask();
            });
            el.addEventListener("blur", () => el.value === this.pattern && (el.value=""));
        }
    }

    Render(): Luff.Node {

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
                   classDict={this.props.classDict}
                   value={this.props.value}
                   autocomplete={this.props.autocomplete}
                   onClick={this.props.onClick}
                   onKeyUp={keyUpFn}
                   placeholder={this.props.placeholder}
                   disabled={this._IsDisabled}
            />
        )

    }
}
___LuffGlobal.Inputs.TextBox = TextBox;
