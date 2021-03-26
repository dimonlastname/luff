import React from "../../Compiler/FakeReact";
import {Each} from "./Each";
import {ComponentSimple} from "../ComponentSimple";
import {JSXElement} from "../IElement";
import {luffState} from "../../State";
import {Culture, luffDate, LibraryString} from "../../../Library";
import {IObservableState, IObservableStateSimple, IObservableStateArray} from "../../../interfaces";

export type TFilterFn<T> = (item: T, lineID?: number) => boolean;
type TCustomFilterProps<T> = {
    Deps: Array<IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>>;
    Filter: TFilterFn<T>;
}

export interface IFilterMan<T> {
    //GenFilterControl(predicate: TFilterFn<T>) : typeof FilterInstance;
    GenFilter(render: (outProps: TCustomFilterProps<T>) => JSXElement);
    GenFilterDate(fieldName: keyof T, caption: string) : JSXElement;
    GenFilterTextSearch(fieldNames: Array<keyof T>, caption: string, customFilter?: (item: T) => boolean) : JSXElement
    GenFilterTextSearchCustom(caption: string, textState: IObservableStateSimple<string>, filter: (item: T) => boolean) : JSXElement
}
interface IFilter {
    Filter(pred: TFilterFn<any>) : void;
    FilterMan: EachFilterMan<any>;
}

class ComponentFilterControl extends ComponentSimple {
    SwitchSort() : number {

        return 1;
    }
    Render(): any {
        // const classSorter = this.Direction.SubState(d => {
        //     if (this.Direction.SValue === SortDirectionType.Default) {
        //         return 'l-sorter'
        //     }
        //     else if (this.Direction.SValue === SortDirectionType.Up) {
        //         return 'l-sorter l-sorter-up'
        //     }
        //     return 'l-sorter l-sorter-down'
        // });
        return (
            <div class="l-filter" onClick={() => this.SwitchSort()}/>
        )
    }
}

export class EachFilterMan<DataItem> implements IFilterMan<DataItem> {
    _Each: Each;
    _SorterComps: ComponentFilterControl[] = [];
    _deps = [];
    _filters: TFilterFn<DataItem>[] = [];

    GenFilter(render: (outProps: TCustomFilterProps<DataItem>) => JSXElement) {
        const out : TCustomFilterProps<DataItem> = {
            Deps: [],
            Filter: void 0,
        };

        let comp = render(out);
        if (!out.Filter) {
            throw new Error(`[Luff.Each] Missed 'Filter' property in outProps on generating custom filter`);
        }
        this._filters.push(out.Filter);
        this._deps.push.apply(this._deps, out.Deps);
        return comp;
    }

    GenFilterDate(fieldName: keyof DataItem, caption: string) : JSXElement {
        if (!___LuffGlobal.PeriodPicker) {
            throw new Error(`[Luff.Each] Filter manager's method 'GenFilterDate' requires 'luff-comp' library`);
        }

        const dateStart = luffState<Date>(null);
        const dateFinish = luffState<Date>(null);
        const dateView = dateFinish.SubState(df => {
            const ds = dateStart.SValue;

            if (!df) {
                return Culture.Current.Lang.ChoosePeriod;
            }
            if (ds && df) {
                let luffDateStart = luffDate(ds);
                let luffDateFinish = luffDate(df);
                return `${luffDateStart.Format(Culture.Current.DateFormat)} — ${luffDateFinish.Format(Culture.Current.DateFormat)}`

            }
        });
        function callPeriodPicker() {
            const ds = dateStart.SValue;
            const df = dateFinish.SValue;

            // dateStart.SValue = Luff.Date(ds).AddDays(1).Date;
            // dateFinish.SValue = Luff.Date(df).AddDays(1).Date;
            ___LuffGlobal.PeriodPicker.GlobalRangePicker.RunRange([ds, df], ((dStart, dFinish) => {
                dateStart.SValue = dStart.Date;
                dateFinish.SValue = dFinish.Date;
            }), {
                isShowTimePick: false,
            });
        }
        function reset() {
            dateStart.SValue = null;
            dateFinish.SValue = null;
        }
        this._deps.push(dateFinish);
        this._filters.push((item) => {
            const ds = dateStart.SValue;
            const df = dateFinish.SValue;
            if (!df)
                return true;
            const dateValue = item[fieldName] as any as Date;
            return dateValue >= ds && dateValue <= df;
        });
        return (
            <div className="fu-item">
                <div className="caption">{caption}</div>
                <div className="value" onClick={() => callPeriodPicker()}>{dateView}</div>
                <div className="fu-reset" onClick={() => reset()} isVisible={dateFinish.SubState(d => !!d)}> X </div>
            </div>
        )
    }

    GenFilterTextSearchCustom(caption: string, textState: IObservableStateSimple<string>, filter: (item: DataItem) => boolean) : JSXElement {
        const TextBox = ___LuffGlobal.Inputs.TextBox;
        if (!TextBox) {
            throw new Error(`[Luff.Each] Filter manager's method 'GenFilterTextSearch' requires 'luff-comp' library`);
        }
        this._deps.push(textState);
        this._filters.push(filter);
        return (
            <div className="fu-item" >
                <div className="caption">{caption}</div>
                <div className="value">
                    <TextBox value={textState} placeholder="" className='l-textbox-filter-search'/>
                </div>
                <div className="fu-reset" onClick={() => textState.SValue = ''} isVisible={textState.SubState(t => t.length > 0)}> X </div>
            </div>
        )
    }

    GenFilterTextSearch(fieldNames: Array<keyof DataItem>, caption: string) : JSXElement {
        const TextBox = ___LuffGlobal.Inputs.TextBox;
        if (!TextBox) {
            throw new Error(`[Luff.Each] Filter manager's method 'GenFilterTextSearch' requires 'luff-comp' library`);
        }

        const text = luffState('');
        this._deps.push(text);
        this._filters.push((item) => {
            let textWhere = '';
            for (let fieldName of fieldNames) {
                textWhere += item[fieldName];
            }
            return LibraryString.IsTextIncludes(text.SValue, textWhere);
        });
        return (
            <div className="fu-item" >
                <div className="caption">{caption}</div>
                <div className="value">
                    <TextBox value={text} placeholder="" className='l-textbox-filter-search'/>
                </div>
                <div className="fu-reset" onClick={() => text.SValue = ''} isVisible={text.SubState(t => t.length > 0)}> X </div>
            </div>
        )
    }
}

export class FilterInstance extends ComponentSimple {
    Render()  {
        return this.props.children;
    }
    AfterBuild(): void {
        const stylePosition = getComputedStyle(this.DOM).position.toLowerCase();
        if (stylePosition !== 'absolute' && stylePosition !== 'relative')
            this.DOM.style.position = 'relative';
        this.DOM.classList.add('l-sorter-container');

        const eachFilter = this.constructor as any as IFilter;
        let filterComponents = eachFilter.FilterMan._SorterComps;
        let filterComponent = new ComponentFilterControl();
        filterComponents.push(filterComponent);

        const oldSort = filterComponent.SwitchSort.bind(filterComponent);

        filterComponent.SwitchSort = () => {
            // for (let sComp of filterComponents) {
            //     if (sComp !== filterComponent) {
            //         sComp.Direction.SValue = 0;
            //     }
            // }
            // let direction = oldSort();
            eachFilter.Filter(null);
            return 1;
        };
        let sorterDom = filterComponent._GenerateDOM();
        this.DOM.appendChild(sorterDom);
    }
}