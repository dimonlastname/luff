import Luff, {React, IObservableStateSimple, LuffDate, Culture, IObservableOrValue} from "luff";
import ComboBox from "../../Input/ComboBox/ComboBox";

type TPPNavProps = {
    navDate: IObservableStateSimple<LuffDate>;
    setNavDate: (d: LuffDate) => void;
    yearRange: number[];
    isMonth: boolean;
    isQuarter: boolean;
    dateMax: IObservableOrValue<LuffDate>;
    dateMin: IObservableOrValue<LuffDate>;
}

const quarters = [
    {ID: 1, Name:'I квартал'},
    {ID: 2, Name:'II квартал'},
    {ID: 3, Name:'III квартал'},
    {ID: 4, Name:'IV квартал'},
];



class PPMonthQuarterYear extends Luff.Content<TPPNavProps> {
    static defaultProps = {
        isMonth: true,
        //yearRange: [1960, luffDate().Year + 5],
    };

    private Years = Luff.State<number[]>([]);
    private CalculateYears() {
        const {navDate, yearRange} = this.props;

        const dateMin = Luff.State.GetSValueOrValue(this.props.dateMin);
        const dateMax = Luff.State.GetSValueOrValue(this.props.dateMax);

        if (dateMin) {
            yearRange[0] = dateMin.Year;
        }
        if (dateMax) {
            yearRange[1] = dateMax.Year;
        }

        let years = [];
        for (let y = yearRange[0]; y <= yearRange[1]; y++) {
            years.push(y);
        }
        const yearValue = navDate.SValue.Year;
        if (!years.includes(yearValue)) {
            years.push(yearValue);
        }
        years = years.sort((a, b) => a < b ? 1: -1);
    }

    Render(): Luff.Node {
        let {navDate, setNavDate, isMonth, isQuarter, yearRange, dateMin, dateMax} = this.props;
        Luff.State.TryAddOnChange(dateMin, _ => this.CalculateYears());
        Luff.State.TryAddOnChange(dateMax, _ => this.CalculateYears());
        this.CalculateYears();

        return (
            <div className="l-pp-date-navigator l-row l-flex-center l-flexa-center">
                {
                    isQuarter
                    &&
                    <div className="l-pp-nav-quarter">
                        <ComboBox value={navDate.SubState(date => date.Quarter)}
                                  dataStatic={quarters}
                                  dataDelegateValue={x => x.ID}
                                  dataDelegateView={x => x.Name}
                                  onChange={val => {
                                      //navDate.SValue = navDate.SValue.SetQuarter(val);
                                      setNavDate(navDate.SValue.SetQuarter(val));
                                      return Promise.resolve(1);
                                  }
                                  }>
                        </ComboBox>
                    </div>
                }
                {
                    isMonth
                    &&
                    <div className="l-pp-nav-month">
                        <ComboBox<string> value={navDate.SubState(date => date.Month)}
                                          dataStatic={Culture.Current.MonthNames}
                                          dataDelegateValue={ (month, i) => i}
                                          onChange={ val => {
                                              //navDate.SValue = navDate.SValue.SetMonth(val);
                                              setNavDate(navDate.SValue = navDate.SValue.SetMonth(val));
                                              return Promise.resolve(1);
                                          }}
                        />
                    </div>
                }
                <div className="l-pp-nav-year">
                    <ComboBox<number>
                        value={navDate.SubState(date => date.Year)}
                        data={this.Years}
                        onChange={ val => {
                            //navDate.SValue = navDate.SValue.SetYear(val);
                            setNavDate(navDate.SValue = navDate.SValue.SetYear(val));
                            return Promise.resolve(1)
                        }}  />
                </div>
            </div>
        )
    }
}



export default PPMonthQuarterYear;