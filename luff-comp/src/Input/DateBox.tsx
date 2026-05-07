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

    hasRemoveButton?: boolean;
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
        let dateMin;
        let dateMax;
        if (this.props.min){
            const minVal = Luff.State.GetSValueOrValue(this.props.min);
            if (minVal){
                dateMin = Luff.Date(minVal);
            }
        }
        if (this.props.max){
            const minVal = Luff.State.GetSValueOrValue(this.props.max);
            if (minVal){
                dateMax = Luff.Date(minVal);
            }
        }

        this.PeriodPicker.Run(date, date, dateStart => {
            if (this.props.onChange) {
                this.props.onChange(dateStart.Date);
                return;
            }
            this.props.value.SValue = dateStart.Date
        }, {
            dateMin: dateMin,
            dateMax: dateMax,
            isShowTimePick: this.props.isTimePick
        });
    }
    Render(): any {
        const { className, onChange, hasRemoveButton } = this.props;

        let isDisab = this._IsDisabled.SubState(isDis => isDis ? '': ' l-pointer');
        let classState = Luff.State.Concat("l-textbox l-datebox", className, isDisab);

        const hasValue = this.props.value.SubState(v => v != null);
        const noValue = hasValue.SubState(s => !s);
        return (
            <div className={classState}
                 classDict={{
                     disabled: this._IsDisabled
                 }}
                 onClick={() => this.CallDatePicker()}
            >
                <div
                    className="l-datebox-value"
                    classDict={{
                        "__no-value": noValue
                    }}
                >
                    {this.props.value.SubState(x => x ? Luff.Date(x).Format(this.props.format) : this.props.placeholder)}
                </div>
                {
                    hasRemoveButton
                    &&
                    <div
                        className="l-datebox-remove-btn"
                        isVisible={hasValue}
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onChange){
                                onChange(null);
                                return;
                            }
                            this.props.value.SValue = null;
                        }}
                    />
                }
            </div>
        )

    }
}
