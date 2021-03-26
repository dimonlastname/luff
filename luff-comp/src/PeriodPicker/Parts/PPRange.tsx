import Luff, {React, Each, Culture} from "luff";
import PeriodPicker from "../PeriodPicker";
type TPPRange = {
    pp: PeriodPicker;
}

function getStaticWeekDaysRow(isShowWeekDays: boolean, isShowWeekSelector: boolean) : any {
    if (!isShowWeekDays)
        return undefined;
    return (
        <>
            {isShowWeekSelector && <div className="l-pp-week-select-gap" data-value="{{DateValue}}">|</div>}
            {
                Culture.Current.WeekDaysShort.map((w, i) => {
                    let dayOff = PeriodPicker.WeekEndDays.includes(i + 1) ? 'l-pp-dayoff':'';
                    return (<div className={"l-pp-weekdays-cell l-pp-cell " + dayOff} >{w}</div>)
                })
            }
        </>
    );
}
export default class PPRange extends Luff.Content<TPPRange> {
    Render(): any {
        const pp = this.props.pp;
        return (
            <div className="l-pp-work-area">
                <div className="l-pp-work-date">
                    <div className="l-pp-arrow l-pp-arrow-left pointer ${periodPicker_ctor.IsShowNavigationArrows? '':'none'}"
                         onClick={() => pp._ShiftMonth(-1)}/>
                    <div className="l-pp-content" onWheel={(e) => pp._ShiftMonthByWheel(e)}>
                        {/*${periodPicker_ctor.IsMonthPickerMode ? CtxDateNav : ''}*/}
                        <Each
                            source={pp.State.MonthRows}
                            render={mRow => {
                                return (
                                    <div className="l-pp-month-row">
                                        <Each
                                            source={mRow.MonthBlocks}
                                            render={mBlock => {
                                                return (
                                                    <div className="l-pp-month-block">
                                                        {<div className="l-pp-weekdays-row">{getStaticWeekDaysRow(pp.props.isShowWeekDays, pp.props.isShowWeekSelector && !pp.props.isOnlyDay)}</div>}
                                                        <div
                                                            className={"l-pp-month-name" + (pp.props.isOnlyDay ? '':' l-pp-month-select') + (mBlock.IsDeny ? ' l-pp-deny': '') }
                                                            data-value={mBlock.DateValue}
                                                            onClick={() => pp._OnMonthClick(mBlock.SValue)}>{mBlock.MonthName}</div>
                                                        <div className="l-pp-month-grid">
                                                            <Each
                                                                source={mBlock.MonthWeeks}
                                                                render={week => {
                                                                    return (
                                                                        <div className="l-pp-month-week l-row">
                                                                            {(pp.props.isShowWeekSelector && !pp.props.isOnlyDay) && <div className="l-pp-week-select {{IsDeny ? 'l-pp-deny':''}} {{WeekSelectorVisible}}" onClick={() => pp._OnWeekClick(week.SValue)}>|</div>}
                                                                            <Each
                                                                                source={week.Days}
                                                                                render={day => {
                                                                                    const dayClass = day.DayType.SubState(dayType => "l-pp-month-cell l-pp-cell" + (day.IsDayOff.SValue ? ' l-pp-dayoff ':' ') + dayType, [day.IsDayOff]);
                                                                                    return (
                                                                                        <div
                                                                                            className={dayClass}
                                                                                            //data-type={day.DayType}
                                                                                            ///data-value={day.DateValue}
                                                                                            onClick={() => pp._OnDayClick(day.SValue) }>{day.DayValue}</div>
                                                                                    )
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        />

                    </div>
                    <div
                        className="l-pp-arrow l-pp-arrow-right pointer ${periodPicker_ctor.IsShowNavigationArrows? '':'none'}"
                        onClick={() => pp._ShiftMonth(1)}/>
                </div>
            </div>
        )
    }
}