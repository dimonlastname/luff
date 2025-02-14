import {luffState, State, TStateOnChange} from "./Core/State";
import {LuffDate} from "./Library";



export type TValueName<T> = {
    Value: T;
    Name: string;
}
// type TDictKey = string | number;
//
//
// export type Dictionary<TKey extends TDictKey, TValue> = {
//     [key: TDictKey]: TValue;
// }

export type TIDNamePair = {
    ID: number;
    Name: string;
}


export type Dict<TValue> = {
    [key: string]: TValue;
}
export type DictN<TValue> = {
    [key: number]: TValue;
}

export type TKeyValuePair<K, V> = {
    Key: K;
    Value: V;
}

export type TPositionObject = {
    x: number;
    y: number;
}

export type TPositionObjectWithDirection = {
    x: number;
    y: number;
    direction: "left-top" | "left-bottom" | "right-top" | "right-bottom"
}

export type TOffset = {
    Left: number,
    Top: number
};

export type WhereDelegate<T> = (value?: T, index?: number) => boolean;
export type SelectDelegate<T, U> = (value?: T, index?: number) => U;

export interface IShowHideable {
    Show(): void;
    Hide(): void;
}

//export type FlattenState<T> = T extends any[] ? IObservableStateArray<T[number]> : IObservableState<T>;

export type IObservableStateKeys<T> =
    {
        readonly [K in keyof T]:
        T[K] extends (infer ElementType)[] ? IObservableStateArray<ElementType>:
            T[K] extends object ? IObservableState<T[K]> :
                IObservableStateSimple<T[K]>;
    }

//export type IObservableStateUnknown<T> = (T extends object ? IObservableState<T> : IObservableStateSimple<T>);
type ExcludeProps<T extends object> = Exclude<T[keyof T], Function | Date | LuffDate>;

export type IObservableState<T> = T extends object ? IObservableStateComplex<T>
  : T extends true | false ? IObservableStateSimple<boolean> //wtf typeScrypt???
  : IObservableStateSimple<T>;

export type IObservableStateComplex<T> =
    IObservableStateKeys<T>
  & IObservableStateSingleObject<T>
  & IObservableStateSimple<T>
  & IObservableExtra<T>
export type IObservableStateAny<T> = T extends object ? (T extends (infer ElementType)[] ? IObservableStateArray<ElementType> : IObservableState<T>) :
    T extends number ? IObservableStateSimple<number> :
    T extends true | false ? IObservableStateSimple<boolean> :
    IObservableStateSimple<T>;

type IObservableExtra<T> = {
    AddOnChange(onChange: TStateOnChange<T>) : void;
    RemoveOnChange(onChange: TStateOnChange<T>) : void;
    ForceUpdate() : void;
}

type IObservableStateSingleObject<T> = {
    SetProperty(key: keyof T, obj: T[keyof T]): void;
    //ReplaceWith(newState: (T extends object ? IObservableState<T> : IObservableStateSimple<T>)) : void ;
}

//type TSubState<T, U> = (render: (value: T) => U, deps?: IObservableState<any>[] | IObservableStateSimple<any>[]) => IObservableState<U>;


export type IObservableStateSimple<T> = {
    SValue: T;
    //SValue: (T extends ExcludeProps<[T]> ? Readonly<T> : T);
    //SubStateCommon<U>(render: (value: T) => U, deps?: (IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>)[]) : (U extends (infer ElementType)[] ? IObservableStateArray<ElementType> : IObservableState<U>);
    SubState<U>(render: (value: T) => U, deps?: (IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>)[]) : (U extends (infer ElementType)[] ? IObservableStateArray<ElementType>:
        U extends object ? IObservableState<U> :
        U extends true | false ? IObservableStateSimple<boolean> :
          IObservableStateSimple<U>);
    SubStateArr<U>(render: (value: T) => U[], deps?: (IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>)[]) : IObservableStateArray<U>;
    readonly SProperty: string;
    SParentState: IObservableState<any> | IObservableStateArray<any> | IObservableStateSimple<any>;

} & IObservableExtra<T>;
export type IObservableStateSimpleOrValue<T> = T | IObservableStateSimple<T>;
export type IObservableStateArray<T> = {
    //readonly [Key: number]: IObservableState<T>;
    readonly [Key: number]: (IObservableStateAny<T>);
    SValue: T[];
    //SValue: ReadonlyArray<T>;
    //SubStateCommon<U>(render: (value: T[]) => U, deps?: (IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>)[]) : (U extends (infer ElementType)[] ? IObservableStateArray<ElementType> : IObservableState<U>);
    SubState<U>(render: (value: T[]) => U, deps?: (IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>)[]) : (U extends (infer ElementType)[] ? IObservableStateArray<ElementType>:
      U extends object ? IObservableState<U> :
        U extends true | false ? IObservableStateSimple<boolean> :
          IObservableStateSimple<U>);
    SubStateArr<U>(render: (value: T[]) => U[], deps?: (IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>)[]) : IObservableStateArray<U>;

    AddOnChange(onChange: (newValue?: T[], changedState?: State<T>) => void) : void;
    RemoveOnChange(onChange: TStateOnChange<T>) : void;
    ForceUpdate() : void;

    MakeSortable(compareFn: (a: T, b: T) => number) : void
    MakeFilterable(predicate: (item: T, index?: number) => boolean) : void
    Add(obj: T): void;
    AddState(state: IObservableState<T> | IObservableStateSimple<T>) : void;
    AddRange(obj: T[]): void;
    Remove(value: T): void;
    RemoveAll(predicate: (item: T, index?: number) => boolean): void
    Where(predicate: (val: T, i: number) => boolean ): IObservableStateArray<T>;
    Select<G>(delegate: (val: T, i: number) => G): IObservableState<G>[];
    ToList(): IObservableStateArray<T>;
    Contains(item: T) : boolean;
    //Values(): T[];

    map<G>(selector: (val: T, index?: number) => G ) : G[];
    mapState<G>(selector: (val: (T extends object ? IObservableState<T> : IObservableStateSimple<T>), index?: number) => G ) : G[];
    filter(predicate: WhereDelegate<T>) : T[];
    //filterState(predicate: WhereDelegate<(T extends object ? IObservableState<T> : IObservableStateSimple<T>)>, index?: number)  : (T extends object ? IObservableState<T> : IObservableStateSimple<T>)[];
    readonly length: number;
    FirstOrDefault(predicate?: (val: T, i: number) => boolean) : IObservableState<T>;
    LastOrDefault(predicate?: (val: T, i: number) => boolean) : IObservableState<T>;



    [Symbol.iterator](): Iterator<IObservableState<T>>;
}

export type IObservableOrValue<T> = IObservableStateSimple<T> | T;
export type IObservableArrayOrValue<T> = IObservableStateArray<T> | T[];


export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
    [K in Keys]-?:
    Required<Pick<T, K>>
    & Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys]

// <<<<<<< HEAD
// //
// // function getS(s: IObservableState<boolean>) {
// //
// // }
// //
// // let stax = luffState(true);
// //
// // getS(stax);
//
//
//
//
// =======
//
// enum EnX {
//     One,
//     Two
// }
// let b: IObservableState<true>;
// let enu: IObservableState<EnX>;
// let arN: IObservableState<[12]>;
//
//
// let stateS: IObservableStateSimple<EnX>;
// let state1: IObservableStateComplex<EnX>;
// let stateRn = luffState<EnX>(EnX.One);
// stateRn.SValue = EnX.Two;
//
// function tryMe(s: IObservableState<number>) {
//
// }
// function tryMeBool(s: IObservableState<boolean>) {
//
// }
//
//
// let s = luffState(124);
// let sBool = luffState(false);
// tryMe(s);
// tryMeBool(sBool);
//
//
// //===
// type TType = {
//     Id: number;
//     Value: string;
// }
//
// let t = luffState<TType>({Id: 1, Value: ''});
// >>>>>>> main-to-vite














