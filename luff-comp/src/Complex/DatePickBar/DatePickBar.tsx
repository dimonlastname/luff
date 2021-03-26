import Luff, {React, IObservableStateSimple, LuffDate} from "luff";
import PeriodPicker from "../../PeriodPicker/PeriodPicker";

import "./DatePickBar.scss";

type TDateBarItemProps = {
    type: DatePresetType;
    isActive: IObservableStateSimple<boolean>;
    DateBar: DatePickBar;
}



class DateBarItem extends Luff.ComponentSimple<TDateBarItemProps> {
    Render(): any {
        const classState = this.props.isActive.SubState(isActive => "l-date-bar-item-value" + (isActive ? ' active' : ''));
        return (
            <div class="l-date-bar-item">
                <div
                    className={classState}
                    onClick={() => {
                        this.props.DateBar.DateType.SValue = this.props.type;
                        this.props.DateBar.Dates.SValue = getDatesByPreset(this.props.type, this.props.DateBar.Dates.SValue);
                        const dts = this.props.DateBar.Dates.map(x => x.Date);
                        this.props.DateBar.props.onChange(dts[0], dts[1]);
                    }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

enum DatePresetType {
    Today = 1,
    YToday = 2,
    Week = 3,
    Month = 4,
    Quarter = 5,
    Year = 6,
    Range = 7,
}

type TDatesPack = {
    DateStart: Date;
    DateFinish: Date;
}

function getDatesByPreset(type : DatePresetType, dates: LuffDate[] ) : LuffDate[] {
    let start: LuffDate = null;
    let end: LuffDate = null;

    switch (type) {
        case DatePresetType.Today:
            start = Luff.Date().DayStart;
            end = Luff.Date().DayEnd;
            break;
        case DatePresetType.YToday:
            start = Luff.Date().AddDays(-1).DayStart;
            end = Luff.Date().AddDays(-1).DayEnd;
            break;
        case DatePresetType.Week:
            start = Luff.Date().WeekStart;
            end = Luff.Date().WeekEnd;
            break;
        case DatePresetType.Month:
            start = Luff.Date().MonthStart;
            end = Luff.Date().MonthEnd;
            break;
        case DatePresetType.Quarter:
            start = Luff.Date().QuarterStart;
            end = Luff.Date().QuarterEnd;
            break;
        case DatePresetType.Year:
            start = Luff.Date().YearStart;
            end = Luff.Date().YearEnd;
            break;
        case DatePresetType.Range:
            start = dates[0].Clone().DayStart;
            end = dates[1].Clone().DayEnd;
    }
    return [start, end];
}


type TProps = {
    datesInit?: Date[];
    datesPresetType?: DatePresetType;
    //datesPack?: TDatesPack;
    onChange: (dateStart: Date, dateFinish: Date) => void;
    hasNoFuture?: boolean;
}
export default class DatePickBar extends Luff.Content<any, TProps> {
    static defaultProps = {
        hasNoFuture: true,
    };

    static DatePresetType = DatePresetType;

    private PeriodPicker: PeriodPicker;

    public DateType = Luff.State<DatePresetType>(DatePresetType.Range);
    public Dates = Luff.StateArr<Luff.Date>([]);

    protected BeforeBuild(): void {
        if (this.props.datesInit) {
            this.DateType.SValue = DatePresetType.Range;
            this.Dates.SValue = this.props.datesInit.map(x => Luff.Date(x));
        }
        else if (this.props.datesPresetType) {
            this.DateType.SValue = this.props.datesPresetType;
            this.Dates.SValue = getDatesByPreset(this.props.datesPresetType, this.Dates.SValue);
        }
    }
    protected AfterBuild(): void {
        this.PeriodPicker = this.GetComponentByName('PeriodPicker');
    }

    private RunPicker() {
        this.PeriodPicker.RunRange(this.Dates.map(x => x.Date));
    }
    Render(): any {
        const dateView = this.Dates.SubState(dates => {
            const dateStart = dates[0];
            const dateFinish = dates[1];
            if (!dateStart){
                return 'Выберите';
            }
            if (!dateFinish){
                return dateStart.Format("DD.MM.YYYY");
            }
            return `${dateStart.Format("DD.MM.YYYY")} — ${dateFinish.Format("DD.MM.YYYY")}`
        });
        let dateMax;
        if (this.props.hasNoFuture) {
            dateMax = Luff.Date().SetDayEnd();
        }
        return (
            <div class="l-date-bar">
                <PeriodPicker
                    dates={this.Dates.SValue}
                    dateMax={dateMax}
                    onChange={(dateStart, dateFinish) => {
                        this.DateType.SValue = DatePresetType.Range;
                        this.Dates.SValue = [
                            dateStart,
                            dateFinish
                        ];
                        this.props.onChange(dateStart.Date, dateFinish.Date);
                        //console.log('this.DateType.SValue', this.DateType.SValue)
                    }}
                />
                <div className="l-date-bar-item">
                    <div className="l-date-bar-item-value" onClick={() => this.RunPicker()}>
                        {dateView}
                    </div>
                </div>
                <DateBarItem DateBar={this} type={DatePresetType.YToday} isActive={this.DateType.SubState(t => t === DatePresetType.YToday)}>Вчера</DateBarItem>
                <DateBarItem DateBar={this} type={DatePresetType.Today} isActive={this.DateType.SubState(t => t === DatePresetType.Today)}>Сегодня</DateBarItem>
                <DateBarItem DateBar={this} type={DatePresetType.Week} isActive={this.DateType.SubState(t => t === DatePresetType.Week)}>Неделя</DateBarItem>
                <DateBarItem DateBar={this} type={DatePresetType.Month} isActive={this.DateType.SubState(t => t === DatePresetType.Month)}>Месяц</DateBarItem>
                <DateBarItem DateBar={this} type={DatePresetType.Quarter} isActive={this.DateType.SubState(t => t === DatePresetType.Quarter)}>Квартал</DateBarItem>
                <DateBarItem DateBar={this} type={DatePresetType.Year} isActive={this.DateType.SubState(t => t === DatePresetType.Year)}>Год</DateBarItem>
            </div>
        )
    }
}

