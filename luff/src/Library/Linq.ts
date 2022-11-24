import {Dict} from "../interfaces";
import {LibraryObject} from "./Object";

type cbWhere  = (item: any, index?: number) => boolean;
type cbSelect = (item: any, index?: number) => any;
type cbToDictionary = (item: any, index?: number) => any;

type TCallItem = {
    Type: number;
    Delegate: cbWhere | cbSelect;
}

enum DelegateType  {
    Select = 0,
    Where = 1,
    ToDictionary = 2,
    SelectMany = 3,
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


export class LuffLinq<T> {
    private _CallList: TCallItem[] = [];
    private _Data: T[];
    private _OrderBy: (item1: any, item2: any) => number;

    Select<U>(selector: (item: T, index?: number) => U ): LuffLinq<U> {
        this._CallList.push({Type: DelegateType.Select, Delegate: selector});
        return <any>this;
    }
    SelectMany<U>(selector: (item: T, index?: number) => U[] ): LuffLinq<U> {
        this._CallList.push({Type: DelegateType.SelectMany, Delegate: selector});
        return <any>this;
    }
    Where(predicate: (item: T, index?: number) => boolean) : LuffLinq<T> {
        this._CallList.push({Type: DelegateType.Where, Delegate: predicate});
        return this;
    }
    ToDictionary<K, V>(selectorKey: (item: T, index?: number) => K, selectorValue?: (item: T, index?: number) => V | T) : Dict<V> {
        if (!selectorValue)
            selectorValue = val => val;
        let ar : any[] = this.ToList();

        let dict = {};
        for (let i = 0; i < ar.length; i++){
            (<any>dict)[selectorKey(ar[i], i)] = selectorValue(ar[i], i);
        }
        return dict;
    }
    ToLookUp<K>(keySelector: (item: T) => K) : Dict<T[]> {
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
    Contains(item: T) : boolean {
        return this._Data.indexOf(item) > -1;
    }
    GroupBy<U>(keyGetter: (item: T) => U) : LuffLinq<GArray<T, U>> {
        let items : any[] = this.ToList(); //get items with applied previous functions
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
    OrderBy<U>(keyGetter: (item: T) => U, comparer: (item1: U, item2: U) => number = defaultComparer) : LuffLinq<T> {
        //todo: make real order by;
        this._OrderBy = function(item1, item2) {
            return comparer(keyGetter(item1), keyGetter(item2));
        };
        return this;
    }
    AsEnumerable() : LuffLinq<T> {
        this._Data = this.ToList();
        return this;
    }
    ToList() : T[] {
        if (this._CallList.length  < 1)
            return this._Data as any;
        let resultArr = [];
        for (let i = 0; i < this._Data.length; i++) {
            let item = this._Data[i];
            let isResolve = true;
            let result: any = item;


            for (let cb of this._CallList){
                const isItemArray = Array.isArray(result);

                if (cb.Type == DelegateType.Where ){
                    if (!isItemArray) { //if wasn't SelectMany
                        isResolve = cb.Delegate(result);
                    }
                    else { //after SelectMany
                        let subResult = [];
                        for (let sumItem of result) {
                            if (cb.Delegate(sumItem)) {
                                subResult.push(sumItem)
                            }
                        }
                        result = subResult;
                    }
                    continue;
                }
                if (!isResolve){
                    break;
                }
                if (cb.Type == DelegateType.Select){
                    result = cb.Delegate(result, i);
                }
                if (cb.Type == DelegateType.SelectMany){
                    result = cb.Delegate(result, i);
                }
            }
            const isItemArray = Array.isArray(result);
            if (isResolve) {
                if (!isItemArray)
                    resultArr.push(result);
                else
                    resultArr.push(...result);
            }

        }
        if (this._OrderBy) {
            resultArr = resultArr.sort(this._OrderBy);
            this._OrderBy = null;
        }
        this._CallList = [];
        return resultArr;
    }

    FirstOrDefault<U>() :  T {
        //TODO: select many is ignored
        if (this._CallList.length  < 1){
            if (this._Data.length > 0) {
                return this._Data[0];
            }
            return null
        }
            //return this._Data[0] ? this._Data[0] : null;
        for (let i = 0; i < this._Data.length; i++) {
            let item = this._Data[i];
            let isResolve = true;
            let result: any = item;
            for (let cb of this._CallList){
                if (cb.Type == DelegateType.Where && !cb.Delegate(result)){
                    isResolve = false;
                }
                if (!isResolve){
                    break;
                }
                if (cb.Type == DelegateType.Select){
                    result = cb.Delegate(result, i);
                }
            }
            if (isResolve)
                return result;
        }
    }
    LastOrDefault<U>() :  T {
        if (this._CallList.length  < 1) {
            if (this._Data.length > 0) {
                return this._Data[this._Data.length - 1];
            }
            return null
        }
        for (let i = this._Data.length - 1; i > 0; i--) {
            let item = this._Data[i];
            let isResolve = true;
            let result: any = item;
            for (let cb of this._CallList){
                if (cb.Type == DelegateType.Where && !cb.Delegate(result)){
                    isResolve = false;
                }
                if (!isResolve){
                    break;
                }
                if (cb.Type == DelegateType.Select){
                    result = cb.Delegate(result, i);
                }
            }
            if (isResolve)
                return result;
        }
    }

    constructor(array: T[]){
        this._Data = array;
    }
}


export function luffLinq<T>(array: T[]) {
    return new LuffLinq<T>(array);
}





