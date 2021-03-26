import React from "../../Compiler/FakeReact";

import "./EachSorter.scss";
import {Each} from "./Each";
import {ComponentSimple} from "../ComponentSimple";
import {luffState} from "../../State";
import {IObservableStateSimple} from "../../../interfaces";


export type SortFn<T> = (item1: T, item2: T) => number;
interface ISort {
    Sort(direction: number) : void;
    SortMan: EachSorterMan<any>;
}

export interface ISortMan<T> {
    GenSortControl(comparer: SortFn<T>) : typeof EachSorter;
    GenSortControlByField(fieldName: keyof T) : typeof EachSorter;
}

enum SortDirectionType {
    Default = 0,
    Up = 1,
    Down = -1,
}

// abstract class ASorterMan {
//     protected _Each: Each;
//     protected _SorterComps: ComponentSortControl[];
//     SortMan: EachSorterMan<any>;
//     SortFuck(direction: number) : void {};
// }

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });


export class EachSorterMan<DataItem> implements ISortMan<DataItem> {
    _Each: Each<DataItem>;
    _SorterComps: ComponentSortControl[] = [];
    _DefaultSort: SortFn<DataItem>;

    GenSortControl(comparer: SortFn<DataItem>) : typeof EachSorter {
        const sortMan = this;
        class EachSorterXXX extends EachSorter {
            static Sort(direction: number) {}
            static SortMan = sortMan;
        }
        EachSorterXXX.Sort = (direction: number) => {
            if (!this._Each) {
                throw new Error('[Luff.Each] Missed "sortManager" prop of Each component');
            }
            if (direction === 0) {
                this._Each.Sort(this._DefaultSort);
                return;
            }
            if (direction === 1) {
                this._Each.Sort(comparer);
                return;
            }
            this._Each.Sort((a, b) => {
                return comparer(a, b) * -1;
            });
        };
        return EachSorterXXX;
    }
    GenSortControlByField(fieldName: keyof DataItem) : typeof EachSorter  {
        const comparer = (a: DataItem, b: DataItem) => {

            let valueA = a[fieldName] as any;
            let valueB = b[fieldName] as any;

            if (valueA && valueA.localeCompare) { //if string and ok browser
                return collator.compare(valueA, valueB);
            }

            if (valueA > valueB)
                return 1;
            if (valueA < valueB)
                return -1;
            return 0;
        };
        return this.GenSortControl(comparer);
    }
    constructor(defaultSort?: SortFn<DataItem>) {
        this._DefaultSort = defaultSort;
    }
}



class ComponentSortControl extends ComponentSimple {
    Direction: IObservableStateSimple<number> = luffState(SortDirectionType.Default);

    SwitchSort() : number {
        if (this.Direction.SValue === SortDirectionType.Default) {
            this.Direction.SValue = SortDirectionType.Up;
        }
        else if (this.Direction.SValue === SortDirectionType.Up) {
            this.Direction.SValue = SortDirectionType.Down;
        }
        else if (this.Direction.SValue === SortDirectionType.Down) {
            this.Direction.SValue = SortDirectionType.Default;
        }

        return this.Direction.SValue;
    }

    Render(): any {
        const classSorter = this.Direction.SubState(d => {
            if (this.Direction.SValue === SortDirectionType.Default) {
                return 'l-sorter'
            }
            else if (this.Direction.SValue === SortDirectionType.Up) {
                return 'l-sorter l-sorter-up'
            }
            return 'l-sorter l-sorter-down'
        });
        return (
            <div class={classSorter} onClick={() => this.SwitchSort()}/>
        )
    }
}

export class EachSorter extends ComponentSimple {
    Render()  {
        return this.props.children;
    }
    AfterBuild(): void {
        this.DOM = this.GetFirstDOMElement();
        const stylePosition = getComputedStyle(this.DOM).position.toLowerCase();
        if (stylePosition !== 'absolute' && stylePosition !== 'relative')
            this.DOM.style.position = 'relative';
        this.DOM.classList.add('l-sorter-container');

        const eachSorter = this.constructor as any as ISort;
        let sorterComponents = eachSorter.SortMan._SorterComps;
        let sorterComponent = new ComponentSortControl();
        sorterComponents.push(sorterComponent);

        const oldSort = sorterComponent.SwitchSort.bind(sorterComponent);

        sorterComponent.SwitchSort = () => {
            for (let sComp of sorterComponents) {
                if (sComp !== sorterComponent) {
                    sComp.Direction.SValue = 0;
                }
            }
            let direction = oldSort();
            eachSorter.Sort(direction);
            return direction;
        };
        let sorterDom = sorterComponent._GenerateDOM();
        this.DOM.appendChild(sorterDom);
    }
}