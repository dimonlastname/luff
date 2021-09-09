import Luff, {React, IObservableStateSimple, Culture, State, TContentCtor, Route} from "luff";
import './TextBox.scss';
import PeriodPicker from "../PeriodPicker/PeriodPicker";
import InputBoxBase, {TInputValidResult} from "./_InputBoxBase";


type TProps = {
    value: IObservableStateSimple<Date>;
    min?: Date | IObservableStateSimple<Date>;
    max?: Date | IObservableStateSimple<Date>;
    className?: string;
    onChange?: (val?: Date) => void;
    placeholder?: string;
    hourStep?: number;
    minuteStep?: number;
}


export class TimeBox extends InputBoxBase<TProps> {
    static defaultProps = {
        className: '',
        placeholder: '__:__',
        isPermissionWriteRequired: false,
        format: Culture.Current.DateFormat,
        formatTime: Culture.Current.DateFormatTime,
        isTimePick: false,

        hourStep: 1,
        minuteStep: 1,
    };
    private isMinState;
    private isMaxState;
    private minSt;
    private maxSt;

    RouteOfferList = new Route({DoNotUseRouter: true});

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

    public IsInputValidDefault() : TInputValidResult {
        const { value, min, max } = this.props;
        const v = value.SValue;
        if (min !== void 0 && v < min.valueOf()) {
            return {
                IsValid: false,
                Message: 'Значение меньше минимума'
            };
        }
        if (max !== void 0 && v > max.valueOf()) {
            return {
                IsValid: false,
                Message: 'Значение больше максимума'
            };
        }
        return {
            IsValid: true,
            Message: ''
        };
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
        });
    }
    Render(): any {
        let classState = this._IsDisabled.SubState(isDis => 'l-textbox l-timebox' + this.props.className + (isDis ? '': ' l-pointer'));
        let children = this.props.children;
        let isVis = Luff.State(false);
        return (
            <div className={classState}
                 //value={this.props.value}
                 // onChange={e => {
                 //       let value = e.target.value;
                 //       if (this.props.onChange) {
                 //           return this.props.onChange(value);
                 //       }
                 //       this.props.value.SValue = value;
                 //   }}
            >
                <span onClick={() => this.RouteOfferList.Toggle()} >{this.props.value.SubState(x => x ? Luff.Date(x).Format('HH:mm') : this.props.placeholder)}</span>
                <TimeBoxLists timeBox={this}/>
            </div>
        )

    }
}

type TListProps = {
    timeBox: TimeBox;
}

class TimeBoxLists extends Luff.Content<TListProps> {
    private IsReverseShow = Luff.State(false);
    protected OnAppear() {
        let boxRect = this.props.timeBox.DOM.getBoundingClientRect();
        let listRect = this.DOM.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const itemBottom = boxRect.top + boxRect.height + listRect.height;

        let isOver = itemBottom > windowHeight;
        console.log('windowHeight', windowHeight, 'itemBottom', itemBottom, 'boxRect.bottom', boxRect.top + boxRect.height, 'listRect.height', listRect.height, 'isOver:' ,isOver);
        this.IsReverseShow.SValue = isOver;

        // this.DOM.style.left = boxRect.left + 'px';
        // this.DOM.style.top = boxRect.top + boxRect.height + window.scrollY + 'px';
        // this.DOM.style.width = !widthByProps ? boxRect.width + 'px' : widthByProps;
        // this.Top = boxRect.y +  + window.scrollY;


    }

    Render() {
        const dt = this.props.timeBox.props.value;
        const hour = dt.SubState(d => d.getHours());
        const minute = dt.SubState(d => d.getMinutes());
        return (
            <div className="l-timebox-time-list list l-row" classDict={{reverseShow: this.IsReverseShow}}>
                <div className="sublist hours"
                     // onScroll={e => {
                     //     console.log(e.target.scrollHeight, e.target.scrollTop );
                     //     if (e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight) {
                     //         e.target.scrollTop = 0;
                     //     }
                     // }}
                >
                    {
                        (new Array(24).fill(0).map((x, i) => {

                            return (
                                <div
                                    className="l-tbt-item"
                                    onClick={() => {
                                        let d = dt.SValue;
                                        d.setHours(i);
                                        dt.SValue = d;
                                    }}
                                    classDict={{
                                        'l-tbt-selected': hour.SubState(h => h == i)
                                    }}
                                >{i}</div>
                            )
                        }))
                    }
                </div>
                <div className="sublist minutes">
                    {
                        (new Array(60).fill(0).map((x, i) => {
                            return (
                                <div
                                    className="l-tbt-item"
                                    onClick={() => {
                                        let d = dt.SValue;
                                        d.setMinutes(i);
                                        dt.SValue = d;
                                    }}
                                    classDict={{
                                        'l-tbt-selected': minute.SubState(m => m == i)
                                    }}
                                >{i}</div>
                            )
                        }))
                    }
                </div>
            </div>
        )
    }

    protected Ctor(): TContentCtor {
        return {
            Dialog: {
                IsGlobal: false,
                HasWrapper: false,
                //IsHideOnOutsideClick: true,
                OnOutsideClick: (e: Luff.MouseEvent) => {
                    if (!Luff.DOM.IsDescendant(e.target, this.ParentElement.DOM))
                        this.Hide();
                },
                Animation: null,
            },
            Route: this.props.timeBox.RouteOfferList
        }
    }
}
