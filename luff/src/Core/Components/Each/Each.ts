import {DictN, IObservableState, IObservableStateArray, IObservableStateSimple, IObservableStateAny} from "../../../interfaces";
import {ElementBase} from "../ElementBase";
import {IElement, TRawComponent, TPropsDefault, JSXElement} from "../IElement";
import {ComponentFactory, IRenderElement} from "../../Compiler/ComponentFactory";
import {State, StateArray, luffState} from "../../State";
import {EachSorterMan, ISortMan, SortFn} from "./EachSorter";
import EachPaging from "./EachPaging";
import {EachFilterMan, IFilterMan, TFilterFn} from "./FilterManager";

export {EachPaging};

type TRenderFn<T> = (item: IObservableStateAny<T> , index?: IObservableStateSimple<number>, each?: Each<T>) => JSXElement;

type TEachProps<T> = {
    source?: IObservableStateArray<T>;
    render?: TRenderFn<T>;

    isRefreshOnAnyChange?: boolean;
    sortManager?: ISortMan<any>;
    filterManager?: IFilterMan<any>;
    //sort?: (item1: T, item2: T) => boolean;
    filter?: (item: T, lineID?: number) => boolean;
    paging?: EachPaging;

    deps?: (IObservableStateSimple<any> | IObservableState<any> | IObservableStateArray<any>)[];

    renderOnEmpty?: (item: T) => any;
    pageSize?: number;
} | TPropsDefault;



type TEachItem = {
    Components: IElement[];
    LineID: number;
}
function tryInsertAfter(newNode: HTMLElement, existingNode: HTMLElement, parent: HTMLElement) {
    if (existingNode && existingNode.parentNode){
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
        return;
    }
    parent.appendChild(newNode);
}
export type TPaging = {
    Skip: number;
    Take: number;
    Count: number;
}

type TEachValue = {
    Index: IObservableStateSimple<number>;
    LineID: number;
    Component: IElement
}

export class Each<TIterationItem = any> extends ElementBase<TEachProps<TIterationItem>>  {
    static GetSortManager<T>(defaultSort?: SortFn<T>) : ISortMan<T> {
        return new EachSorterMan<T>(defaultSort);
    }
    static GetFilterManager<T>() : IFilterMan<T> {
        return new EachFilterMan<T>();
    }
    static GetPaging(pageSize: number, itemsCount: number = 1) : EachPaging {
        return new EachPaging({
            Skip: 0,
            Take: pageSize,
            Count: itemsCount,
        });
    }
    public GetRenderedKeys() : number[] {
        return this._RenderedKeys;
    }
    public GetFilteredKeys() : number[] {
        return this._FilteredKeys;
    }
    public GetDOMByItemState(itemState: IObservableState<TIterationItem>) : HTMLElement {
        let item = this._MapElements.get(itemState as any as State);
        return item.Component.GetFirstDOM();
    }
    public GetItemStateByIndex(index: number) : IObservableState<TIterationItem> {
        return this._StateArray[index];
    }

    private _IsRefreshOnAnyChange: boolean = false;

    private _SortDelegate: (a: TIterationItem, b: TIterationItem) => number;
    private _Sorted: boolean = false;

    private _RenderedKeys: number[] = [];
    private _SortedKeys: number[] = [];
    private _FilteredKeys: number[] = [];

    private _FilterDelegate: (v: TIterationItem, index: number) => boolean;


    private _EachPaging: EachPaging;
    private _ChildRender: (item: State<TIterationItem>, index: IObservableStateSimple<number>, each: Each<TIterationItem>) => ElementBase;
    private _ChildEmptyRender: () => IRenderElement;
    private _ChildrenWhenEmpty: ElementBase[] = [];

    private _StateArray: StateArray<any>;

    //_EachItemList: TEachItem[] = [];
    private _CompList: IElement[] = [];
    private _CompEmptyList: IElement[] = [];
    //private _DOMList: HTMLElement[] = [];
    //private _DOMEmptyList: HTMLElement[] = [];

    private _MapElements = new Map<State, TEachValue>();

    private _FilterByManager: TFilterFn<TIterationItem>;


    private _GenerateItem(state: State, lineID: number, index: number): TEachValue {
        const numState = luffState(index);

        const childItem = this._ChildRender(state, numState, this) as any;// as any as ComponentBase;//TODO check each!!!
        const childElement = ComponentFactory.Build(childItem, this, this.ParentComponent);
        const childDom = childElement._GenerateDOM();



        const item : TEachValue = {
            Index: numState,
            LineID: lineID,
            Component: childElement,
        };
        this._MapElements.set(state, item);
        this._CompList.push(childElement);

        // let lastDOM;
        // if (prevEachItem !== void 0) {
        //     lastDOM = prevEachItem.Components[prevEachItem.Components.length - 1].DOM;
        // }
        // for( let c of childDom)
        // {
        //     //NOTE: maybe here should be insertAfter last each child?
        //     // if (Target !== null)
        //     //     Target.appendChild(c);
        //     //tryInsertAfter(c, lastDOM, this.ParentElement.DOM);
        //     this._InsertHTML(c);
        //     //this._DOMList.push(c);
        //     this._CompList.push(childElement)
        // }
        // if (this.ParentElement.DOM.isConnected)
        //     childElement._Appear();
        return item;
    }

    private _GenerateChildren(): void {
        this.Refresh();
    }
    private _GenerateEmptyChildren() : void {
        this._CompEmptyList = [];

        if (!this._ChildEmptyRender)
            return;

        let childItem : IRenderElement = this._ChildEmptyRender(); //TODO check each!!!;
        const childElement : IElement = ComponentFactory.Build(childItem, this, this.ParentComponent);
        let childDOMs = childElement._GenerateDOM();
        this._CompEmptyList.push(childElement);
        // for( let c of childDOMs) {
        //     this._CompEmptyList.push(childElement);
        // }
    }

    private _HideItem(comp: IElement) : void {
        // comp.Hide();
        // comp.DOM.remove();
        comp._HideTransitionFunction();
        comp._Disappear();
    }
    private _ShowItem(comp: IElement, isNew: boolean) : void {
        if (isNew && (comp as ElementBase)._IsHiddenByDefault)
            return;

        comp._ShowTransitionFunction();
        comp._Appear();
    }

    private _ShowEmptyChildren() : void {
        this._HideEachChildren();
        if (this._CompEmptyList.length === 0){
            this._GenerateEmptyChildren();
        }
        for (let ch of this._CompEmptyList) {
            this._ShowItem(ch, false);
            // TargetDOM.appendChild(ch.DOM);
            // ch.Show();
        }
        // for (let emt of this._ChildrenWhenEmpty){
        //     emt.Refresh(); //TODO check refresh each
        // }
    }
    private _HideEmptyChildren(): void {
        for (let ch of this._CompEmptyList){
            this._HideItem(ch);
        }
    }
    private _HideEachChildren(/*since: number*/): void {
        for (let ch of this._CompList){
            this._HideItem(ch);
        }
    }

    private _QuickSortFilter(objectKeys?: number[]) : number[] {
        const data = this._StateArray.SValue;

        if (data === void 0 || data === null)
            return [];
        if (!objectKeys)
            objectKeys = Array.from(this._StateArray.SValue.keys()); //Object.keys(this._StateArray.SValue);
        if (objectKeys.length < 1 || (!this._FilterDelegate && !this._FilterByManager && !this._SortDelegate && !this._EachPaging)) {
            return objectKeys;
        }
        const pivotKey = objectKeys[Math.floor(objectKeys.length/2)];
        const pivotValue = this._StateArray._GetChildByKey(pivotKey).SValue;

        let left = [];
        let right = [];
        let equal = [];


        for (let key of objectKeys) {
            let value = this._StateArray._GetChildByKey(key).SValue;
            if (this._FilterDelegate && !this._FilterDelegate(value, key)) {
                continue;
            }
            if (this._FilterByManager && !this._FilterByManager(value, key)) {
                continue;
            }

            this._FilteredKeys.push(key);
            if (this._SortDelegate && this._SortDelegate(value, pivotValue) < 0){
                left.push(key)
            }
            else if (this._SortDelegate && this._SortDelegate(value, pivotValue) > 0){
                right.push(key)
            }
            else {
                equal.push(key);
            }
        }
        return [
            ...this._QuickSortFilter(left),
            ...equal,
            ...this._QuickSortFilter(right)
        ];
    }
    private _GetKeysForRender(objectKeys?: number[]): number[]  {
        this._FilteredKeys = [];
        let keys = this._QuickSortFilter(objectKeys);
        if (this._EachPaging) {
            const itemsCount = keys.length;
            this._EachPaging.Paging.Count.SValue = itemsCount;
            let skip = this._EachPaging.Paging.Skip.SValue;
            let take = this._EachPaging.Paging.Take.SValue;


            if (skip > itemsCount) {
                skip = itemsCount - take;
            }
            if (skip < 0) {
                skip = 0;
            }
            if (this._EachPaging.Paging.Skip.SValue !== skip) {
                this._EachPaging._IsPagingRefreshLocked = true; // fixes double refresh;
                this._EachPaging.Paging.Skip.SValue = skip;
                this._EachPaging._IsPagingRefreshLocked = false;// fixes double refresh;
            }
            keys = keys.slice(skip, skip + take);
        }
        this._RenderedKeys = keys;
        this._FilteredKeys = [...new Set(this._FilteredKeys)];
        return keys;
    };

    private _RenderKeys(filteredKeys: number[], eachData: StateArray<TIterationItem>, targetDOM: Element) {
        if (filteredKeys.length === 0) {
            this._ShowEmptyChildren();
        } else {
            this._HideEmptyChildren();
        }
        const generatedKeys = this._MapElements.keys();
        let eachItems : DictN<TEachValue> = {};

        for (let key of generatedKeys) {
            const item = this._MapElements.get(key);
            if (!filteredKeys.includes(item.LineID)) {
                this._HideItem(item.Component);
                continue;
            }
            eachItems[item.LineID] = item;
        }

        let index = 0;
        if (this._EachPaging) {
            index = this._EachPaging.Paging.Skip.SValue + 1;
        }
        for (let key of filteredKeys) {
            const existsItem = eachItems[key];
            if (existsItem) {
                existsItem.Index.SValue = index;
                index++;
                this._HideItem(existsItem.Component); //to force mount element //fixme
                this._ShowItem(existsItem.Component, false);
                // this._InsertHTML(existsItem.Component.DOM);
                // if (this.ParentElement.DOM.isConnected)
                //     existsItem.Component.Show();
                continue;
            }
            let valueState = eachData._GetChildByKey(key);
            if (!valueState) {
                console.error('[Luff.Each] Probably value of StateArray has been changed not by set SValue. Or using .Add(item) to multiple StateArrays with the same value. \nBroken StateArray:', eachData, '\nBroken Each:', this);
                continue;
            }

            let value = valueState.SValue;
            if (value === void 0){
                continue;
            }
            eachItems[key] = this._GenerateItem(valueState, key, index);
            this._ShowItem(eachItems[key].Component, true);
            index++;
        }
    }


    private Refresh(): void {
        let targetDOM = this.GetTargetRenderDOM();
        if (!this._StateArray || this._StateArray.length === 0) {
            this._ShowEmptyChildren();
            return;
        }
        this._SortedKeys = this._GetKeysForRender();
        // if (this._Pagination.PageSize > 0)
        //     filteredKeys = filteredKeys.slice(this._Pagination.Offset, this._Pagination.Offset + this._Pagination.PageSize);
        this._RenderKeys(this._RenderedKeys, this._StateArray, targetDOM);
    }
    private RefreshLite() : void {
        let EachData = this._StateArray;
        let TargetDOM = this.GetTargetRenderDOM();
        if (!EachData || this._StateArray.length === 0) {
            this._ShowEmptyChildren();
            return;
        }
        // if (this._Pagination.PageSize > 0)
        //     filteredKeys = filteredKeys.slice(this._Pagination.Offset, this._Pagination.Offset + this._Pagination.PageSize);
        this._RenderKeys(this._RenderedKeys, EachData, TargetDOM);
    }
    Sort(sorter: (a: TIterationItem, b: TIterationItem) => number) : void {
        this._SortDelegate = sorter;
        this._Sorted = false;
        this._SortedKeys = this._GetKeysForRender();
        this.RefreshLite();
    }
    Filter(filter: (v: TIterationItem, index: number) => boolean = this._FilterDelegate) : void {
        this._FilterDelegate = filter;
        this._SortedKeys = this._GetKeysForRender();
        this.RefreshLite();
    }

    _GenerateDOM() {
        super._GenerateDOM();

        if (!this._StateArray || this._StateArray.length === 0 ){
            this._GenerateEmptyChildren();
            this._ShowEmptyChildren();
            return void 0;
        }
        this._GenerateChildren();
        return void 0;
    }
    constructor(rawComponent: TRawComponent) {
        super(rawComponent);
        if (!this.HasPermission) {
            return;
        }

        this._StateArray = rawComponent.Attributes['source'];
        this._StateArray.AddOnChange((newValue, changedState) => {
            //console.log('[Each refresh] ', this.Name);
            if (this._IsRefreshOnAnyChange) {
                this.Refresh();
                return;
            }
            if (changedState === this._StateArray) {
                // if (this._EachPaging && this._StateArray.SValue.length <= this._EachPaging.Paging.Skip.SValue) {
                //     this._EachPaging.Paging.Skip.SValue = this._StateArray.length - this._EachPaging.Paging.Take.SValue;
                //     return; //refresh will be on .Skip.SValue change
                // }
                this.Refresh();
            }
        });

        this._IsRefreshOnAnyChange = rawComponent.Attributes['isRefreshOnAnyChange'];
        if (this._IsRefreshOnAnyChange !== true) {
            this._IsRefreshOnAnyChange = false;
        }
        this._ChildRender = rawComponent.Attributes['render'];
        this._ChildEmptyRender = rawComponent.Attributes['renderOnEmpty'];

        this._EachPaging = rawComponent.Attributes['paging'];
        if (this._EachPaging) {
            //this._EachPaging._ItemsCount = (this._StateArray as any as IObservableStateArray<any>).SubState(x => x.length);
            this._EachPaging.Paging.Skip.AddOnChange(() => {
                if (this._EachPaging._IsPagingRefreshLocked)
                    return;
                //console.log('[Each] Paging.OnChange');
                this.Filter();
            });
            this._EachPaging.Paging.Take.AddOnChange(() => {
                if (this._EachPaging._IsPagingRefreshLocked)
                    return;
                //console.log('[Each] Paging.OnChange');
                this.Filter();
            })
        }
        const deps = rawComponent.Attributes['deps'] as IObservableState<any>[];
        if (rawComponent.Attributes['deps']) {
            for (let dep of deps) {
                dep.AddOnChange(() => {
                    this.Refresh();
                })
            }
        }


        /*SORT*/
        const sortMan = rawComponent.Attributes['sortManager'] as EachSorterMan<TIterationItem>;

        if (sortMan) {
            sortMan._Each = this;
            this._SortDelegate = sortMan._DefaultSort;
        }

        /*FILTER*/
        this._FilterDelegate = rawComponent.Attributes['filter'];
        const filterMan = rawComponent.Attributes['filterManager'] as EachFilterMan<TIterationItem>;

        if (filterMan) {
            filterMan._Each = this;
            for (let dep of filterMan._deps) {
                dep.AddOnChange(() => {
                    this.Refresh();
                })
            }
            this._FilterByManager = (item, i) => {
                for (let f of filterMan._filters) {
                    if (!f(item, i))
                        return false;
                }
                return true;
            }
        }
    }
}
