import Luff, {React, IObservableStateSimple, Culture, State} from "luff";
import './TextBox.scss';
import PeriodPicker from "../PeriodPicker/PeriodPicker";
import InputBoxBase from "./_InputBoxBase";


type TProps = {
    value: IObservableStateSimple<Date>;
    min?: Date | IObservableStateSimple<Date>;
    max?: Date | IObservableStateSimple<Date>;
    format?: string;
    formatTime?: string;
    isTimePick?: boolean;
    className?: string;
    onChange?: (val?: Date) => void;
    placeholder?: string;
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

    protected BeforeBuild(): void {
        super.BeforeBuild();
        const {min, max} = this.props;

        this.isMinState = min instanceof State;
        this.isMaxState = max instanceof State;
        this.minSt = min as IObservableStateSimple<Date>;
        this.maxSt = max as IObservableStateSimple<Date>;
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
        PeriodPicker.GlobalSinglePicker.Run(date, date, ((dateStart, dateFinish) => {
            if (this.props.onChange) {
                this.props.onChange(dateStart.Date);
                return;
            }
            this.props.value.SValue = dateStart.Date;
        }), {
            dateMin: this.props.min ? Luff.Date(this.GetMin()) : void 0,
            dateMax: this.props.max ? Luff.Date(this.GetMax()) : void 0,
            isShowTimePick: this.props.isTimePick
        });
    }
    Render(): any {
        let classState = this._IsDisabled.SubState(isDis => 'l-textbox ' + this.props.className + (isDis ? '': ' l-pointer'));
        let children = this.props.children;
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
            >
                {this.props.value.SubState(x => x ? Luff.Date(x).Format(this.props.format) : this.props.placeholder)}
            </div>
        )

    }
}
