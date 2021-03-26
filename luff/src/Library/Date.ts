import {Culture} from "./Culture/Culture";

const _DayCountByMonthNum = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31,
};
//date like '2019-07-05T08:58:55.720Z'
//const _RegexJsonStringify = new RegExp(`\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z`);
const _RegexJsonStringify = new RegExp(`^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$`);
const _regexDateCs = new RegExp('Date\\((-?[\\d]+)(([+-]\\d+)\\))?');

function isDateValid(date: Date) : boolean {
    return (Object.prototype.toString.call(date) === "[object Date]" && !isNaN( date.getTime()));
}

function getCurrentTimeZoneOffset() : number {
    return (new Date).getTimezoneOffset();
}
function _GetCountDays(date: Date) : number{
    let month = date.getMonth();
    if (month !== 1) { //no feb
        return _DayCountByMonthNum[month];
    }
    //return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? 29:28;
    let year = date.getFullYear();
    return new Date(year, month+1, 0).getDate();
}

export class LuffDate {
    static From(date?: Date | string | number | LuffDate, format?: string) : LuffDate {
        if (!date) {
            date = new Date();
        }
        return new LuffDate(date, format);
    }
    private _Date: Date;
    Format(format: string = Culture.Current.DateFormatFull) : string {
        let date = this._Date;
        //let date = this._Date;
        if (date === null || typeof date === 'undefined')
            return '';
        let day = date.getDay();
        day = day !== 0 ? day - 1 : 7; //monday as first weekday
        const data = date.getDate();
        const mo = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        let timeZoneValue = date.getTimezoneOffset() / (-0.6);
        let timeZone = String(Math.abs(timeZoneValue));
        let zeroCount = 4 - timeZone.toString().length;
        if (zeroCount > 0)
            timeZone = (0).toString().repeat(zeroCount) + timeZone;
        format = format.replace(/[DdMmYyHhSsZz]/g, '%$&');

        return format.replace(/%D%D/g, data.toString().length < 2 ? `0${data}` : data.toString())
            .replace(/%D/g, data.toString())
            .replace(/%d%d%d%d/g, Culture.Current.WeekDays[day])
            .replace(/%d%d%d/g, Culture.Current.WeekDaysShort[day])
            .replace(/%M%M%M%M%M/g, Culture.Current.MonthNamesInclined[mo - 1])
            .replace(/%M%M%M%M/g, Culture.Current.MonthNames[mo - 1])
            .replace(/%M%M%M/g, Culture.Current.MonthNamesShort[mo - 1])
            .replace(/%M%M/g, mo.toString().length < 2 ? `0${mo}` : mo.toString())
            .replace(/%M/g, mo.toString())
            .replace(/%Y%Y%Y%Y/g, year.toString())
            .replace(/%Y%Y/g, year.toString().substring(2, 4))
            .replace(/%Y/g, year.toString())
            .replace(/%H%H/g, hour.toString().length < 2 ? `0${hour}` : hour.toString())
            .replace(/%h%h/g, (hour % 12).toString().length < 2 ? `0${(hour % 12)}` : (hour % 12).toString())
            .replace(/%H/g, hour.toString())
            .replace(/%h/g, (hour % 12).toString())
            .replace(/%m%m/g, min.toString().length < 2 ? `0${min}` : min.toString())
            .replace(/%m/g, min.toString())
            .replace(/%s%s/g, sec.toString().length < 2 ? `0${sec}` : sec.toString())
            .replace(/%s/g, sec.toString())
            .replace(/%Z/g, `${timeZoneValue < 0 ? "-":"+"}${timeZone}`);
    };

    toString() : string {
        return this.Format();
    }

    valueOf() : number {
        return this._Date.valueOf();
    }

    get TotalMilliseconds() : number {
        return this._Date.valueOf();
    }

    /*    Diff(Date: Date | _luffDate) : number[] {
            let ms = Math.abs(this.Value - Date.Value);
            let diffs = [];
            let div = [1000, 60, 60, 24];
            let res = ms;
            for (let d of [86400000, 3600000, 60000, 1000]){
                let val = Math.floor(res / d);
                let rest = res % d;
                console.log(res, d, val, rest);
                diffs.push(val);
                res = rest;
            }
            console.warn('[Luff.Date().Diff] is experimental method');
            return diffs;
        }
        DiffFull(Date: _luffDate | Date){
            Date = luffDate(Date);

            let FullMilliseconds = Date.Value;

            let DateMin = this;
            let DateMax = Date;
            if (this.Value > Date.Value){
                DateMin = Date;
                DateMax = this;
            }
            let Cursor  = DateMax.Clone();
            let Compars = Date.Date < this._Date ? Date : this;

            let DF = {
                Years: 0,
                Months: 0,
                Days: 0,
                Hours: 0,
                Minutes: 0,
                Seconds: 0,
                Milliseconds: 0
            };

            DF.Years = Cursor.Year - DateMin.Year;
            if (DF.Years > 0 && Cursor.Month < DateMin.Month){
                DF.Years--;
                DF.Months = Cursor.Month+1;
                Cursor.SetMonth(11)
            }
            DF.Months += Cursor.Month - DateMin.Month;
            if (DF.Months > 0 && Cursor.Day < DateMin.Day){
                DF.Months--;
                DF.Days = Cursor.Day+1;
                Cursor.SetDay(Cursor.CountDays);
            }
            DF.Days += Cursor.Day - DateMin.Day;
            if (DF.Days > 0 && Cursor.Hours < DateMin.Hours){
                DF.Days--;
                DF.Hours = Cursor.Hours+1;
                Cursor.SetHours(23);
            }
            DF.Hours += Cursor.Hours - DateMin.Hours;
            if (DF.Hours > 0 && Cursor.Minutes < DateMin.Minutes){
                DF.Hours--;
                DF.Minutes = Cursor.Minutes+1;
                Cursor.SetMinutes(59);
            }
            DF.Minutes += Cursor.Minutes - DateMin.Minutes;
            if (DF.Minutes > 0 && Cursor.Seconds < DateMin.Seconds){
                DF.Minutes--;
                DF.Seconds = Cursor.Seconds+1;
                Cursor.SetSeconds(59);
            }
            DF.Seconds += Cursor.Seconds - DateMin.Seconds;
            if (DF.Seconds > 0 && Cursor.Milliseconds < DateMin.Milliseconds){
                DF.Seconds--;
                DF.Milliseconds = Cursor.Milliseconds+1;
                Cursor.SetMilliseconds(999);
            }
            DF.Milliseconds += Cursor.Milliseconds - DateMin.Milliseconds;
            return DF;
        }*/

    get CountDays(): number {
        return _GetCountDays(this._Date);
    }

    get DayStart(): LuffDate {
        let d = new Date(this._Date.getTime());
        d.setHours(0, 0, 0, 0);
        return luffDate(d);
    }

    get DayEnd(): LuffDate {
        let d = new Date(this._Date.getTime());
        d.setHours(23, 59, 59, 997);
        return luffDate(d);
    }

    get WeekStart(): LuffDate {
        let wd = this._Date.getDay();
        wd = wd !== 0 ? wd - 1 : 6; //monday as first weekday

        return this.AddDays(-wd).DayStart

    }

    get WeekEnd() : LuffDate {
        let wd = this._Date.getDay();
        wd = wd !== 0 ? wd - 1 : 6; //monday as first weekday
        return luffDate(this._Date).AddDays(6 - wd).DayEnd
    }

    get MonthStart() : LuffDate {
        let d = new Date(this._Date.getTime());
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return luffDate(d);
    }

    get MonthEnd() : LuffDate {
        let d = new Date(this._Date.getTime());
        d.setDate(luffDate(d).CountDays);
        d.setHours(23, 59, 59, 997);
        return luffDate(d);
    }

    get QuarterStart() : LuffDate {
        let d = new Date(this._Date.getTime());
        let quart = Math.floor((d.getMonth()) / 3);
        d.setMonth(quart * 3);
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return luffDate(d);
    }

    get QuarterEnd() : LuffDate {
        let d = new Date(this._Date.getTime());
        let quart = Math.floor((d.getMonth()) / 3);
        d.setMonth(quart * 3 + 2);
        d.setDate(_GetCountDays(d));
        d.setHours(23, 59, 59, 997);
        return luffDate(d);
    }

    get YearStart() : LuffDate {
        return luffDate(new Date(this._Date.getFullYear(), 0, 1));
    }

    get YearEnd() : LuffDate {
        return luffDate(new Date(this._Date.getFullYear(), 11, 31, 23, 59, 59, 997));
    }

    AddMilliseconds(count : number) : LuffDate {
        this._Date.setMilliseconds(this._Date.getMilliseconds() + count);
        return this;
    }


    AddSeconds(count: number) : LuffDate {
        this._Date.setSeconds(this._Date.getSeconds() + count);
        return this;
    }

    AddMinutes(count : number) : LuffDate {
        this._Date.setMinutes(this._Date.getMinutes() + count);
        return this;
    }

    AddHours(count : number) : LuffDate {
        this._Date.setHours(this._Date.getHours() + count);
        return this;
    }

    AddDays(count : number) : LuffDate {
        //const dat = new Date(this._Date.valueOf());
        this._Date.setDate(this._Date.getDate() + count);
        return this;
    }

    AddMonths(count : number) : LuffDate {
        let DtDays = this._Date.getDate();
        let DtTargetDays = new Date(this._Date.getFullYear(), this._Date.getMonth() + count + 1, 0).getDate();
        if (DtTargetDays >= DtDays) {
            this._Date.setMonth(this._Date.getMonth() + count);
        }
        else {
            this._Date.setMonth(this._Date.getMonth() + count);
            this.AddDays(DtTargetDays - DtDays);
        }
        return this;
    }
    AddQuarters(count: number) : LuffDate {
        this.AddMonths(count * 3); 
        return this;
    }

    AddYears(count : number) : LuffDate {
        let DtMonths = this._Date.getMonth();
        let DtTargetMonths = new Date(this._Date.getFullYear() + count, 0, 0).getMonth();

        if (DtTargetMonths >= DtMonths) {
            this._Date.setFullYear(this._Date.getFullYear() + count);
        }
        else {
            this._Date.setFullYear(this._Date.getFullYear() + count);
            this.AddMonths(DtTargetMonths - DtMonths);
        }

        //this._Date.setFullYear(this._Date.getFullYear() + Count);
        return this;
    }

    get Date() : Date {
        return this._Date;
    }

    get Int() : number {
        return this._Date.valueOf()
    }

    get Value() : number {
        return this._Date.valueOf()
    }

    get DateCs() : string {
        return '\/Date(' + (+this.Value) + this.Format('Z') + ')\/'
    }

    get Milliseconds() : number {
        return this._Date.getMilliseconds();
    }

    get Seconds() : number {
        return this._Date.getSeconds();
    }

    get Minutes() : number {
        return this._Date.getMinutes();
    }

    get Hours() : number {
        return this._Date.getHours();
    }

    get Day() : number {
        return this._Date.getDate();
    }

    /**
     * @description returns from 1 to 7 where monday is 1, saturday is 7
     * */
    get DayOfWeek() : number {
        let d = this._Date.getDay();
        if (d === 0)
            return 7;
        return d;
    }

    get Month() : number {
        return this._Date.getMonth();
    }

    get Quarter() : number {
        const month = this._Date.getMonth() + 1;
        let quarter = 1;
        if (month > 3){
            quarter++
        }
        if (month > 6){
            quarter++
        }
        if (month > 9){
            quarter++
        }
        return quarter;
    }


    get Year() : number {
        return this._Date.getFullYear();
    }

    SetMilliseconds(milliseconds : number) : LuffDate {
        this._Date.setMilliseconds(milliseconds);
        return this;
    }

    SetSeconds(seconds : number) : LuffDate {
        this._Date.setSeconds(seconds);
        return this;
    }

    SetMinutes(minutes : number) : LuffDate {
        this._Date.setMinutes(minutes);
        return this;
    }

    SetHours(hours : number) : LuffDate {
        this._Date.setHours(hours);
        return this;
    }

    SetDay(day : number) : LuffDate {
        this._Date.setDate(day);
        return this;
    }

    SetMonth(month : number) : LuffDate {
        this._Date.setMonth(month);
        return this;
    }
    SetQuarter(quarter: number) : LuffDate {
        const quarterMonth = quarter * 3 - 3;
        this.SetMonth(quarterMonth);
        return this;
    }

    SetYear(year : number) : LuffDate {
        this._Date.setFullYear(year);
        return this;
    }

    SetDayStart() : LuffDate {
        this._Date.setHours(0, 0, 0, 0);
        return this;
    }

    SetDayEnd() : LuffDate {
        this._Date.setHours(23, 59, 59, 997);
        return this;
    }

    SetWeekStart() : LuffDate {
        let wd = this._Date.getDay();
        wd = wd !== 0 ? wd - 1 : 6; //monday as first weekday
        this._Date = this.AddDays(-wd).DayStart.Date;
        return this;
    }

    SetWeekEnd() : LuffDate {
        let weekDay = this._Date.getDay();
        weekDay = weekDay !== 0 ? weekDay - 1 : 6; //monday as first weekday
        this._Date = this.AddDays(6 - weekDay).DayEnd.Date;
        return this;
    }

    SetMonthStart() : LuffDate {
        this._Date.setDate(1);
        this._Date.setHours(0, 0, 0, 0);
        return this;
    }

    SetMonthEnd() : LuffDate {
        this._Date.setDate(this.CountDays);
        this._Date.setHours(23, 59, 59, 997);
        return this;
    }

    SetQuarterStart() : LuffDate {
        let quart = Math.floor((this.Month) / 3);
        this._Date.setMonth(quart * 3);
        this._Date.setDate(1);
        this._Date.setHours(0, 0, 0, 0);
        return this;
    }

    SetQuarterEnd() : LuffDate {
        let quart = Math.floor((this.Month) / 3);
        this._Date.setMonth(quart * 3 + 2);
        this._Date.setDate(this.CountDays);
        this._Date.setHours(23, 59, 59, 997);
        return this;
    }

    SetYearStart() : LuffDate {
        this._Date = new Date(this._Date.getFullYear(), 0, 1);
        return this;
    }

    SetYearEnd() : LuffDate {
        this._Date = new Date(this._Date.getFullYear(), 11, 31, 23, 59, 59, 997);
        return this;
    }

    Clone() : LuffDate {
        return luffDate(this._Date);
    }

    CopyTime(luffDate : LuffDate) {
        this.SetHours(luffDate.Hours);
        this.SetMinutes(luffDate.Minutes);
        this.SetSeconds(luffDate.Seconds);
        this.SetMilliseconds(luffDate.Milliseconds);
    }

    IsSameDate(luffDate : LuffDate) {
        return this.Year === luffDate.Year && this.Month === luffDate.Month && this.Day === luffDate.Day;
    }

    get IsToday() : boolean {
        return this.IsCurrentDay;
    }

    get IsCurrentDay() : boolean {
        const today = new Date();

        const day = this._Date.getDate();
        const month = this._Date.getMonth();
        const year = this._Date.getFullYear();

        return (day === today.getDate() && month === today.getMonth() && year === today.getFullYear())
    }

    get IsCurrentMonth() : boolean {
        const month = this._Date.getMonth();
        const year = this._Date.getFullYear();
        const today = new Date();
        return (month === today.getMonth() && year === today.getFullYear())
    }

    constructor(date : any, format : string = Culture.Current.DateFormatFull) {
        if (date === null || typeof date === 'undefined') {
            // Luff.System.ShowError('[Luff.Date] Input Date is undefined or null');
            console.error(new Error('[Luff.Date] Input Date is undefined or null'));
            return null;

        }
        if (date instanceof Date) {
            this._Date = new Date(date.valueOf());
        }
        else if (date instanceof LuffDate) {
            this._Date = date._Date;
        }
        else if (!isNaN(parseFloat(date)) && isFinite(date)) {
            this._Date = new Date(parseInt(date));
        }
        else if (typeof date === 'string' && _RegexJsonStringify.test(date)) {
            this._Date = new Date(date);

            // let parts = date.split(/[-.:TZ]/g).splice(0, 7).map(x => parseInt(x));
            // this._Date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]);
            // this.AddMinutes(-this._Date.getTimezoneOffset())
        }
        else {
            let errorSum = 0;

            const dags = 'DDMMYYYYHHmmss';
            let legacy = [];
            format = format ? format : Culture.Current.DateFormatFull;
            if (format.indexOf('MMM') > -1) {
                format = format.replace(/[M]{3,}/g, 'M');
                date = date.replace(/[a-zA-Zа-я-А-Я\\w]+\.?/, function (match, index) {
                    match = match.replace('.', '').toLowerCase();
                    if (Culture.Current.MonthDict[match] !== void 0) {
                        return Culture.Current.MonthDict[match] + 1;
                    }
                    errorSum++;
                    //throw new Error('[Luff.Date] Invalid date or date format')
                })
            }

            const rgx = format
                .replace(/[DMYHms]+/g, function (match, index) {
                    legacy.push(match.substring(0, 1));
                    if (dags.indexOf(match) > -1) {

                        let len = match.length < 2 ? `0,2` : match.length;
                        if (match === 'Y')
                            len = '2,4';
                        return `(\\d{${len}})?`;
                    }
                    //return `[a-zA-Zа-я-А-Я\\w]+`;
                })
                .replace(/[.-/ :;]/g, function (match) {
                    return match + '?';
                });
            let C = {
                Y: 0,
                M: 0,
                D: 1,
                H: 0,
                m: 0,
                s: 0,
            };

            date.replace(new RegExp(rgx), function (match, a, b, c, d, e, f, g, h) {
                let x = [a, b, c, d, e, f, g, h];
                for (let i = 0; i < legacy.length; i++) {
                    C[legacy[i]] = x[i] ? x[i] : C[legacy[i]];
                    if (x[i] === '' || x[i] === '0') {
                        errorSum++;
                    }
                }

            });
            if (!C.Y)
                errorSum++;
            if ((!C.M) && (C.D || C.H || C.m || C.s))
                errorSum++;
            if (C.M > 12 || C.H > 23 || C.m > 59 || C.s > 59)
                errorSum++;

            this._Date = new Date(C.Y, C.M - 1, C.D, C.H, C.m, C.s);
            if (!isDateValid(this._Date) || errorSum > 0) {
                let dateParts = _regexDateCs.exec(date);

                if (dateParts) {
                    let [match, timeStr, matchTz, timeZoneOffsetStr] = dateParts;
                    //WCF date
                    const totalMilliseconds = parseInt(timeStr);
                    this._Date = new Date(totalMilliseconds);

                    if (timeZoneOffsetStr) { //not a UTC time
                        const tzHours = parseInt(timeZoneOffsetStr.substring(1, 2));
                        const tzMinutes = parseInt(timeZoneOffsetStr.substring(3));
                        const timeZoneOffset = tzHours * 60 + tzMinutes;
                        this._Date.setMinutes(this._Date.getMinutes() + timeZoneOffset);
                    }
                }


                // let matchCS = date.match(/Date\((-?[\d]+)[+-](\d{4})\)/);
                // if (matchCS) {
                //     const timeStr = matchCS[1];
                //     let timeZoneOffsetStr = matchCS[2];
                //     timeZoneOffsetStr = timeZoneOffsetStr.replace(')/', '');
                //     const tzHours = parseInt(timeZoneOffsetStr.substring(0, 2));
                //     const tzMinutes = parseInt(timeZoneOffsetStr.substring(2));
                //     const totalMilliseconds = parseInt(timeStr);
                //     const timeZoneOffset = tzHours * 60 + tzMinutes + getCurrentTimeZoneOffset();
                //     this._Date = new Date(totalMilliseconds);
                //     this._Date.setMinutes(this._Date.getMinutes() + timeZoneOffset);
                // }
                errorSum = 0;
            }
            //return;
            if (!isDateValid(this._Date) || errorSum > 0) {
                this._Date = new Date(date);
            }
            if (!isDateValid(this._Date) || errorSum > 0) {
                // Luff.System.ShowError('[Luff.Data] Can not parse properly input Data');
                console.error(`[Luff.Data] Parse Error. Can not parse properly input Data "${date}"`);
            }
        }

    }
}

export function luffDate(date?: Date | string | number | LuffDate, format?: string) : LuffDate {
    return LuffDate.From(date, format);
}


