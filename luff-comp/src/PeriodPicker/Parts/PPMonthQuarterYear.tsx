import Luff, {React, IObservableStateSimple, LuffDate, Culture} from "luff";
import ComboBox from "../../Input/ComboBox/ComboBox";

type TPPNavProps = {
    navDate: IObservableStateSimple<LuffDate>;
    setNavDate: (d: LuffDate) => void;
    yearRange: number[];
    isMonth: boolean;
    isQuarter: boolean;
    dateMax: LuffDate;
    dateMin: LuffDate;
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

    Render(): any {
        let {navDate, setNavDate, isMonth, isQuarter, yearRange, dateMin, dateMax} = this.props;
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
                        dataStatic={years}
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