import {LuffDate} from "./Date";

interface IObjectInstance{
    [Key: string]: any;
}

export namespace LibraryObject {
    export function isEmpty(obj: object, isStrict:boolean = false) : boolean {
        if (isStrict && typeof obj !== 'object')
            return false;
        return !(obj && Object.keys(obj).length > 0);
    }
    export function Clone<T>(object: T) : T {
        //TODO to optimize cloning
        let obj = <any>object;
        if(typeof obj !== 'object' || obj === null || object instanceof File) {
            return obj;
        }
        //let x = Object.getOwnPropertyNames(obj);

        if(obj instanceof LuffDate) {
            return <any>new LuffDate(obj.TotalMilliseconds);
        }
        if(obj instanceof Date) {
            return <any>new Date(obj.getTime());
        }

        if(obj instanceof Array) {
            return obj.reduce((arr, item, i) => {
                arr[i] = Clone(item);
                return arr;
            }, []);
        }

        if(obj instanceof Object) {
            return Object.getOwnPropertyNames(obj).reduce((newObj: any, key: string) => {
                newObj[key] = Clone<any>(obj[key]);
                return <any>newObj;
            }, {})
        }

        //return <T>JSON.parse(JSON.stringify(obj));
    }
    export function Copy<T, Y>(ObjectCopyFrom: IObjectInstance, ObjectCopyTo: IObjectInstance): T {
        let Keys = Object.getOwnPropertyNames(ObjectCopyFrom);
        for (let p in Keys){
            if (ObjectCopyFrom.hasOwnProperty(p)){
                //Object.defineProperty(ObjectCopyTo, p, {value: Object.getOwnPropertyDescriptor(ObjectCopyFrom, p).value })
                (<any>ObjectCopyTo)[p] = (<any>ObjectCopyFrom)[p];
            }
        }
        return <T>ObjectCopyTo;
    }
    export function GetProperty(Obj: object, Prop: string) : any {
        if (Prop === '')
            return Obj;
        let Way = Prop.replace(/\[([^\]]+)\]/g, '.$1'); //TODO check slash in regexp
        Way = Way.substring(0,1) === '.'? Way.substring(1):Way;
        let Ways = Way.split('.');
        let i = 0;
        let Dest = Obj;
        for (i; i < Way.length-1; i++){
            Dest = (<any>Dest)[Ways[i]];
        }
        if (Dest === void 0 || Dest === null){
            console.warn(`[Luff.Object.GetProperty] Property '${Prop}' is unreachable`, Obj, );
            return null;
        }
        return (<any>Dest)[Ways[i]];
    }
    export function SetProperty(Obj: object, Prop: string, Value: any) : object {
        if (Prop === ''){
            Obj = Value;
            return Obj;
        }
        let Way = Prop.replace(/\[([^\]]+)\]/g, '.$1');//TODO check slash in regexp
        Way = Way.substring(0,1) === '.'? Way.substring(1):Way;
        let Ways = Way.split('.');
        let i = 0;
        let Dest = Obj;
        for (i; i < Way.length-1; i++){
            Dest = (<any>Dest)[Ways[i]];
        }
        (<any>Dest)[Ways[i]] = Value;
        return Obj;
    }
    export function CheckDirty(Obj1: any, Obj2:any, isStrict:boolean=true): boolean{
        if (!Obj1 || !Obj2)
            return false;
        let isEqual = true;
        if (Obj1 instanceof Array){
            if (isStrict && Obj1.length !== (<any[]>Obj2).length){
                return false;
            }
            for (let i = 0; i < Obj1.length; i++){
                if (Obj1[i] instanceof Object){
                    isEqual = LibraryObject.CheckDirty(Obj1[i], Obj2[i], isStrict);
                    if (!isEqual){
                        return false;
                    }
                    continue;
                }
                if (Obj1[i] !== Obj2[i]){
                    return false;
                }
            }
        }
        else if (Obj1 instanceof Object){
            if (isStrict && Object.keys(Obj1).length !== Object.keys(Obj2).length)
                return false;
            for (let i in Obj1){
                if ((<any>Obj1)[i] instanceof Object){
                    isEqual = LibraryObject.CheckDirty((<any>Obj1)[i], (<any>Obj2)[i], isStrict);
                    if (!isEqual){
                        return false;
                    }
                    continue;
                }
                if ((<any>Obj1)[i] !== (<any>Obj2)[i]){
                    return false;
                }
            }
        }
        else {
            return Obj1 === Obj2
        }
        return isEqual;
    }
}





