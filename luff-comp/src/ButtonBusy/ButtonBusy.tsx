import Luff, {React, IObservableStateSimple} from "luff";

import './ButtonBusy.scss';


type TConformationWindow = {
    Caption: string;
    Message: string;
}

type ButtonBusyProps = {
    className?: string | IObservableStateSimple<string>;
    onClick: (e: MouseEvent) => Promise<any>;
    disabled?: IObservableStateSimple<boolean>;
    justLock?: boolean;

    useConformationWindow?: () => TConformationWindow;
    title?: string | IObservableStateSimple<string>;
}

const LOCK_PING_SENSITIVITY_MS = 50;


export default class ButtonBusy extends Luff.Content<ButtonBusyProps> {
    static defaultProps = {
        disabled: false,
        justLock: false
    };
    private Button: HTMLButtonElement;
    private TimeoutLock: number;

    protected AfterBuild(): void {
        this.Button = this.Components.AllByName['button'].DOM as HTMLButtonElement;
    }

    private Lock() {
        const btn = this.Button;
        btn.disabled = true;
        this.TimeoutLock = window.setTimeout(() => {
            if (!this.props.justLock)
                btn.classList.add('l-busy');
        }, LOCK_PING_SENSITIVITY_MS)
    }
    private UnLock(isBtnDisabled: boolean) {
        clearTimeout(this.TimeoutLock);
        const btn = this.Button;

        if (!this.props.disabled)
            btn.disabled = isBtnDisabled;
        else if (this.props.disabled && !this.props.disabled.SValue) {
            btn.disabled = false;
        }
        if (!this.props.justLock)
            btn.classList.remove('l-busy');
    }

    //private _btnRef: React.RefObject<HTMLButtonElement> = React.createRef();
    private _onClick(e: MouseEvent) {
        const wasBtnDisabled = this.Button.disabled;
        // btn.disabled = true;
        // if (!this.props.justLock)
        //     btn.classList.add('l-busy');
        this.Lock();

        let res: Promise<any>;
        if (!this.props.useConformationWindow){
            res = this.props.onClick(e);

        }
        else {
            const form = this.props.useConformationWindow();
            if (!form) {
                res = this.props.onClick(e);
            } else {
                res = Luff.RunConfirmPromise(form.Caption, form.Message, {
                    OnAgree: () => {
                        return this.props.onClick.call(this.ParentComponent, e);
                    }
                })
            }
        }

        const cb = () => {
            this.UnLock(wasBtnDisabled);
            // btn.disabled = isBtnDisabled;
            // if (!this.props.justLock)
            //     btn.classList.remove('l-busy');
        };
        res?.then(cb);
        res?.catch(cb)


    }
    private GetClassName() : any {
        const classNameDefault = this.props.justLock ? '':'l-button ';

        let className : string | IObservableStateSimple<string>;
        if (!this.props.className || typeof this.props.className === 'string') {
            className = classNameDefault + (this.props.className ? this.props.className : "");
        }
        else {
            className = this.props.className.SubState(c => classNameDefault + ' ' + c);
        }
        return className;
    }
    Click() : void {
        this._onClick(null);
    }
    Render() {
        let className;
        return (
            <button name="button"
                    className={this.GetClassName()}
                    onClick={e => this._onClick(e as any) }
                    disabled={this.props.disabled}
                    title={this.props.title}
            >{this.props.children}</button>
        )
    }
}

