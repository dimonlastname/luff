import Luff, {React, IObservableStateSimple, Culture, IObservableOrValue} from "luff";
import './TextBox.scss';
import PeriodPicker from "../PeriodPicker/PeriodPicker";
import InputBoxBase, {TInputValidResult} from "./_InputBoxBase";



type TProps = {
    dateStart: IObservableStateSimple<Date>;
    dateFinish: IObservableStateSimple<Date>;
    min?: IObservableOrValue<Date>;
    max?: IObservableOrValue<Date>;
    formatTime?: string;
    formatDate?: string;
    className?: string;
    onChange?: (dateStart?: Date, dateFinish?: Date) => void;
    placeholder?: IObservableOrValue<string>;
    isTimePick?: boolean;
    noValueCaption?: string;
}


export default class DateBoxRange extends InputBoxBase<TProps> {
    static defaultProps = {
        formatDate: Culture.Current.DateFormat,
        formatTime: Culture.Current.DateFormatTime,
        className: '',
        placeholder: '',
        isPermissionWriteRequired: false,
        isTimePick: false,
        noValueCaption: 'выберите период',
    };
    CallDatePicker() : void {
        if (this._IsDisabled.SValue)
            return;
        const dateStart = this.props.dateStart.SValue;
        const dateFinish = this.props.dateFinish.SValue;
        PeriodPicker.GlobalRangePicker.RunRange([dateStart, dateFinish], ((dateStart, dateFinish) => {
            if (this.props.onChange) {
                this.props.onChange(dateStart.Date, dateFinish.Date);
                return;
            }
            this.props.dateStart.SValue = dateStart.Date;
            this.props.dateFinish.SValue = dateFinish.Date;
        }), {
            dateMin: this.props.min ? Luff.Date(Luff.State.GetSValueOrValue(this.props.min)) : void 0,
            dateMax: this.props.max ? Luff.Date(Luff.State.GetSValueOrValue(this.props.max)) : void 0,
            isShowTimePick: this.props.isTimePick,
        });
        //console.log('[Luff.DateBox] TODO DatePicker max min');
    }

    public IsInputValidDefault() : TInputValidResult {
        const { dateStart, dateFinish, min, max } = this.props;

        if (!dateStart) {
            return {
                IsValid: false,
                Message: 'Дата начала не указана'
            }
        }
        if (!dateFinish) {
            return {
                IsValid: false,
                Message: 'Дата конца не указана'
            };
        }
        if (min !== void 0 && dateStart.SValue.valueOf() < min.valueOf()) {
            return {
                IsValid: false,
                Message: 'Дата начала меньше минимального значения'
            };
        }
        if (max !== void 0 && dateFinish.SValue.valueOf() > max.valueOf()) {
            return {
                IsValid: false,
                Message: 'Дата конца больше максимального значения'
            };
        }
        return {
            IsValid: true,
            Message: ''
        };
    }

    Render(): any {
        let classState = this._IsDisabled.SubState(isDis => 'l-textbox ' + this.props.className + (isDis ? '': ' l-pointer'));
        const formatFull = `${this.props.formatDate} ${this.props.formatTime}`;

        return (
            <div className={classState}
                 onClick={() => this.CallDatePicker()}
                 //value={this.props.value}
                 // onChange={e => {
                 //       let value = e.target.value;
                 //       if (this.props.onChange) {
                 //           return this.props.onChange(value);
                 //       }
                 //       this.props.value.SValue = value;
                 //   }}
            >{this.props.dateStart.SubState(dateStart => {
                const dateFinish = this.props.dateFinish.SValue;
                if (!dateFinish) {
                    return this.props.noValueCaption;
                }
                if (dateStart && dateFinish) {
                    let luffDateStart = Luff.Date(dateStart);
                    let luffDateFinish = Luff.Date(dateFinish);

                    if (luffDateStart.IsSameDate(luffDateFinish)) {
                        return `${luffDateStart.Format(this.props.formatDate)} с ${luffDateStart.Format(this.props.formatTime)} по ${luffDateFinish.Format(this.props.formatTime)}`;
                    }

                    return `${luffDateStart.Format(formatFull)} — ${luffDateFinish.Format(formatFull)}`

                }
                return this.props.placeholder;
            }, [this.props.dateFinish])}</div>
        )

    }
}
