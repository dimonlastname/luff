// import {luffDate, LuffDate, Culture, LibraryNumber} from "luff-library";
//
// /*
//         Animation      = void 0,
//         WeekEndIndexes = [6, 7], //from 1 to 7
//  */
// type DateNavigationType = {
//     IsShowMonthSelect?: boolean;
//     YearRange?: number[];
// }
// type PeriodPickerCtorType = {
//     Target?: HTMLElement;
//     DateTarget?: LuffDate;
//     DateRange?: LuffDate[];
//     DatesForbidden?: Date[] | LuffDate[];
//     DatesDayOff?: Date[] | LuffDate[];
//
//     Min?: LuffDate;
//     Max?: LuffDate;
//     Cells?: number[];
//
//     Format?: string;
//     Navigation?: DateNavigationType;
//
//     IsDirectConfirm?: boolean;
//     IsDirectConfirmClosesPicker?: boolean;
//
//     IsTargetImmutable?: boolean;
//     IsOnlyDay?: boolean;
//     IsMonthPickerMode?: boolean;
//     IsShowWeekDays?: boolean;
//     IsShowWeekSelector?: boolean;
//     IsShowNavigationArrows?: boolean;
//     IsShowButtonConfirm?: boolean;
//     IsShowButtonFullscreen?: boolean;
//     IsFullscreen?: boolean;
//     IsBuildInMode?: boolean;
//
//     IsShowTimePick?: boolean;
//     TimePickerResolution?: number;
//     TimePickerMinuteStep?: number;
//
//     FirstDayOfWeek?: number;
//
//     BeforeShow?(datePicker: PeriodPicker): void;
//     OnConfirm?(dateStart: LuffDate, dateFinish: LuffDate, datePicker: PeriodPicker) : void;
//     OnDateShift?(dateTarget: LuffDate, datePicker: PeriodPicker) : void;
//     TargetRender?(dateStart: LuffDate, dateFinish: LuffDate, datePicker: PeriodPicker): string;
// }
// type DatePickerStateType = {
//     //Dates: LuffDate[],
//     CurrentSelection: {
//         DateStart: LuffDate,
//         DateFinish: LuffDate,
//     },
//     MonthRows: MonthRowType[];
//     Settings: PeriodPickerCtorType,
// }
// type MonthRowType = {
//     MonthBlocks: MonthBlockType[];
// }
// type MonthBlockType = {
//     DateValue: LuffDate;
//     MonthName: string;
//     MonthWeeks: MonthWeekType[];
//     IsDeny: boolean;
// }
// type MonthWeekType = {
//     DateValue: LuffDate;
//     WeekSelectorVisible: string;
//     IsDeny: boolean;
//     Days: DayType[];
// }
// type DayType = {
//     DateValue: LuffDate;
//     DayValue: string;
//     DayType: string
//     IsDayOff: boolean;
//     IsDayDeny: boolean;
// }
// let TimePickerResolution = {
//     Hour: 0,
//     Minute: 1,
//     Second: 2,
//     Millisecond: 3,
// };
// let GetDefault = function(): PeriodPickerCtorType{
//     return {
//         Cells: [1, 3],
//         Target: void 0,
//         DateRange: [void 0, void 0],
//         DatesDayOff: [],
//         DatesForbidden: [],
//         DateTarget: new LuffDate(new Date()),
//         FirstDayOfWeek: 0,
//         Format: Culture.Current.DateFormat,
//         IsBuildInMode: false,
//         IsDirectConfirm: false,
//         IsDirectConfirmClosesPicker: false,
//         IsFullscreen: false,
//         IsMonthPickerMode: false,
//         IsOnlyDay: false,
//         IsShowButtonConfirm: true,
//         IsShowButtonFullscreen: true,
//         IsShowNavigationArrows: true,
//         IsShowTimePick: false,
//         IsShowWeekDays: true,
//         IsShowWeekSelector: true,
//         IsTargetImmutable: false,
//         Max: void 0,
//         Min: void 0,
//         Navigation: {
//             IsShowMonthSelect: true,
//             YearRange: [luffDate().Year - 5, luffDate().Year + 5]
//         },
//         TimePickerMinuteStep: 1,
//         TimePickerResolution: TimePickerResolution.Minute,
//         TargetRender(dateStart: LuffDate, dateFinish: LuffDate, datePicker: PeriodPicker): string {
//             if (datePicker._ctor.IsOnlyDay)
//                 return dateStart.Format();
//             return dateStart.Format() + " — " + dateFinish.Format();
//         }
//     }
// };
// function GetStaticWeekDaysRow(ctor: PeriodPickerCtorType) {
//     if (!ctor.IsShowWeekDays)
//         return '';
//     const WeekSelectorGap = ctor.IsShowWeekSelector ? `<div class="l-pp-week-select-gap" data-value="{{DateValue}}">|</div>` : ``;
//     let week = WeekSelectorGap;
//     for (let i = 0; i < Culture.Current.WeekDaysShort.length; i++){
//         let DayOff = [6, 7].indexOf(i+1) > -1 ? 'l-pp-dayoff':'';
//         let w = Culture.Current.WeekDaysShort[i];
//         week += `<div class="l-pp-weekdays-cell l-pp-cell ${DayOff}">${w}</div>`
//     }
//     return week;
// }
//
// const HtmlMonthBlock = `<div class="l-pp-month-block">
//                           <div class="l-pp-week-selector-block"></div>
//                         </div>`;
//
// export class PeriodPicker {
//     static readonly TimePickerResolution = TimePickerResolution;
//     static readonly HourList = (() => {let hs=[];for(let i=0;i<24;i++) hs.push(i>9?i.toString():'0'+i);return hs;})();
//     static readonly MinuteList = (() => {let s=[];for(let i=0;i<60;i++) s.push(i>9?i.toString():'0'+i);return s;})();
//
//     _ctor: PeriodPickerCtorType;
//     Target: HTMLElement;
//     Content: HTMLElement;
//     _State: DatePickerStateType;
//
//     //private _Content: LuffComponent;
//
//     Reset(){
//         this.Date = [void 0, void 0];
//     }
//     Refresh(){
//
//     }
//
//     get Date(): LuffDate[] {
//         return  [luffDate()];
//     }
//     set Date(val: LuffDate[]){
//         // if (!val || val.length < 2){
//         //     this.Reset();
//         //     return;
//         // }
//         // if (this.Settings.isOneDaySelection){
//         //     val = Array.isArray(val) ? val[0] : val;
//         //     this._ctx.CurrentSelection = {
//         //         DateStart:  val ? Luff.Date(val) : void 0,
//         //         DateFinish: val ? Luff.Date(val) : void 0,
//         //     };
//         // }else{
//         //     this._ctx.CurrentSelection = {
//         //         DateStart:  val[0] !== void 0 ? Luff.Date(val[0]) : void 0,
//         //         DateFinish: val[0] !== void 0 ? Luff.Date(val[1]) : void 0,
//         //     };
//         // }
//         // this._ctx.CheckSelection();
//         // if (this._ctx.CurrentSelection.DateStart !== void 0)
//         //     this.DateTarget = this._ctx.CurrentSelection.DateStart.Clone();
//         // this.Refresh();
//         // this._ctx.Dates = {
//         //     DateStart:  this._ctx.CurrentSelection.DateStart  ? this._ctx.CurrentSelection.DateStart.Clone()  : void 0,
//         //     DateFinish: this._ctx.CurrentSelection.DateFinish ? this._ctx.CurrentSelection.DateFinish.Clone() : void 0,
//         // };
//         // this._ctx.UpdateTargetControl();
//     }
//
//     _InitCtor(ctor: PeriodPickerCtorType){
//         let ctorDefault = GetDefault();
//         this._ctor = {
//             ...
//                 ctorDefault,
//             ...
//                 ctor
//         };
//         if (ctor.Navigation != void 0){
//             this._ctor.Navigation = {
//                 ...
//                     this._ctor.Navigation,
//                 ...
//                     ctor.Navigation
//             }
//         }
//         //this._ctor.Cells = this._ctor.Cells.Select(c => c + 3).ToList();
//         //this._ctor.Cells = this._ctor.Cells.Select()
//         //this._ctor.DateRange = this._ctor.DateRange.Select<Date>( dateRange => dateRange)
//
//     }
//     _GetInitHtml() : string {
//         const CtxHead = this._ctor.IsBuildInMode ? '' : `<div class="l-pp-head">
//                                             <div class="l-pp-caption">${"Выберите период"}</div>
//                                             <div class="l-pp-controls">
//                                                 <div class="l-pp-control l-pp-control-fullscreen {{Settings.IsShowButtonFullscreen ? '':'none'}}"></div>
//                                                 <div class="l-pp-control l-pp-control-close" onclick="this.Hide"></div>
//                                             </div>
//                                           </div>`;
//         const CtxDateNav = this._ctor.Navigation === void 0 ? '': `<div class="l-pp-date-navigator l-row l-flex-center l-flexa-center">
//                                                              <div class="l-pp-nav-month"></div>
//                                                              <div class="l-pp-nav-year"></div>
//                                                           </div>`;
//         const CtxBottom = this._ctor.IsMonthPickerMode ? '': `<div class="l-pp-bottom">
//                                 <div class="l-pp-result">
//                                     <div class="l-pp-date-values l-pp-date-date">
//                                         <div class="l-pp-textbox-holder">
//                                             <input class="l-textbox tb-date-start" value="{{CurrentSelection.DateStart}}" placeholder="${this._ctor.Format}">
//                                         </div>
//                                         <div class="l-pp-date-additional {{Settings.IsOnlyDay ? 'none':''}}">
//                                             <div class="l-pp-textbox-gap">
//                                                 <div> — </div>
//                                             </div>
//                                             <div class="l-pp-textbox-holder">
//                                                 <input class="l-textbox tb-date-end" value="{{CurrentSelection.DateFinish}}"  placeholder="${this._ctor.Format}">
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div class="l-pp-date-values l-pp-date-time {{Settings.IsShowTimePick && CurrentSelection.DateStart && CurrentSelection.DateFinish ? '':'none'}}">
//                                         <div class="l-pp-time-face l-pp-time-face-start">
//                                             <div class="l-pp-time-part l-pp-tp-start-hour"></div>
//                                             <div class="l-pp-time-part l-pp-tp-start-minute"></div>
//                                             <div class="l-pp-time-part l-pp-tp-start-second"></div>
//                                         </div>
//                                         <div class="l-pp-date-additional {{Settings.IsOnlyDay ? 'none':''}}">
//                                             <div class="l-pp-textbox-gap">
//                                                 <div> — </div>
//                                             </div>
//                                             <div class="l-pp-time-face l-pp-time-face-end">
//                                                 <div class="l-pp-time-part l-pp-tp-end-hour"></div>
//                                                 <div class="l-pp-time-part l-pp-tp-end-minute"></div>
//                                                 <div class="l-pp-time-part l-pp-tp-end-second"></div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 <div class="button-holder row flex-end">
//                                     <button class="l-button btn-l-pp-ok" onclick="this.OnButtonConfirm">Ok</button>
//                                 </div>
//                             </div>`;
//         const WeekSelector = this._ctor.IsShowWeekSelector ? `<div class="l-pp-week-select {{IsDeny ? 'l-pp-deny':''}} {{WeekSelectorVisible}}" onclick="this.OnWeekClick" data-value="{{DateValue}}">|</div>` : ``;
//
//         return `<div class="l-period_picker" style="display: none">
//                         ${CtxHead}
//                         ${!this._ctor.IsMonthPickerMode ? CtxDateNav: ''}
//                         <div class="l-pp-inner">
//                             <div class="l-pp-work-area">
//                                 <div class="l-pp-work-date">
//                                     <div class="l-pp-arrow l-pp-arrow-left pointer ${this._ctor.IsShowNavigationArrows? '':'none'}" onclick="this.MonthPrev"></div>
//                                     <div class="l-pp-content" onmousewheel="this.ShiftMonthWheel">
//                                         ${this._ctor.IsMonthPickerMode ? CtxDateNav: ''}
//                                         <each source="MonthRows">
//                                             <div class="l-pp-month-row">
//                                                 <each source="MonthBlocks">
//                                                     <div class="l-pp-month-block">
//                                                         <div class="l-pp-weekdays-row">${GetStaticWeekDaysRow(this._ctor)}</div>
//                                                         <div class="l-pp-month-name l-pp-month-select {{IsDeny ? 'l-pp-deny':''}}" data-value="{{DateValue}}" onclick="this.OnMonthClick">{{MonthName}}</div>
//                                                         <div class="l-pp-month-grid">
//                                                             <each source="MonthWeeks">
//                                                                 <div class="l-pp-month-week l-row">
//                                                                     ${WeekSelector}
//                                                                     <each source="Days">
//                                                                         <div class="l-pp-month-cell l-pp-cell {{IsDayOff? 'l-pp-dayoff':''}} {{DayType}}" data-type="{{DayType}}" data-value="{{DateValue}}" onclick="this.OnDayClick">{{DayValue}}</div>
//                                                                     </each>
//                                                                 </div>
//                                                             </each>
//                                                         </div>
//                                                     </div>
//                                                 </each>
//                                             </div>
//                                         </each>
//                                     </div>
//                                     <div class="l-pp-arrow l-pp-arrow-right pointer ${this._ctor.IsShowNavigationArrows? '':'none'}" onclick="this.MonthNext"></div>
//                                 </div>
//                             </div>
//                             ${CtxBottom}
//                         </div>
//                       </div>`
//     }
//     constructor(ctor: PeriodPickerCtorType){
//         this._InitCtor(ctor);
//         this._State = {
//                 //Dates: [void 0, void 0],
//                 CurrentSelection: {
//                     DateStart: void 0,
//                     DateFinish: void 0,
//                 },
//                 MonthRows: [],
//                 Settings: this._ctor,
//             };
//         this.Target = this._ctor.Target;
//
//         const html = this._GetInitHtml();
//         const State = this._State;
//
//         const PP = this;
//         class dp extends LuffContent {
//             State: IObservableState<DatePickerStateType>;
//             _TargetDateMonthInput: ComboBox;
//             _TargetDateYearInput: ComboBox;
//
//              //Dates: LuffDate[] = [void 0, void 0];
//             // CurrentSelection : {DateStart: LuffDate; DateFinish: LuffDate;} = {
//             //     DateStart: void 0,
//             //     DateFinish: void 0,
//             // };
//             CheckSelectionAndDirectConfirm() {
//                 this.CheckSelection();
//                 if (PP._State.Settings.IsDirectConfirm){
//                     let current = this.State.CurrentSelection.SValue;
//                     PP.Date = [current.DateStart.Clone(), current.DateFinish.Clone()];
//                     this.Confirm(false);
//                 }
//                 // if (PP._State.Settings.Con && this.State.CurrentSelection.DateFinish !== void 0){
//                 //     this.Confirm(!isBuildIn);
//                 // }
//                 this.Refresh();
//             };
//             CheckSelection() {
//                 if (this.State.CurrentSelection.DateFinish.SValue === void 0)
//                     return;
//                 let current = this.State.CurrentSelection.SValue;
//                 let Start = current.DateStart;
//                 let End   = current.DateFinish;
//                 if (Start.Date > End.Date){
//                     let dt = Start;
//                     Start = End;
//                     End = dt;
//                     this.State.CurrentSelection.DateStart.SValue  = Start;
//                     this.State.CurrentSelection.DateFinish.SValue = End;
//                 }
//
//                 if (PP._ctor.Min && End.Date < PP._ctor.Min.DayStart || PP._ctor.Max && Start.Date > PP._ctor.Max.DayEnd){
//                     this.State.CurrentSelection.DateStart.SValue = void 0;
//                     this.State.CurrentSelection.DateFinish.SValue = void 0;
//                     return;
//                 }
//                 if (PP._ctor.Min && Start.Date < PP._ctor.Min.Date){
//                     this.State.CurrentSelection.DateStart.SValue = PP._ctor.Min.Clone();
//                 }
//                 if (PP._ctor.Max && End.Date > PP._ctor.Max.Date){
//                     this.State.CurrentSelection.DateFinish.SValue = PP._ctor.Max.Clone();
//                 }
//                 if (!PP._State.Settings.IsShowTimePick){
//                     Start.SetDayStart();
//                     End.SetDayEnd();
//                 }
//                 if (PP._State.Settings.IsShowTimePick && PP._ctor.Min && Start.IsSameDate(PP._ctor.Min) && Start.Date < PP._ctor.Min.Date){
//                     Start.CopyTime(PP._ctor.Min);
//                 }
//                 if (PP._State.Settings.IsShowTimePick && PP._ctor.Max && End.IsSameDate(PP._ctor.Max) && Start.Date > PP._ctor.Max.Date){
//                     End.CopyTime(PP._ctor.Max);
//                 }
//                 if (PP._State.Settings.TimePickerMinuteStep > 1){
//                     Start.SetMinutes(LibraryNumber.RoundBy(Start.Minutes, PP._State.Settings.TimePickerMinuteStep, 'floor'));
//                     Start.SetSeconds(0);
//                     Start.SetMilliseconds(0);
//                     End.SetMinutes(LibraryNumber.RoundBy(End.Minutes, PP._State.Settings.TimePickerMinuteStep, 'floor'));
//                     End.SetSeconds(0);
//                     End.SetMilliseconds(0);
//                 }
//                 //this.State.CurrentSelection.DateStart.Value  = Show;
//                 //this.State.CurrentSelection.DateFinish.Value = End;
//             };
//
//             //#listeners
//             OnMonthClick(e: MouseEvent, p: TContentItem<MonthBlockType>) : void {
//                 if (p.Data.IsDeny || PP._State.Settings.IsOnlyDay)
//                     return;
//                 const dateValue = p.Data.DateValue;
//                 this.State.CurrentSelection.DateStart.SValue = dateValue.Clone().SetMonthStart();
//                 this.State.CurrentSelection.DateFinish.SValue = dateValue.Clone().SetMonthEnd();
//                 this.CheckSelectionAndDirectConfirm();
//             }
//             OnWeekClick(e: MouseEvent, p: TContentItem<MonthWeekType>) : void{
//                 if (p.Data.IsDeny || PP._State.Settings.IsOnlyDay)
//                     return;
//                 const dateValue = p.Data.DateValue;
//                 this.State.CurrentSelection.DateStart.SValue = dateValue.Clone().SetWeekStart();
//                 this.State.CurrentSelection.DateFinish.SValue = dateValue.Clone().SetWeekEnd();
//                 this.CheckSelectionAndDirectConfirm();
//             }
//             OnDayClick(e: MouseEvent, p: TContentItem<DayType>): void {
//                 if (p.Data.IsDayDeny)
//                     return;
//                 const dateValue = p.Data.DateValue;
//                 const current = this.State.CurrentSelection.SValue;
//                 if (PP._State.Settings.IsOnlyDay){
//                     this.State.CurrentSelection.DateStart.SValue = dateValue.SetDayStart();
//                     this.State.CurrentSelection.DateFinish.SValue = dateValue.SetDayEnd();
//                     return this.CheckSelectionAndDirectConfirm();
//                 }
//                 if (current.DateStart === void 0 || current.DateFinish !== void 0){
//                     this.State.CurrentSelection.DateStart.SValue = dateValue.SetDayStart();
//                     this.State.CurrentSelection.DateFinish.SValue = void 0;
//                 }
//                 else if (current.DateStart !== void 0 && current.DateFinish === void 0){
//                     this.State.CurrentSelection.DateFinish.SValue = dateValue.SetDayEnd();
//                 }
//                 this.CheckSelectionAndDirectConfirm();
//             }
//
//
//             ShiftMonthWheel(e: WheelEvent){
//                 this.ShiftMonth(e.deltaY > 0 ? 1 : -1);
//             }
//             MonthPrev(e: Event, p: any){
//                 this.ShiftMonth(-1);
//             }
//             MonthNext(e: Event, p: any){
//                 this.ShiftMonth(1);
//             }
//             ShiftMonth(delta: number): void{
//                 PP._ctor.DateTarget = PP._ctor.DateTarget.AddMonths(delta);
//                 this.Refresh();
//             }
//
//             GenerateMonth(Date: LuffDate) : MonthBlockType {
//                 let MonthBlock : MonthBlockType = {
//                     DateValue: Date.Clone().SetMonthStart(),
//                     MonthName: Date.Format('MMMM YYYY'),
//                     MonthWeeks: <any>[],
//                     IsDeny: false,
//                 };
//                 let Cursor = luffDate('01.'+Date.Format('MM.YYYY'));
//                 let CurrentWeek : MonthWeekType = {
//                     WeekSelectorVisible: PP._State.Settings.IsShowWeekSelector ?  '':'none',
//                     DateValue: Cursor.Clone().SetWeekStart(),
//                     Days: [],
//                     IsDeny: false,
//                 };
//                 let current = this.State.CurrentSelection.SValue;
//                 while (Cursor.Month === Date.Month){
//                     const WeekDay = Cursor.DayOfWeek;
//                     let isDeny = false;
//                     let DayType = '';
//                     //check for deny
//                     if ( (PP._ctor.Min && Cursor.Date < (PP._ctor.Min).DayStart ) || (PP._ctor.Max && Cursor.Date > (PP._ctor.Max).DayEnd ) ){
//                         DayType = 'l-pp-deny';
//                         isDeny = true;
//                     }
//                     //check for select
//                     if (!isDeny
//                         && current.DateStart && current.DateFinish
//                         && Cursor.Date >= current.DateStart.DayStart  && Cursor.Date <= current.DateFinish.DayEnd
//                     /*&& (PP.Settings.isDirectConfirm || PP.Settings.isOneDaySelection )*/){
//                         DayType =  'l-pp-selected';
//                     }
//                     if (!isDeny
//                         && !PP._State.Settings.IsOnlyDay
//                         && current.DateStart && current.DateFinish === void 0
//                         && Cursor.Date >= current.DateStart.DayStart && Cursor.Date <= current.DateStart.DayEnd){
//                         DayType =  'l-pp-selection-active';
//                     }
//                     let Day : DayType = {
//                         DateValue: Cursor.Clone().SetDayStart(),
//                         DayValue: Cursor.Format('DD'),
//                         DayType: DayType,
//                         IsDayOff: false,
//                         IsDayDeny: DayType === 'l-pp-deny',
//                         //DayOff: '',//(PP._State.Settings.WeekEndIndexes.indexOf(WeekDay) > -1 || PP.Settings.DayOffs.indexOf(Cursor.Date) > -1)? 'l-pp-dayoff':''
//                     };
//                     CurrentWeek.Days.push(Day);
//                     if (WeekDay === 7){
//                         CurrentWeek.IsDeny = CurrentWeek.Days.Where(x =>x.IsDayDeny).length === CurrentWeek.Days.length;
//                         MonthBlock.MonthWeeks.push(CurrentWeek);
//                         CurrentWeek = {
//                             WeekSelectorVisible: PP._State.Settings.IsShowWeekSelector ?  '':'none',
//                             //DateValue: Cursor.Clone().AddDays(1).Format('DD.MM.YYYY'),
//                             DateValue: Cursor.Clone().AddDays(1).SetWeekStart(),
//                             Days: [],
//                             IsDeny: false,
//                         };
//                     }
//                     if (Cursor.Day === Cursor.CountDays && CurrentWeek.Days.length > 0){
//                         CurrentWeek.IsDeny = CurrentWeek.Days.Where(x =>x.IsDayDeny).length === CurrentWeek.Days.length;
//                         //CurrentWeek.WeekType = CurrentWeek.Days.Where((x:any)=>x.DayType === 'l-pp-deny').length === CurrentWeek.Days.length ? 'l-pp-deny': '';
//                         MonthBlock.MonthWeeks.push(CurrentWeek);
//                     }
//                     Cursor.AddDays(1);
//                 }
//                 MonthBlock.IsDeny = MonthBlock.MonthWeeks.Where((x)=> x.IsDeny).length === MonthBlock.MonthWeeks.length;
//                 //MonthBlock.MonthType = MonthBlock.MonthWeeks.Where(x => x.WeekType !== '').length === MonthBlock.MonthWeeks.length ? 'l-pp-deny': '';
//                 return MonthBlock;
//             };
//             GenerateData() : MonthRowType[] {
//                 let MonthRows : MonthRowType[] = [];
//
//                 let Cursor = luffDate(PP._ctor.DateTarget).Clone();
//
//                 if (this._TargetDateMonthInput)
//                     this._TargetDateMonthInput.Value = Cursor.Month;
//                 if (this._TargetDateYearInput)
//                     this._TargetDateYearInput.Value = Cursor.Year;
//
//
//
//                 if (ctor.IsMonthPickerMode)
//                     return MonthRows;
//
//                 for (let row = 0; row < PP._State.Settings.Cells[0]; row++){
//                     let MonthBlocks : MonthBlockType[] = [];
//                     for (let col = 0; col < PP._State.Settings.Cells[1]; col++){
//                         MonthBlocks.push( this.GenerateMonth(Cursor));
//                         Cursor.AddMonths(1);
//                     }
//                     MonthRows.push({MonthBlocks: MonthBlocks});
//                 }
//
//                 return MonthRows;
//             };
//
//             Refresh(){
//                 //this.RefreshTimeTextboxes();
//                 console.time("[PP.GenerateData]");
//                 const Data = this.GenerateData();
//                 if (!ctor.IsMonthPickerMode)
//                     this.State.MonthRows.Value = Data;
//                 //this.Proto.Refresh();
//                 console.timeEnd("[PP.GenerateData]");
//             };
//
//
//             OnButtonConfirm(e: MouseEvent){
//                 console.log(e);
//             }
//             Confirm(e: any){
//
//             }
//
//             AfterBuild(): void {
//                 PP.Content = this.Content;
//                 if (PP._ctor.IsFullscreen)
//                     this.Content.classList.add('l-pp-fullscreen');
//                 if (PP._ctor.IsBuildInMode)
//                     this.Content.classList.add('l-pp-build-in');
//
//                 if (PP.Target){
//                     if (!PP._ctor.IsBuildInMode)
//                         PP.Target.classList.add('l-pp-target');
//
//                     PP.Target.addEventListener('click', ()=>{
//                         let xt = cc;
//                         this.Show();
//                         //PP.Content.style.display = '';
//                     })
//                 }
//             }
//             Ctor(): TContentCtor {
//                 return {
//                     //Content: `<div></div>`, //html,
//                     Content: html,
//                     //Target: ctor.Target,
//                     Target: document.body,
//                     Dialog: {
//                         Wrapper: false,
//                     },
//                     State: State,
//                     PropFormat: {
//                         'CurrentSelection.DateStart': (d: LuffDate) => d ? d.Format(PP._State.Settings.Format) : '',
//                         'CurrentSelection.DateFinish': (d: LuffDate) => d ? d.Format(PP._State.Settings.Format) : '',
//                     },
//                     BeforeShow(){
//                         this.Refresh();
//                     },
//
//                 }
//             }
//         }
//         let cc = new dp();
//         (<any>this).cc = cc;
//         (<any>this).cc._Init();
//
//         // this._Content.Refresh({
//         //     LineID: void 0,
//         //     Data: this._State,
//         //     State: this._State,
//         //     i: 0,
//         //     j: 0,
//         // });
//         //<ObservableState<DatePickerStateType>>//
//         // this._State = <any>new LuffState({
//         //     Obj: StateData,
//         //     PropTypes: {},
//         //     PropFormat: {},
//         //     OnSet: (state, value) => {
//         //         this._Content.Refresh();
//         //         console.log('[Luff.PeriodPicker.OnSet]', value, state);
//         //     },
//         //     Owner: void 0,
//         // });
//
//
//     }
// }