import Luff, {
    React,
    TContentCtor,
    luffDate,
    LuffDate,
    LibraryDOM,
    Culture,
    LibraryNumber,
    IObservableStateArray, IObservableStateSimple, IObservableOrValue
} from "luff";

import PPMonthQuarterYear from "./Parts/PPMonthQuarterYear";
import PPRange from "./Parts/PPRange";

import "./PeriodPicker.scss";
import ComboBox from "../Input/ComboBox/ComboBox";

type TDateNavigation = {
    IsShowMonthSelect?: boolean;
    YearRange?: number[];
}
export type TPeriodPickerOnChange = (dateStart: LuffDate, dateFinish?: LuffDate) => void;

enum TimePickerResolution {
    Hour = 0,
    Minute = 1,
    Second = 2,
    Millisecond = 3,
}

type TPeriodPickerProps = {
    onChange: TPeriodPickerOnChange
    dates?: LuffDate[],
    isMicroMode?: boolean;

    /* <for isMicroMode=true>: */
    isMonthSelection?: boolean;
    isQuarterSelection?: boolean; //if true, isMonthSelection will be ignored;
    isYearSelection?: boolean;
    /* <for isMicroMode/> */

    //////

    navigationDate?: LuffDate;

    // DateTarget?: LuffDate;
    // DateRange?: LuffDate[];
    forbiddenDates?: IObservableStateArray<LuffDate>;
    // DatesDayOff?: Date[] | LuffDate[];
    //
    dateMin?: IObservableOrValue<LuffDate>;
    dateMax?: IObservableOrValue<LuffDate>;
    cells?: number[];
    //
    // Format?: string;
    navigation?: TDateNavigation;
    //
    // IsDirectConfirm?: boolean;
    // IsDirectConfirmClosesPicker?: boolean;
    //
    // IsTargetImmutable?: boolean;
    isOnlyDay?: boolean;
    isDirectConfirm?:boolean;
    // IsMonthPickerMode?: boolean;
    isShowWeekDays?: boolean;
    isShowWeekSelector?: boolean;
    isFullscreenButton?: boolean

    isShowTimePick?: boolean;
    timePickerResolution?: number;
    timePickerMinuteStep?: number;

    // IsShowNavigationArrows?: boolean;
    // IsShowButtonConfirm?: boolean;
    // IsShowButtonFullscreen?: boolean;
    // IsFullscreen?: boolean;
    // IsBuildInMode?: boolean;
    //
    //
    // FirstDayOfWeek?: number;
}
type TPeriodPickerPropsCall = {
    dateMin?: LuffDate;
    dateMax?: LuffDate;
    cells?: number[];
    isShowTimePick?: boolean;
}

type TPeriodPickerState = {
    NavigationDate: LuffDate;
    MonthRows: TMonthRow[];
    IsFullscreen: boolean;

}
type TMonthRow = {
    MonthBlocks: TMonthBlock[];
}
type TMonthBlock = {
    DateValue: LuffDate;
    MonthName: string;
    MonthWeeks: TMonthWeek[];
    IsDeny: boolean;
}
type TMonthWeek = {
    DateValue: LuffDate;
    WeekSelectorVisible: string;
    IsDeny: boolean;
    Days: TDay[];
}
type TDay = {
    DateValue: LuffDate;
    DayValue: string;
    DayType: string
    IsDayOff: boolean;
    IsDayDeny: boolean;
}
type TSelection = {
    DateStart: LuffDate,
    DateFinish: LuffDate
}

const dateTimeDelegateView = i => (String(i).length == 2) ? i : '0' + i;

class PeriodPicker extends Luff.Content<TPeriodPickerProps, TPeriodPickerState> {
    static defaultProps : TPeriodPickerProps = {
        onChange: () => {},
        //dates?: LuffDate[],
        //navigationDate: luffDate(),
        // navigation: {
        //
        // },
        isMicroMode: false,


        cells: [1, 3],

        ////////
        //Target: void 0,
        //DateRange: [void 0, void 0],
        //DatesDayOff: [],
        //DatesForbidden: [],
        forbiddenDates: Luff.StateArr([]),
        //DateTarget: new LuffDate(new Date()),
        //FirstDayOfWeek: 0,
        //Format: Culture.Current.DateFormat,
        //IsBuildInMode: false,
        //isDirectConfirm: false,
        //isDirectConfirmClosesPicker: false,
        //isFullscreen: false,
        //isMonthPickerMode: false,
        isOnlyDay: false,
        isDirectConfirm: false,
        isFullscreenButton: true,
        //isShowButtonConfirm: true,

        //isShowNavigationArrows: true,
        //isShowTimePick: false,
        isShowWeekDays: true,
        isShowWeekSelector: true,
        //isTargetImmutable: false,
        navigation: {
            IsShowMonthSelect: true,
            YearRange: [1900, luffDate().Year + 5]
        },
        isShowTimePick: false,
        timePickerMinuteStep: 1,
        timePickerResolution: TimePickerResolution.Minute,
    };
    static WeekEndDays : number[] = [6 ,7];
    static TimePickerResolution = TimePickerResolution;
    static GlobalSinglePicker : PeriodPicker;
    static GlobalRangePicker : PeriodPicker;

    private _CurrentSelection = Luff.State<TSelection>({
        DateStart: void 0,
        DateFinish: void 0
    });
    private _CurrentCells: number[];
    private _IsShowTimePicker = Luff.State(false);
    private _TimePickerResolution = Luff.State(TimePickerResolution.Minute);
    private _TimePickerMinuteStep = Luff.State(1);


    _PropsUpdate() {
        this._IsShowTimePicker.SValue = this.props.isShowTimePick;
        this._TimePickerResolution.SValue = this.props.timePickerResolution;
        this._TimePickerMinuteStep.SValue = this.props.timePickerMinuteStep;
    }

    protected AfterBuild(): void {
        //this.props.forbiddenDates.AddOnChange(() => this._Redraw()); //commented cuz redraws on show;
    }

    BeforeBuild(): void {
        this._PropsUpdate();


        const dates = this.props.dates;
        //console.log('[PeriodPicker.Ctor] dates: ', dates.map(x => x.Format()));
        //selected dates default:
        if (dates) {
            let ds = dates[0].Clone();
            let df = dates[1].Clone();
            this._CurrentSelection.DateStart.SValue = ds;
            //this._CurrentSelection.DateFinish = df;
            this._CurrentSelection.DateFinish.SValue = this.props.isOnlyDay ? ds.SetDayEnd() : df;
        }
        if (!this.props.navigationDate && dates) {
            this.State.NavigationDate.SValue = dates[0].Clone();
        }
        // if (!this.props.navigationDate) {
        //     this.State.NavigationDate = luffDate();
        // }
        this._CurrentCells = this.props.cells;
        this.State.MonthRows.SValue = this._GenerateData();

        this._CurrentSelection.AddOnChange(() => {
            this.State.MonthRows.SValue = this._GenerateData();
        })

        // this.State.NavigationDate.AddOnChange(() => {
        //     this.State.MonthRows.SValue = this._GenerateData();
        // })
    }

    private _Redraw() {
        this.State.MonthRows.SValue = this._GenerateData();

    }
    private _SetNavDate(navDate: LuffDate) {
        this.State.NavigationDate.SValue = navDate;
        this.State.MonthRows.SValue = this._GenerateData();
    };

    public Run(dateValue: Date, dateTarget: Date, onChange: TPeriodPickerOnChange, options?: TPeriodPickerPropsCall) {
        this.props = {
            ...this.props,
            ...options,
        };
        //this._IsShowTimePicker.SValue = this.props.isShowTimePick === true;
        this._PropsUpdate();
        this._SetNavDate(Luff.Date(dateTarget));
        if (dateValue) {
            this._CurrentSelection.SValue = {
                DateStart: Luff.Date(dateValue),
                DateFinish: Luff.Date(dateValue)
            };
        } else {
            this._CurrentSelection.SValue = {
                DateStart: void 0,
                DateFinish: void 0
            };
        }
        if (onChange)
            this.props.onChange = onChange;
        this.Show();
    }
    public RunRange(dateValues: Date[], onChange?: TPeriodPickerOnChange, options?: TPeriodPickerPropsCall) {
        this.props = {
            ...this.props,
            ...options,
        };
        //this._IsShowTimePicker.SValue = this.props.isShowTimePick === true;
        this._PropsUpdate();
        if (dateValues) {
            this._SetNavDate(Luff.Date(dateValues[0]));
            this._CurrentSelection.SValue = {
                DateStart: Luff.Date(dateValues[0]),
                DateFinish: Luff.Date(dateValues[1])
            };
        } else {
            this._CurrentSelection.SValue = {
                DateStart: void 0,
                DateFinish: void 0
            };
        }
        if (onChange)
            this.props.onChange = onChange;
        this.Show();
    }


    private _CheckSelection() {
        if (this._CurrentSelection.DateFinish.SValue === void 0)
            return;
        let current = this._CurrentSelection.SValue;
        let dateStart = current.DateStart;
        let dateEnd   = current.DateFinish;
        if (dateEnd && dateStart.Date > dateEnd.Date) {
            let temp = dateStart;
            dateStart = dateEnd;
            dateEnd = temp;
            this._CurrentSelection.DateStart.SValue  = dateStart.DayStart;
            this._CurrentSelection.DateFinish.SValue = dateEnd.DayEnd;
        }
        const dateMin = Luff.State.GetSValueOrValue(this.props.dateMin);
        const dateMax = Luff.State.GetSValueOrValue(this.props.dateMax);

        if (dateMin && dateEnd < dateMin.DayStart || dateMax && dateStart > dateMax.DayEnd){
            this._CurrentSelection.DateStart.SValue = void 0;
            this._CurrentSelection.DateFinish.SValue = void 0;
            return;
        }
        if (dateMin && dateStart < dateMin){
            this._CurrentSelection.DateStart.SValue = dateMin.Clone();
        }
        if (dateMax && dateEnd > dateMax){
            this._CurrentSelection.DateFinish.SValue = dateMax.Clone();
        }

        // if (!this.props.isShowTimePick){
        //     dateStart.SetDayStart();
        //     dateEnd.SetDayEnd();
        // }
        // dateStart.SetDayStart();
        // if (dateEnd) {
        //     dateEnd.SetDayEnd();
        // }


        // if (this._IsShowTimePicker.SValue && this.props.dateMin && dateStart.IsSameDate(this.props.dateMin) && dateStart.Date < this.props.dateMin.Date){
        //     dateStart.CopyTime(this.props.dateMin);
        // }
        // if (this._IsShowTimePicker.SValue && this.props.dateMax && dateEnd && dateEnd.IsSameDate(this.props.dateMax) && dateStart.Date > this.props.dateMax.Date){
        //     dateEnd.CopyTime(this.props.dateMax);
        // }
        const timeMinuteStep = this._TimePickerMinuteStep.SValue;
        if (timeMinuteStep > 1 && dateEnd){
            dateStart.SetMinutes(LibraryNumber.RoundBy(dateStart.Minutes, timeMinuteStep, 'floor'));
            dateStart.SetSeconds(0);
            dateStart.SetMilliseconds(0);
            dateEnd.SetMinutes(LibraryNumber.RoundBy(dateEnd.Minutes, timeMinuteStep, 'floor'));
            dateEnd.SetSeconds(0);
            dateEnd.SetMilliseconds(0);
        }
    };
    private _CheckSelectionAndDirectConfirm() {
        this._CheckSelection();
        if (this.props.isDirectConfirm && this._CurrentSelection.DateFinish.SValue) {
            this._Confirm();
        }
        // if (PP._State.Settings.Con && this.State.CurrentSelection.DateFinish !== void 0){
        //     this.Confirm(!isBuildIn);
        // }
        this._Redraw();
    }
    private _TryConfirm() {
        if (this._CurrentSelection.DateFinish.SValue) {
            this.props.onChange(this._CurrentSelection.DateStart.SValue.Clone(), this._CurrentSelection.DateFinish.SValue.Clone());
            this.Hide();
        }
    }
    private _Confirm(){
        this.props.onChange(this._CurrentSelection.DateStart.SValue.Clone(), this._CurrentSelection.DateFinish.SValue.Clone());
    }
    private _GenerateMonth(Date: LuffDate) : TMonthBlock {
        let MonthBlock : TMonthBlock = {
            DateValue: Date.Clone().SetMonthStart(),
            MonthName: Date.Format('MMMM YYYY'),
            MonthWeeks: [],
            IsDeny: false,
        };
        let cursor = luffDate('01.'+Date.Format('MM.YYYY'));
        let CurrentWeek : TMonthWeek = {
            WeekSelectorVisible: this.props.isShowWeekSelector ?  '':'none',
            DateValue: cursor.Clone().SetWeekStart(),
            Days: [],
            IsDeny: false,
        };
        //let current = this.State.CurrentSelection.SValue;
        let current = this._CurrentSelection.SValue;
        const dateMin = Luff.State.GetSValueOrValue(this.props.dateMin);
        const dateMax = Luff.State.GetSValueOrValue(this.props.dateMax);

        const forbidden =  this.props.forbiddenDates.SValue;
        while (cursor.Month === Date.Month){
            const dayOfWeek = cursor.DayOfWeek;
            let isDeny = false;
            let DayType = '';
            //check for deny
            if (forbidden.find(x => x.IsSameDate(cursor))) {
                DayType = 'l-pp-deny';
            }
            if ( (dateMin && cursor < dateMin.DayStart ) || (dateMax && cursor > dateMax.DayEnd ) ){
                DayType = 'l-pp-deny';
                isDeny = true;
            }
            //check for select
            if (!isDeny
                && current.DateStart
                && current.DateFinish
                && cursor >= current.DateStart.DayStart  && cursor <= current.DateFinish.DayEnd
            /*&& (PP.Settings.isDirectConfirm || PP.Settings.isOneDaySelection )*/){
                DayType =  'l-pp-selected';
            }
            if (!isDeny
                && !this.props.isOnlyDay
                && current.DateStart && current.DateFinish === void 0
                && cursor >= current.DateStart.DayStart && cursor <= current.DateStart.DayEnd){
                DayType =  'l-pp-selection-active';
            }
            let Day : TDay = {
                DateValue: cursor.DayStart,
                DayValue: cursor.Format('DD'),
                DayType: DayType,
                IsDayOff: PeriodPicker.WeekEndDays.includes(dayOfWeek),
                IsDayDeny: DayType === 'l-pp-deny',
                //DayOff: '',//(PP._State.Settings.WeekEndIndexes.indexOf(WeekDay) > -1 || PP.Settings.DayOffs.indexOf(Cursor.Date) > -1)? 'l-pp-dayoff':''
            };

            CurrentWeek.Days.push(Day);
            if (dayOfWeek === 7){
                CurrentWeek.IsDeny = CurrentWeek.Days.filter(x => x.IsDayDeny).length === CurrentWeek.Days.length;
                MonthBlock.MonthWeeks.push(CurrentWeek);
                CurrentWeek = {
                    WeekSelectorVisible: this.props.isShowWeekSelector ?  '':'none',
                    //DateValue: Cursor.Clone().AddDays(1).Format('DD.MM.YYYY'),
                    DateValue: cursor.Clone().AddDays(1).SetWeekStart(),
                    Days: [],
                    IsDeny: false,
                };
            }
            if (cursor.Day === cursor.CountDays && CurrentWeek.Days.length > 0){
                CurrentWeek.IsDeny = CurrentWeek.Days.filter(x =>x.IsDayDeny).length === CurrentWeek.Days.length;
                MonthBlock.MonthWeeks.push(CurrentWeek);
            }
            cursor.AddDays(1);
        }
        MonthBlock.IsDeny = MonthBlock.MonthWeeks.filter((x)=> x.IsDeny).length === MonthBlock.MonthWeeks.length;
        return MonthBlock;
    }
    private _GenerateData() : TMonthRow[] {
        let monthRows : TMonthRow[] = [];
        let cursor = luffDate(this.State.NavigationDate.SValue).Clone();

        if (this.props.isMicroMode)
            return monthRows;

        for (let row = 0; row < this._CurrentCells[0]; row++){
            let MonthBlocks : TMonthBlock[] = [];
            for (let col = 0; col < this._CurrentCells[1]; col++){
                MonthBlocks.push( this._GenerateMonth(cursor));
                cursor.AddMonths(1);
            }
            monthRows.push({MonthBlocks: MonthBlocks});
        }

        return monthRows;
    }

    _ShiftMonth(delta: number): void {
        //PP._ctor.DateTarget = PP._ctor.DateTarget.AddMonths(delta);
        this.State.NavigationDate.SValue = this.State.NavigationDate.SValue.AddMonths(delta);
        this.State.MonthRows.SValue = this._GenerateData();
    }
    _ShiftMonthByWheel(e: any){
        this._ShiftMonth(e.deltaY > 0 ? 1 : -1);
    }
    _SetDateByInput(textValue: string, dateView: IObservableStateSimple<string>, oneOrTwo: number) : void {
        if (!textValue) {

            return;
        }
        const rgx = `^${Luff.Culture.Current.DateFormat.replace(/[dmyDMYs]/g, '\\d')}$`;
        const rgxSearch = new RegExp(rgx, 'g');

        if (!rgxSearch.test(textValue)) {
            dateView.SValue = textValue;
            return;
        }

        let dateValue : LuffDate;
        try {
            dateValue = Luff.Date(textValue, Luff.Culture.Current.DateFormat);
        } catch (e) {
            Luff.Pop.Error('Введена невалидная дата. Дата должна быть в формате ' + Luff.Culture.Current.DateFormat);
            return;
        }

        if (this.props.isOnlyDay){
            this._CurrentSelection.DateStart.SValue  = dateValue.DayStart;
            this._CurrentSelection.DateFinish.SValue = dateValue.DayEnd;
        } else {
            let DateCurrent = oneOrTwo === 0 ? this._CurrentSelection.DateStart : this._CurrentSelection.DateFinish;
            DateCurrent.SValue = dateValue;
            // if (DateCurrent.SValue !== void 0){
            //     DateCurrent.SValue = dateValue;
            //     // DateCurrent.SetYear(dateValue.Year);
            //     // DateCurrent.SetMonth(dateValue.Month);
            //     // DateCurrent.SetDay(dateValue.Day);
            // } else if (DateCurrent === null && oneOrTwo === 0){
            //     this._CurrentSelection.DateStart.SValue = dateValue;
            // } else if (DateCurrent === null && oneOrTwo === 1){
            //     this._CurrentSelection.DateFinish.SValue = dateValue;
            // }
        }
        this._CheckSelectionAndDirectConfirm();
    };

    _OnDayClick(day: TDay): void {
        //console.log('day click', day);
        if (day.IsDayDeny)
            return;
        const dateValue = day.DateValue;
        let selection = this._CurrentSelection.SValue;
        if (this.props.isOnlyDay){
            selection.DateStart = dateValue.DayStart;
            selection.DateFinish = dateValue.DayEnd;
            this._CurrentSelection.SValue = selection;
            return this._CheckSelectionAndDirectConfirm();
        }
        if (selection.DateStart === void 0 || selection.DateFinish !== void 0){
            selection.DateStart = dateValue.DayStart;
            selection.DateFinish = void 0;
        }
        else if (selection.DateStart !== void 0 && selection.DateFinish === void 0){
            selection.DateFinish = dateValue.DayEnd;
        }
        this._CurrentSelection.DateStart.SValue = selection.DateStart;
        this._CurrentSelection.DateFinish.SValue = selection.DateFinish;
        this._CheckSelectionAndDirectConfirm();
    }
    _OnWeekClick(week: TMonthWeek) : void {
        if (week.IsDeny || this.props.isOnlyDay)
            return;
        const dateValue = week.DateValue;
        this._CurrentSelection.DateStart.SValue = dateValue.Clone().SetWeekStart();
        this._CurrentSelection.DateFinish.SValue = dateValue.Clone().SetWeekEnd();
        this._CheckSelectionAndDirectConfirm();
    }
    _OnMonthClick(month: TMonthBlock): void {
        if (month.IsDeny || this.props.isOnlyDay)
            return;
        const dateValue = month.DateValue;
        this._CurrentSelection.DateStart.SValue = dateValue.Clone().SetMonthStart();
        this._CurrentSelection.DateFinish.SValue = dateValue.Clone().SetMonthEnd();
        this._CheckSelectionAndDirectConfirm();
    }



    //private _Content: React.RefObject<HTMLDivElement> = React.createRef();
    _SetFullscreen(){
        if (this.State.IsFullscreen.SValue) {
            //this.Content.classList.remove('l-pp-fullscreen');
            this._CurrentCells = this.props.cells;
            //this._Draggable.Position = this.State.DragPositions;
            //this._Draggable.Run();
        }
        else {
            const monthBlockElem = LibraryDOM.Select('.l-pp-month-block', this.DOM);
            let w = monthBlockElem.offsetWidth;
            let h = monthBlockElem.offsetHeight;
            let dw = document.body.offsetWidth;
            let dh = document.body.offsetHeight;
            this._CurrentCells = [Math.floor((dh - 70)/h), Math.floor((dw - 50)/w)];

            //this.State.DragPositions = this._Draggable.Position;
            //this._Draggable.Position = [0, 0];
            //this._Draggable.Hide();
        }

        this.State.SValue = {
            ...this.State.SValue,
            IsFullscreen: !this.State.IsFullscreen.SValue,
            MonthRows: this._GenerateData(),
        };
    }
    Render(): any {
        const stClassPPFullscreen = this.State.IsFullscreen.SubState(isTrue => "l-period_picker" + (isTrue ? ' l-pp-fullscreen':'') );

        const dsView = this._CurrentSelection.DateStart.SubState(ds => ds ? ds.Format(Culture.Current.DateFormat) : '');
        const dfView = this._CurrentSelection.DateFinish.SubState(df => df ? df.Format(Culture.Current.DateFormat) : '');
        return (
            <div className={ stClassPPFullscreen }>
                <div className="l-pp-head">
                    <div className="l-pp-caption">Выберите период</div>
                    <div className="l-pp-controls">
                        {this.props.isFullscreenButton && <div className="l-pp-control l-pp-control-fullscreen" onClick={() => this._SetFullscreen()}/>}
                        <div className="l-pp-control l-pp-control-close" onClick={() => this.Hide()}/>
                    </div>
                </div>
                {
                    this.props.navigation
                    &&
                    <PPMonthQuarterYear navDate={this.State.NavigationDate}
                                        setNavDate={(d: LuffDate) => this._SetNavDate(d)}
                                        isMonth={this.props.navigation.IsShowMonthSelect}
                                        isQuarter={false}
                                        dateMax={this.props.dateMax}
                                        dateMin={this.props.dateMin}
                                        yearRange={this.props.navigation.YearRange}/>
                }
                <div className="l-pp-inner">
                    <PPRange pp={this}/>

                    <div className="l-pp-bottom">
                        <div className="l-pp-result">
                            <div className="l-pp-date-values l-pp-date-date">
                                <div className="l-pp-textbox-holder">
                                    <input className="l-textbox tb-date-start"
                                           value={dsView}
                                           onChange={e => {
                                               let text = e.target.value.trim();
                                               console.log('[PeriodPicker] tb-date-start:', text);
                                               this._SetDateByInput(text, dsView, 0);
                                           }}
                                           placeholder={Culture.Current.DateFormat}/>
                                </div>
                                {
                                    !this.props.isOnlyDay
                                    &&
                                    <div className="l-pp-date-additional">
                                        <div className="l-pp-textbox-gap">
                                            <div> —</div>
                                        </div>
                                        <div className="l-pp-textbox-holder">
                                            <input className="l-textbox tb-date-end"
                                                   value={dfView}
                                                   onChange={e => {
                                                       let text = e.target.value.trim();
                                                       //console.log('[PeriodPicker] tb-date-end:', text);
                                                       this._SetDateByInput(text, dfView, 1);
                                                   }}
                                                   placeholder={Culture.Current.DateFormat}/>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="l-pp-date-values l-pp-date-time" isVisible={this._IsShowTimePicker}>
                                <div className="l-pp-time-face l-pp-time-face-start">
                                    <div className="l-pp-time-part l-pp-tp-start-hour">
                                        <ComboBox
                                            value={this._CurrentSelection.DateStart.SubState(df => df ? df.Hours : 0)}
                                            dataStatic={(new Array(24).fill(0).map((x, i) => i))}
                                            dataDelegateView={dateTimeDelegateView}
                                            isSearchEnabled={true}
                                            listEmptyText={''}
                                            disabled={this._CurrentSelection.DateFinish.SubState(df => !df)}
                                            onChange={v => {
                                                this._CurrentSelection.DateStart.SValue = this._CurrentSelection.DateStart.SValue.SetHours(v);
                                                return Promise.resolve(1)}
                                            }
                                        />
                                    </div>
                                    <div className="l-pp-time-part l-pp-tp-start-minute" isVisible={this._TimePickerResolution.SubState(r => r >= TimePickerResolution.Minute)}>
                                        <ComboBox
                                            value={this._CurrentSelection.DateStart.SubState(df => df ? df.Minutes : 0)}
                                            dataStatic={(new Array(60).fill(0).map((x, i) => i))}
                                            dataDelegateView={dateTimeDelegateView}
                                            isSearchEnabled={true}
                                            listEmptyText={''}
                                            disabled={this._CurrentSelection.DateFinish.SubState(df => !df)}
                                            onChange={v => {
                                                this._CurrentSelection.DateStart.SValue = this._CurrentSelection.DateStart.SValue.SetMinutes(v);
                                                return Promise.resolve(1)}
                                            }
                                        />
                                    </div>
                                    <div className="l-pp-time-part l-pp-tp-start-second" isVisible={this._TimePickerResolution.SubState(r => r >= TimePickerResolution.Second)}>
                                        <ComboBox
                                            value={this._CurrentSelection.DateStart.SubState(df => df ? df.Seconds : 0)}
                                            dataStatic={(new Array(60).fill(0).map((x, i) => i))}
                                            dataDelegateView={dateTimeDelegateView}
                                            isSearchEnabled={true}
                                            listEmptyText={''}
                                            disabled={this._CurrentSelection.DateFinish.SubState(df => !df)}
                                            onChange={v => {
                                                this._CurrentSelection.DateStart.SValue = this._CurrentSelection.DateStart.SValue.SetSeconds(v);
                                                return Promise.resolve(1)}
                                            }
                                        />
                                    </div>
                                </div>
                                {
                                    !this.props.isOnlyDay
                                    &&
                                    <div className="l-pp-date-additional">
                                        <div className="l-pp-textbox-gap">
                                            <div> —</div>
                                        </div>
                                        <div className="l-pp-time-face l-pp-time-face-end">
                                            <div className="l-pp-time-part l-pp-tp-end-hour">
                                                <ComboBox
                                                  value={this._CurrentSelection.DateFinish.SubState(df => df ? df.Hours : 0)}
                                                  dataStatic={(new Array(24).fill(0).map((x, i) => i))}
                                                  dataDelegateView={dateTimeDelegateView}
                                                  isSearchEnabled={true}
                                                  listEmptyText={''}
                                                  disabled={this._CurrentSelection.DateFinish.SubState(df => !df)}
                                                  onChange={v => {
                                                      this._CurrentSelection.DateFinish.SValue = this._CurrentSelection.DateFinish.SValue.SetHours(v);
                                                      return Promise.resolve(1)}
                                                  }
                                                />
                                            </div>
                                            <div className="l-pp-time-part l-pp-tp-end-minute" isVisible={this._TimePickerResolution.SubState(r => r >= TimePickerResolution.Minute)}>
                                                <ComboBox
                                                  value={this._CurrentSelection.DateFinish.SubState(df => df ? df.Minutes : 0)}
                                                  dataStatic={(new Array(60).fill(0).map((x, i) => i))}
                                                  dataDelegateView={dateTimeDelegateView}
                                                  isSearchEnabled={true}
                                                  listEmptyText={''}
                                                  disabled={this._CurrentSelection.DateFinish.SubState(df => !df)}
                                                  onChange={v => {
                                                      this._CurrentSelection.DateFinish.SValue = this._CurrentSelection.DateFinish.SValue.SetMinutes(v);
                                                      return Promise.resolve(1)}
                                                  }
                                                />
                                            </div>
                                            <div className="l-pp-time-part l-pp-tp-end-second" isVisible={this._TimePickerResolution.SubState(r => r >= TimePickerResolution.Second)}>
                                                <ComboBox
                                                  value={this._CurrentSelection.DateFinish.SubState(df => df ? df.Seconds : 0)}
                                                  dataStatic={(new Array(60).fill(0).map((x, i) => i))}
                                                  dataDelegateView={dateTimeDelegateView}
                                                  isSearchEnabled={true}
                                                  listEmptyText={''}
                                                  disabled={this._CurrentSelection.DateFinish.SubState(df => !df)}
                                                  onChange={v => {
                                                      this._CurrentSelection.DateFinish.SValue = this._CurrentSelection.DateFinish.SValue.SetSeconds(v);
                                                      return Promise.resolve(1)}
                                                  }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="button-holder row flex-end">
                            <button className="l-button btn-l-pp-ok" onClick={() => this._TryConfirm()}>Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    Ctor(): TContentCtor<TPeriodPickerState> {
        //const dates = this.props.dates;

        return {
            Dialog: {
                IsGlobal: true,
            },
            State: {
                IsFullscreen: false,
                MonthRows: [],
                NavigationDate: luffDate(),
            }
        }
    }
}


___LuffGlobal.PeriodPicker = PeriodPicker;
document.addEventListener('DOMContentLoaded', () => {
    PeriodPicker.GlobalSinglePicker = new PeriodPicker({
        InnerIndex: void 0,
        Attributes: {
            //Target: document.body,
            isOnlyDay: true,
        } as TPeriodPickerProps
    });
    PeriodPicker.GlobalRangePicker = new PeriodPicker({
        InnerIndex: void 0,
        Attributes: {
            //Target: document.body,
            isOnlyDay: false,
        } as TPeriodPickerProps
    });


});

export default PeriodPicker;