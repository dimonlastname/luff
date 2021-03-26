import './Radio.scss';
import Luff, {React, TContentCtor, IObservableStateSimple, IObservableState, State} from "luff";

type TRadioButtonClick<T> = (e: Luff.MouseEvent<HTMLLabelElement>, radio?: RadioButton<T>) => void;
type RadioProps<T> = {
    currentValue: IObservableStateSimple<T>;
    value: T | IObservableStateSimple<T>;
    radioGroup?: string;


    disabled?: IObservableStateSimple<boolean>;
    indeterminate?: IObservableStateSimple<boolean>;
    onChange?: (val?: T) => void;
    onClick?: TRadioButtonClick<T>;
    className?: string;
}





export default class RadioButton<T> extends Luff.Content<RadioProps<T>> {
    static defaultProps = {
        className: '',
        state: Luff.State(-1),
        value: -1,
        disabled: false,
        indeterminate: false,
    };
    static GetRadioGroup() : string {
        return 'lrg-' + Luff.Number.GetID();
    }
    private GetRadioGroup() : string {
        if (this.props.radioGroup)
            return this.props.radioGroup;

        const currentState = this.props.currentValue as State;
        return `lrg-auto-` + currentState._ID;
    }

    private _IsChecked = this.props.currentValue.SubState(c => c === this.GetRadioValue(), [this.props.value as any]);


    private _IsDisabled = Luff.State<boolean>(this.props.disabled as any);
    private _IsIndeterminate = Luff.State<boolean>(this.props.indeterminate as any);
    get IsChecked() : boolean {
        return this._IsChecked.SValue;
    }
    // set IsChecked(val: boolean) {
    //     this.State.IsChecked.SValue = val;
    // }
    get IsDisabled() : boolean {
        return this._IsDisabled.SValue;
    }
    set IsDisabled(val: boolean) {
        this._IsDisabled.SValue = val;
    }
    get IsIndeterminate() : boolean {
        return this._IsIndeterminate.SValue;
    }
    set IsIndeterminate(val: boolean) {
        this.State.IsIndeterminate.SValue = val;
    }
    private GetOnClick(): Luff.MouseEventHandler {
        if (!this.props.onClick)
            return void 0;
        return (e: Luff.MouseEvent<HTMLLabelElement>) => {
            this.props.onClick(e, this);
        }
    }
    private GetRadioValue() : T {
        const val = this.props.value;
        return val.valueOf() as T; //.valueOf() of Luff.State is equal .SValue
    }

    Render(): Luff.Node {
        let onClick;
        if (this.props.onClick) {
            onClick = (e) => {
                this.props.onClick(e, this);
            }
        }
        return (
            <>
                <input type='radio'
                       className="l-radio"
                       id={"l-radio-id-" + this._ID}
                       //radioGroup={this.GetRadioGroup()}
                       name={this.GetRadioGroup()}

                       onChange={(e) => {
                           const isChecked = e.target.checked;
                           const radioValue = this.GetRadioValue();
                           e.target.checked = !isChecked; //prevent value;
                           if (this.props.onChange) {
                               return this.props.onChange(radioValue);
                           }
                           this.props.currentValue.SValue = radioValue;
                       }}
                       checked={this._IsChecked}
                       disabled={this._IsDisabled}
                       indeterminate={this._IsIndeterminate}
                />
                <label
                    for={"l-radio-id-" + this._ID}
                    className={"l-radio-label " + this.props.className}
                    onClick={this.GetOnClick()}
                >{this.props.children}</label>
            </>
        )
    }
}
