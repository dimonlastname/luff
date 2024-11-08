import {PropTypes} from "../Library/PropTypes";
import {
    IObservableState,
    IObservableStateArray, IObservableStateSimple,
    IObservableStateSimpleOrValue,
    SelectDelegate,
    WhereDelegate
} from "../interfaces";
import {LibraryArray} from "../Library/Array";
import {LibraryNumber} from "../Library";

type TStateCtor = {
    State?: any;

    Property?: string;
    Parent?: State;
    OnChange?: TStateOnChange<any>;

    //Dependencies?: State[];
}
type TSubscriberFn = (changedState: State) => void;
type TSubscriber = {
    State: State;
    ChangedState: State;
};
export type TStateOnChange<T> = (newValue?: T/* | T[]*/, changedState?: State) => void;
//export type TStateOnChange<T> = (newValue?: T/* | T[]*/, changedState?: (T extends object ? IObservableState<T> : IObservableStateSimple<T>)) => void;


export class State<T = any> {
    Name: string;
    _ID = LibraryNumber.GetID();

    __SValue: any;
    __SValuePrev: any;
    _Parent: State;
    _Property: string = 'root';
    _Subscribers: TStateOnChange<T>[];// = [];

    private _GetFullPath() : string {
        let p = this._Parent;
        let path = this._Property;
        while (p) {
            path = p._Property + "." + path;
            p = p._Parent;
        }
        return path;
    }
    private _CollectSubscribers() : TSubscriberFn[] {
        let ss = [];
        if (this._Subscribers) {
            for (let fn of this._Subscribers)
                ss.push((changedState) => {
                    // console.log('subscriber', this.constructor.name, this.__SValue, fn);
                    fn(this.__SValue, changedState)
                });
        }
        return ss;
    }
    _OnChange(changedState: State, subscribes: TSubscriber[]) : void {
        //get subscribers
        if (this._Subscribers) {
            subscribes.push({State: this, ChangedState: changedState});
        }
    }
    _UpdateParents(changedState: State, subscribes: TSubscriber[]): void {
        let child : State = this;
        let par = this._Parent;
        while (par){
            par._UpdateValue(child, changedState, subscribes);
            child = par;
            par = par._Parent;
        }
        let usedStates = [];

        for (let s of subscribes) {
            if (!usedStates.includes(s.State)) {
                usedStates.push(s.State);
                let ss = s.State._CollectSubscribers();
                for (let fn of ss) {
                    fn(s.ChangedState);
                }
            }
        }
    }
    public ForceUpdate() : void {
        this._Update(this.SValue);
    }

    public AddOnChange(onChange: TStateOnChange<T>) : void {
        this._AddOnChange(onChange);
    }

    _AddOnChange(onChange: TStateOnChange<T>) : void {
        if (!this._Subscribers)
            this._Subscribers = [];
        this._Subscribers.push(onChange);
    }
    public RemoveOnChange(onChange: TStateOnChange<T>): void {
        LibraryArray.Remove(this._Subscribers, x => x === onChange);
    }
    _UpdateValue(childState: State, changedState: State, subscribes: TSubscriber[]): void {
        this.__SValue[childState._Property] = childState.__SValue;
        this._OnChange(changedState, subscribes);
    }
    // _UpdateParentsOld(changedState: State): void {
    //     let child : State = this;
    //     let par = this._Parent;
    //     while (par){
    //         par._UpdateValue(child, changedState);
    //         child = par;
    //         par = par._Parent;
    //     }
    // }

    __GetChildByKey(childName: string | number): State<any> {
        if (childName === '' || childName == void 0 || childName === null)
            return null;
        return (this as any)[childName];
    }
    private _TryRefreshChild(childProperty: string | number, obj: any, ss: TSubscriber[]): boolean {
        let child = this.__GetChildByKey(childProperty);
        //console.log(`[_TrySetValueToChild]`, childProperty, obj, child);
        if (child &&
            (
                (Array.isArray(obj) && child instanceof StateArray) //was single state (ex. undefined value), but now is array
                ||
                (!Array.isArray(obj) && child instanceof StateSingle) //was array state (impossible using ts), but now is single
            )
        )
        {
            child.Refresh(obj, ss);
            return true;
        }
        return false;
    }
    _GetChildStateNew(child: any, propertyName: string | number) : State {
        let childState : State;
        let childType = PropTypes.GetType(child);
        let ctor : TStateCtor = {State: child, Property: propertyName.toString(), Parent: this};

        if (childType !== 'array')
            childState = new StateSingle(ctor);
        else
            childState = new StateArray(ctor);

        return childState;
    }
    _GetChildState(child: any, propertyName: string | number, ss: TSubscriber[]) : State {
        let childState : State; //= new ctr<T>(ctor);
        if (child instanceof State) {
            childState = child;
        }
        else {
            //NOTE: experimental: gives +30% _Compile boost with same data count, ~ +15% boost with LuffComponent update
            let isChildUpdated = this._TryRefreshChild(propertyName, child, ss);
            if (isChildUpdated){
                childState = this.__GetChildByKey(propertyName);
                //this._OnChange(childState, ss);
            }
            else {
                childState = this._GetChildStateNew(child, propertyName);
            }
        }
        return childState;
    }
    _CompileArray(state: Array<any>, ss: TSubscriber[]) {
        this.__SValue = [];
        let ssLength = ss.length;
        for (let i = 0; i < state.length; i++){
            let child = state[i];
            let childState : State = this._GetChildState(child, i, ss);
            this.__SValue[i] = childState.__SValue;
            Object.defineProperty(this, i, {
                value: childState,
                configurable: true,
            });
        }
        if (ssLength < ss.length) { //if child updated
            this._OnChange(this, ss);
        }

    }
    _Compile(state: any, ss: TSubscriber[]) : void {

        let type = PropTypes.GetType(state);

        if (type === 'array'){
            this._CompileArray(state, ss);
        }
        else if (type === 'object'){
            if (state.constructor.name !== 'Object'){
                this.__SValue = state;
                return;
            }

            let keys = Object.getOwnPropertyNames(state);
            for (let k of keys){
                if (k === '_p') {
                    console.error('[State] State passed as value', '\nthisState: ', this, '\nvalueState', state);
                    continue;
                }

                let child = state[k];
                let childState : State = this._GetChildState(child, k, ss);

                Object.defineProperty(this, k, {
                    value: childState,
                    configurable: true,
                });
            }
        }
        else {
            ss.push({State: this, ChangedState: this});
        }
        this.__SValue = state;
    }
    _InitCtor(ctor: TStateCtor) {
        // const { NODE_ENV } = process.env;
        // console.log('STATE ENV', NODE_ENV);
        // if (NODE_ENV === 'development') {
        //     console.log('STATE DEBUG');
        // }
        this._Parent = ctor.Parent;
        this._Property = ctor.Property;
        this._Compile(ctor.State, []);
        // if (ctor.OnChange){
        //     if (!ctor.Parent)
        //         this._AddOnChange(ctor.OnChange);
        //     // else
        //     //     this._OnChange = ctor.OnChange;
        // }
    }

    Refresh(newValue: any, ss: TSubscriber[]) {
        if (newValue !== this.__SValue || typeof newValue === "object"){
            this._Compile(newValue, ss);
            this._OnChange(this, ss);
        }
    }


    SubState<U>(render: (value: T) => U, deps?: State[]) : IObservableState<U> {
        let renderState;
        let renderValue = render(this.SValue);

        if (!(Array.isArray(renderValue))) {
            renderState = new StateSingle({
                State: render(this.SValue),
            });
        } else {
            renderState = new StateArray({
                State: render(this.SValue as any),
            })
        }
        this._AddOnChange(() => {
            renderState.SValue = render(this.SValue);

        });
        if (deps) {
            for (let st of deps){
                if (!st._AddOnChange)
                    continue;
                st._AddOnChange(() => {
                    renderState.SValue = render(this.SValue);
                })
            }
        }
        return renderState as any;
    }
    SubStateArr<U>(render: (value: T) => U[], deps?: State[]) : IObservableStateArray<U> {
        return this.SubState(render, deps) as any;
    }

    ReplaceWith(newState: State<T>) : void {
        newState.Name = this.Name;
        Object.defineProperty(this._Parent, this._Property, {
            value: newState,
            configurable: true,
        });
        let ss = [];
        this._OnChange(newState, ss);
        this._UpdateParents(newState, ss);
    }
    // TransactionBegin() : void {
    //     this.__SValuePrev = LibraryObject.Clone(this.__SValue);
    // }
    // TransactionRollBack() : void {
    //     if (this.__SValuePrev !== null) {
    //         this.__SValue = this.__SValuePrev;
    //         this.__SValuePrev = null;
    //     }
    // }

    _Update(value: any) : void {
        let ss = [];
        this._Compile(value, ss);
        this._OnChange(this, ss);
        this._UpdateParents(this, ss);
    }
    get SProperty() : string {
        return this._Property;
    }
    get SParentState() : State {
        return this._Parent;
    }

    get SValue(): any {
        //return LibraryObject.Clone(this.__SValue);
        return this.__SValue;
    }
    set _SValue(value: any) {
        if (value !== this.__SValue || typeof value === "object") {
            this._Update(value);
        }
    }
}

export class StateSingle<T = any> extends State<T> {
    //public static IsTypeStrict : boolean = false;
    _GetChildByKey(key: string) : State<any> {
        return this.__GetChildByKey(key);
    }
    valueOf(){
        return this.__SValue;
    }
    toString(){
        return String(this.__SValue);
    }
    SetProperty(key: any, item: T) : void {
        //todo case this[key].SValue = item;
        let ss = [];
        let childState : State = this._GetChildState(item, key.toString(), ss);
        Object.defineProperty(this, key, {
            value: childState,
            configurable: true,
        });
        //update myself - i am parent of childState:
        this._OnChange(childState, ss);
        this._UpdateValue(childState, childState, ss);
        this._UpdateParents(childState, ss);
    }
    get SValue(): T {
        return this.__SValue;
    }
    set SValue(value: T) {
        this._SValue = value;
    }
    constructor(ctor: TStateCtor){
        super();
        this._InitCtor(ctor);
    }
}

type TSortPredicate<T> = (item1: T, item2: T) => number;
type TFilterPredicate<T> = (item: T, index?: number) => boolean;

export class StateArray<T> extends State<T> {
    // [Symbol.iterator]() {
    //     let index = -1;
    //     let data  = Object.keys(this.__SValue);
    //     return {
    //         next: () => ({ value: this._GetChildByKey(data[++index]), done: !(index in data) })
    //     };
    // };
    [Symbol.iterator]() {
        let index = -1;
        return {
            next: () => ({ value: this._GetChildByKey(++index), done: (index >= this.__SValue.length) })
        };
    };
    _GetChildByKey(key: number) : State<any> {
        return this.__GetChildByKey(key);
    }
    get SValue(): T[] {
        return this.__SValue;
    }
    set SValue(value: T[]) {
        this._SValue = value;
    }


    private _AutoSortPredicate: TSortPredicate<T>;
    private _AutoFilterPredicate: TFilterPredicate<T>;
    private _AutoFilterPredicateEmpty(item: T, index?: number) {
        return true;
    };
    private _AutoFilterOriginal: T[];

    private _Sort() : void {
        if (!this._AutoSortPredicate)
            return;
        this.__SValue.sort(this._AutoSortPredicate);
        this._CompileArray(this.__SValue, []);
    }

    private _DoFilter(predicate: TFilterPredicate<T>) : void {
        this.__SValue.splice(0);
        for (let i = 0; i < this._AutoFilterOriginal.length; i++) {
            const item = this._AutoFilterOriginal[i];
            if (predicate(item, i)){
                this.__SValue.push(item);
            }
        }
    }
    private _Filter() : void {
        if (!this._AutoFilterPredicate)
            return;

        this._DoFilter(this._AutoFilterPredicate);
        this._CompileArray(this.__SValue, [])
    }
    MakeSortable(compareFn: TSortPredicate<T>) : void {
        this._AutoSortPredicate = compareFn;
        this._Sort();
    }
    MakeFilterable(predicate: TFilterPredicate<T>) : void {
        this._AutoFilterPredicate = predicate;
        if (!predicate && this._AutoFilterOriginal) {
            this._DoFilter(this._AutoFilterPredicateEmpty);
            this._AutoFilterOriginal = void 0;
        }
        if (!this._AutoFilterOriginal)
            this._AutoFilterOriginal = [...this.__SValue];

        this._Filter();
        this._OnChange(this, []);
    }
    _RefreshValue(){
        let newValue = [];
        for (let i = 0; i < this.__SValue.length; i++) {
            newValue.push((this as any)[i].__SValue);
        }
    }
    _UpdateValue(childState: State, changedState: State, subscribes: TSubscriber[]): void {
        this.__SValue[childState._Property] = childState.__SValue;
        this._Filter();
        this._Sort();
        this._OnChange(changedState, subscribes);
    }

    //[Symbol.iterator] = stateIterator;
    map<U>(selector: SelectDelegate<T, U>) : U[] {
        let obj = (<any>this);
        let a = [];
        let data = this.__SValue;
        for (let i = 0; i < data.length; i++) {
            a.push(selector(obj[i].__SValue, i));
        }
        return a;
    }
    mapState<U>(selector: SelectDelegate<State<T>, U>) : U[] {
        let obj = (<any>this);
        let a = [];
        let data = this.__SValue;
        for (let i = 0; i < data.length; i++) {
            a.push(selector(obj[i], i));
        }
        return a;
    }
    filter(predicate: WhereDelegate<T>) : T[] {
        let a : T[] = [];
        let data = this.__SValue;
        for (let i = 0; i < data.length; i++) {
            const value : T = (this as any)[i].__SValue;
            if (predicate( value, i))
                a.push(value);
        }
        return a;
    }
    filterState(predicate: WhereDelegate<State<T>>) : State<T>[] {
        let a : State<T>[] = [];
        let data = this.__SValue;
        for (let i = 0; i < data.length; i++) {
            const st = (this as any)[i];
            if (predicate( st.__SValue, i))
                a.push(st);
        }
        return a;
    }


    Where(delegate: WhereDelegate<T>) : StateArray<T> {
        let a : State[] = [];
        let data = this.__SValue;
        for (let i = 0; i < data.length; i++) {
            const state : State<T> = (this as any)[i];
            if (delegate( state.__SValue, i))
                a.push(state);
        }
        return new StateArray({State: a});
    }
    Select<U>(delegate: SelectDelegate<any, any>): StateArray<U>[] {
        let obj = (<any>this);
        let selected = [];
        let data = this.__SValue;
        for (let i = 0; i < data.length; i++) {
            if (typeof delegate === 'string')
                selected.push(( obj[i][delegate]));
            else
                selected.push(delegate(obj[i], i));
        }
        return selected as any;
    }
    ToList() : T[] {
        //TODO make support linq
        return this.__SValue;
    }
    FirstOrDefault(predicate?: (val: T, i: number) => boolean): State<T> {
        let obj = (<any>this);
        if (!predicate) {
            return obj[0];
        }

        let data = this.__SValue;
        for (let i = 0; i < data.length; i++) {
            if (predicate(obj[i].__SValue, i))
                return obj[i];
        }
        return null;
    }
    LastOrDefault(predicate?: (val: T, i: number) => boolean) : State<T> {
        let obj = (<any>this);
        let data = this.__SValue;
        if (!predicate) {
            return obj[data.length - 1];
        }

        for (let i = data.length -1; i >= 0; i--) {
            if (predicate(obj[i].__SValue, i))
                return obj[i];
        }
        return null;
    }
    Add(item: T) : void {
        let data = this.__SValue;
        let i = data.length;
        let ss = [];
        let childState : State = this._GetChildState(item, i.toString(), ss);
        Object.defineProperty(this, i, {
            value: childState,
            configurable: true,
        });
        data.push(item);
        this._Filter();
        this._Sort();
        this._OnChange(this, ss);
        this._UpdateParents(this, ss);
    }
    _Add(item: T, ss: TSubscriber[]) : void {
        let data = this.__SValue;
        let i = data.length;
        let childState : State = this._GetChildState(item, i.toString(), ss);
        Object.defineProperty(this, i, {
            value: childState,
            configurable: true,
        });
        data.push(item);
    }
    AddState(itemState: StateSingle<T>) : void {
        let data = this.__SValue;
        let i = data.length;
        Object.defineProperty(this, i, {
            value: itemState,
            configurable: true,
        });
        data.push(itemState.SValue);
        itemState._Parent = this;
        itemState._Property = i;
        this._Filter();
        this._Sort();
        let ss = [];
        this._OnChange(this, ss);
        this._UpdateParents(this, ss);
    }
    AddRange(items: T[]) : void {
        let ss = [];
        for (let item of items) {
            this._Add(item, ss);
        }
        this._Filter();
        this._Sort();

        this._OnChange(this, ss);
        this._UpdateParents(this, ss);
    }
    Remove(value: T) : void {
        let data = this.__SValue;
        const removedCount = LibraryArray.Remove(data, v => v === value);
        if (removedCount < 1)
            return;
        this._Filter();
        this._Sort();
        let ss = [];
        this._CompileArray(data, ss);
        this._OnChange(this, ss);
        this._UpdateParents(this, ss);
    }
    RemoveAll(predicate: (item: T, index?: number) => boolean): void {
        let data = this.__SValue;
        //this.__SValue = this.__SValue.filter((v, index) => !predicate(v, index));
        const removedCount = LibraryArray.Remove(data, predicate);
        if (removedCount < 1)
            return;
        this._Filter();
        this._Sort();
        let ss = [];
        this._CompileArray(data, ss);
        this._OnChange(this, ss);
        this._UpdateParents(this, ss);
    }

    Contains(item: T) : boolean {
        let items = this.SValue;
        return items.includes(item);
    }


    MoveByIndex<T>(indexFrom: number, indexTo: number) : void {
        if (indexFrom === indexTo)
            return;
        const st = this as any;
        let t = st[indexFrom];
        st[indexTo] = st[indexFrom];
        st[indexFrom] = t;
        this._RefreshValue();
        //list.splice(indexFrom, 1);
        //list.splice(indexTo, 0, item);
    }




    valueOf(){
        return this.__SValue;
    }
    toString(){
        return String(this.__SValue);
    }
    get length(){
        return this.__SValue.length;
    }
    constructor(ctor: TStateCtor){
        super();
        this._InitCtor(ctor);
    }
}

type TClosestArr = {
    Item: State;
    StateArray: StateArray<any>;
}

export function getClosestStateArray(state: State) : TClosestArr {
    let p = state;
    while (p) {
        if (p._Parent instanceof StateArray)
            return {Item: p, StateArray: p._Parent};
        p = p._Parent;
    }
    return null;
}


function concatString(classList: IObservableStateSimpleOrValue<string>[]) : string {
    return classList.reduce((full, cls) => full + (cls ? " " + cls.valueOf() : "")) as string;
}

function stateStringConcat(...classList: IObservableStateSimpleOrValue<string>[]) : IObservableStateSimpleOrValue<string> {
    const hasStates  = classList.filter(cls => cls instanceof State ).length > 0;
    if (!hasStates)
        return concatString(classList);
    else {
        let states: IObservableStateSimple<string>[] = [];
        for (let cls of classList) {
            if (cls instanceof State){
                states.push(cls);
            }
        }
        return states[0].SubState(_ => concatString(classList), states.splice(1));
    }
}

//export function luffState<T>(state: T, params: TStateCtor = {State: ''}) : (T extends (infer ElementType)[] ? IObservableStateArray<ElementType> : IObservableState<T>) {
export function luffState<T>(state: T, params: TStateCtor = {State: ''}) : IObservableState<T> {
    if (state instanceof StateSingle || state instanceof State  || (StateSingle.isPrototypeOf && StateArray.isPrototypeOf(state)) )
        return state as any;
    if (Array.isArray(state))
        return new StateArray<T>({
            ...params,
            State: state
        }) as any;
    return new StateSingle<T>({
        ...params,
        State: state
    }) as any;
}
luffState.Concat = stateStringConcat;

export function luffStateArr<T>(state: T[], params: TStateCtor = {State: ''}) : IObservableStateArray<T> {
    if (state instanceof State || StateArray.isPrototypeOf(state) )
        return state as any;
    return new StateArray<T>({
        ...params,
        State: state
    }) as any;
}
//
// export function getStateFromObservable<T>(state: IObservableState<T>) : State<T> {
//     return state as any;
// }
// export function getStateArrFromObservable<T>(state: IObservableStateArray<T>) : StateArray<T> {
//     return state as any;
// }
//
// export function getObservableFromState<T>(state: State<T>) : IObservableState<T> {
//     return state as any;
// }
