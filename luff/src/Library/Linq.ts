import {Dict, DictN, TKeyValuePair} from "../interfaces";
import {LibraryObject} from "./Object";

type cbWhere  = (item: any, index?: number) => boolean;
type cbSelect = (item: any, index?: number) => any;
type cbToDictionary = (item: any, index?: number) => any;

type TCallItem = {
    Type: DelegateType;
    Delegate: cbWhere | cbSelect | TOrderByFn;
}
type TOrderByFn = (item1: any, item2: any) => number;
type TQST = {
    IsPassed: boolean;
    Value: any;
    IsMany: boolean;
}

enum DelegateType  {
    Select = 0,
    Where = 1,
    ToDictionary = 2,
    SelectMany = 3,

    Order = 4,
}

interface GArray<T, K> extends Array<T>{
    Key: K;
}

function defaultComparer(a: any, b: any) : number {
    if (a > b)
        return 1;
    if (a < b)
        return -1;
    if (a === b)
        return 0;
}

//for _QuickSortFilter internal use
function rowGetterInner(item) : TQST {
    return {
        IsPassed: true,
        IsMany: false,
        Value: item,
    }
}

export class LuffLinq<T> {
    private _CallList: TCallItem[] = [];
    private _Data: T[];
    private _HasOrder = false;

    public Select<U>(selector: (item: T, index?: number) => U ): LuffLinq<U> {
        this._CallList.push({Type: DelegateType.Select, Delegate: selector});
        return <any>this;
    }
    public SelectMany<U>(selector: (item: T, index?: number) => U[] ): LuffLinq<U> {
        this._CallList.push({Type: DelegateType.SelectMany, Delegate: selector});
        return <any>this;
    }
    public Where(predicate: (item: T, index?: number) => boolean) : LuffLinq<T> {
        this._CallList.push({Type: DelegateType.Where, Delegate: predicate});
        return this;
    }
    public ToDictionary<K, V>(selectorKey: (item: T, index?: number) => K, selectorValue?: (item: T, index?: number) => V | T) : Dict<V> {
        if (!selectorValue)
            selectorValue = val => val;
        let ar : any[] = this.ToList();

        let dict = {};
        for (let i = 0; i < ar.length; i++){
            (<any>dict)[selectorKey(ar[i], i)] = selectorValue(ar[i], i);
        }
        return dict;
    }
    public ToLookUp<K>(keySelector: (item: T) => K) : Dict<T[]> {
        let lookHash : Dict<T[]> = {};
        let ar : any[] = this.ToList();

        for (let item of ar) {
            const key = keySelector(item) as any;
            if (key === void 0 || key === null)
                continue;

            if (lookHash[key]) {
                lookHash[key].push(item);
            } else {
                lookHash[key] = [item];
            }
        }
        return lookHash;

    }
    public Contains(item: T) : boolean {
        let getter = this._GetRowGetter(this._CallList);
        for (let i = 0; i < this._Data.length; i++) {
            let val = getter(this._Data[i]);
            if (!val.IsPassed)
                continue;
            if (!val.IsMany && val.Value === item)
                return true;
            if (val.IsMany) {
                for (let k = 0; k < val.Value.length; k++) {
                    if (val.Value[k] === item)
                        return true;
                }
            }
        }
        return false;
    }
    public GroupBy<U>(keyGetter: (item: T) => U) : LuffLinq<GArray<T, U>> {
        let items : any[] = this.ToList();
        const groups : GArray<T, U>[] = [];
        for (let item of items) {
            let key = keyGetter(item);
            let group : GArray<T, U>;
            for (let g of groups) {
                if (LibraryObject.CheckDirty(g.Key, key) ) {
                    group = g;
                    break;
                }
            }
            if (!group){
                group = [] as GArray<T, U>;
                group.Key = key;
                groups.push(group);
            }
            group.push(item);
        }
        this._Data = groups as any;
        return <any>this;
    }
    public OrderBy<U>(keyGetter: (item: T) => U, comparer: (item1: U, item2: U) => number = defaultComparer) : LuffLinq<T> {
        this._HasOrder = true;
        this._CallList.push({Type: DelegateType.Order, Delegate: function(item1, item2) {
                return comparer(keyGetter(item1), keyGetter(item2));
            }});
        return this;
    }
    public OrderByDescending<U>(keyGetter: (item: T) => U, comparer: (item1: U, item2: U) => number = defaultComparer) : LuffLinq<T> {
        this._HasOrder = true;
        this._CallList.push({Type: DelegateType.Order, Delegate: function(item1, item2) {
                return comparer(keyGetter(item2), keyGetter(item1));
            }});
        return this;
    }

    public AsEnumerable() : LuffLinq<T> {
        this._Data = this.ToList();
        this._HasOrder = false;
        this._CallList = [];
        return this;
    }

    private static rowGetterInner(item) : TQST {
        return {
            IsPassed: true,
            IsMany: false,
            Value: item,
        }
    }

    private _QuickSortFilter(data: any[], rowGetter: (item) => TQST, sorter) : any {
        if (data.length < 2 || (!rowGetter && !sorter)) {
            return data;
        }


        const pivotKey = Math.floor(data.length/2);
        const pivotValue = rowGetter(data[pivotKey]).Value;

        let left = [];
        let right = [];
        let equal = [];

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let valueItem = rowGetter(item);
            if (!valueItem.IsPassed) {
                continue;
            }
            if (sorter && sorter(valueItem.Value, pivotValue) < 0){
                left.push(valueItem.Value)
            }
            else if (sorter && sorter(valueItem.Value, pivotValue) > 0){
                right.push(valueItem.Value)
            }
            else {
                equal.push(valueItem.Value);
            }

        }
        return this._QuickSortFilter(left, rowGetterInner, sorter).concat(equal, this._QuickSortFilter(right, rowGetterInner, sorter));
    }

    private _GetRowGetter(cbX: TCallItem[]) : (item) => TQST {
        return function getDataa(item) : TQST {
            let itemResult = item;

            let isPassed = true;
            let isMany = false;
            for (let c = 0; c < cbX.length; c++) {
                let cb = cbX[c];

                if (cb.Type == DelegateType.Where) {
                    const isItemArray = Array.isArray(itemResult);
                    let where = cb.Delegate as cbWhere;
                    if (!isItemArray) { //if wasn't SelectMany
                        isPassed = where(itemResult);
                    }
                    else { //after SelectMany
                        let subResult = [];
                        for (let sumItem of itemResult) {
                            if (where(sumItem)) {
                                subResult.push(sumItem)
                            }
                        }
                        itemResult = subResult;
                    }
                }
                else if (cb.Type == DelegateType.Select || cb.Type == DelegateType.SelectMany) {
                    let select = cb.Delegate as cbSelect;
                    itemResult = select(itemResult);
                    isMany = cb.Type == DelegateType.SelectMany;
                }
            }
            return {
                IsPassed: isPassed,
                Value: itemResult,
                IsMany: isMany,
            }
        }
    }
    private _GetData(data: any[], cbX: TCallItem[], hasMany: boolean, sorter: TOrderByFn) : any[] {
        let rowGetter = this._GetRowGetter(cbX);
        let resultArr;


        if (!sorter) {

        }

        if (!hasMany && sorter) {
            resultArr = this._QuickSortFilter(this._Data, rowGetter, sorter);
        }

        else {
            let dataProcess = [];
            for (let r = 0; r < data.length; r++) {
                let rowPack = rowGetter(data[r]);
                if (rowPack.IsPassed) {
                    if (rowPack.IsMany){
                        dataProcess.push(...rowPack.Value);
                    }
                    else {
                        dataProcess.push(rowPack.Value);
                    }
                }
            }
            resultArr = dataProcess;
            if (sorter)
                resultArr = resultArr.sort(sorter);
        }
        return resultArr;
    }
    private _GetFirst(isReverseDirection: boolean) : T {
        let getter = this._GetRowGetter(this._CallList);
        let i = 0;
        let cond = () => i < this._Data.length;
        let indexChanger = () => i++;
        let isGo = true;
        if (isReverseDirection) {
            i = this._Data.length - 1;
            cond = () => i >= 0;
            indexChanger = () => i--;
        }
        while (isGo) {
            let pack = getter(this._Data[i]);
            if (pack.IsPassed) {
                if (pack.IsMany) {
                    if (pack.Value.length > 0) {
                        return isReverseDirection ? pack.Value[pack.Value.length - 1] : pack.Value[0];
                    }
                    return null;
                }

                return pack.Value;
            }
            indexChanger();
            isGo = cond();
        }

        return null;
    }

    public ToList() : T[] {
        if (this._CallList.length < 1)
            return this._Data as any;

        let resultArr = this._Data;
        let cbX = [];

        let data = this._Data;

        let hasMany = false;

        for (let i = 0; i < this._CallList.length; i++) {
            let cb = this._CallList[i];
            if (cb.Type == DelegateType.Where || cb.Type == DelegateType.Select) {
                cbX.push(cb);
            }
            else if (cb.Type == DelegateType.SelectMany) {
                cbX.push(cb);
                hasMany = true;
            }
            else if (cb.Type == DelegateType.Order) {
                resultArr = this._GetData(data, cbX, hasMany, cb.Delegate as TOrderByFn);
                cbX = [];
                hasMany = false;
            }
        }

        if (cbX.length > 0) {
            resultArr = this._GetData(resultArr, cbX, hasMany, null);
        }

        return resultArr;

    }


    public FirstOrDefault<U>() :  T {
        if (this._Data.length == 0)
            return null;

        if (!this._HasOrder) {
            return this._GetFirst(false);
        }
        let res = this.ToList();
        return res[0];
    }
    public LastOrDefault<U>() :  T {
        if (this._Data.length == 0)
            return null;

        if (!this._HasOrder) {
            return this._GetFirst(true);
        }

        let res = this.ToList();
        return res[res.length - 1];
    }

    constructor(array: T[]){
        this._Data = array;
    }
}
export function luffLinq<T, K, F extends Array<T> | Dict<T> | Map<K, T> >(arrayOrDict: F )
    : F extends (infer ElementType)[] ?  LuffLinq<ElementType> :
      F extends Dict<infer ElementType> ? LuffLinq<TKeyValuePair<string, ElementType>>:
      F extends Map<infer ElementType, infer ElementType2> ? LuffLinq<TKeyValuePair<ElementType, ElementType2>> :
      unknown  {

    if (Array.isArray(arrayOrDict))
        return new LuffLinq<T>(arrayOrDict) as any;

    if (arrayOrDict instanceof Map) {
        let array = [];
        for (let k of arrayOrDict.keys())
            array.push({Key: k, Value: arrayOrDict.get(k)});
        return new LuffLinq<TKeyValuePair<K, T>>(array) as any;
    }
    let array = Object.getOwnPropertyNames(arrayOrDict).map(key => ({Key: key, Value: arrayOrDict[key]}));
    return new LuffLinq<TKeyValuePair<string, T>>(array) as any;
}




