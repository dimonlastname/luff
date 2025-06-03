import Luff, {React, IObservableStateSimple, Culture, State, IObservableOrValue} from "luff";
import './TextBox.scss';
import PeriodPicker from "../PeriodPicker/PeriodPicker";
import InputBoxBase, {TInputValidResult} from "./_InputBoxBase";


type TProps = {
    value: IObservableStateSimple<Date>;
    min?: IObservableOrValue<Date>;
    max?: IObservableOrValue<Date>;
    format?: string;
    formatTime?: string;
    isTimePick?: boolean;
    className?: IObservableOrValue<string>;
    onChange?: (val?: Date) => void;
    placeholder?: IObservableOrValue<string>;
}


export default class DateBox extends InputBoxBase<TProps> {
    static defaultProps = {
        className: '',
        placeholder: '',
        isPermissionWriteRequired: false,
        format: Culture.Current.DateFormat,
        formatTime: Culture.Current.DateFormatTime,
        isTimePick: false,
    };
    private isMinState;
    private isMaxState;
    private minSt;
    private maxSt;

    private get PeriodPicker() : PeriodPicker  {
        return ___LuffGlobal.PeriodPicker.GlobalSinglePicker;
    }

    protected BeforeBuild(): void {
        super.BeforeBuild();
        const {min, max} = this.props;

        this.isMinState = min instanceof State;
        this.isMaxState = max instanceof State;
        this.minSt = min as IObservableStateSimple<Date>;
        this.maxSt = max as IObservableStateSimple<Date>;
    }
    AfterBuild(): void {

    }
    public IsInputValidDefault() : TInputValidResult {
        const { value, min, max } = this.props;
        const v = value.SValue;

        if (min !== void 0 && v < min.valueOf()) {
            return {
                IsValid: false,
                Message: 'Дата меньше минимумального значения'
            };
        }
        if (max !== void 0 && v > max.valueOf()) {
            return {
                IsValid: false,
                Message: 'Дата больше максимального значения'
            };
        }
        return {
            IsValid: true,
            Message: ''
        };
    }

    private GetMin() : Date {
        if (this.isMinState) {
            return this.minSt.SValue;
        }
        return this.props.min as Date;
    }
    private GetMax() : Date {
        if (this.isMaxState) {
            return this.maxSt.SValue;
        }
        return this.props.max as Date;
    }


    CallDatePicker() : void {
        if (this._IsDisabled.SValue)
            return;
        const date = this.props.value.SValue;
        this.PeriodPicker.Run(date, date, dateStart => { this.props.value.SValue = dateStart.Date}, {
            dateMin: this.props.min ? Luff.Date(Luff.State.GetSValueOrValue(this.props.min)) : void 0,
            dateMax: this.props.max ? Luff.Date(Luff.State.GetSValueOrValue(this.props.max)) : void 0,
            isShowTimePick: this.props.isTimePick
        });
    }
    Render(): any {
        let isDisab = this._IsDisabled.SubState(isDis => isDis ? '': ' l-pointer');
        let classState = Luff.State.Concat("l-textbox", this.props.className, isDisab);

        return (
            <div className={classState}
                 classDict={{
                     disabled: this._IsDisabled
                 }}
                 onClick={() => this.CallDatePicker()}
            >
                {this.props.value.SubState(x => x ? Luff.Date(x).Format(this.props.format) : this.props.placeholder)}
            </div>
        )

    }
}
