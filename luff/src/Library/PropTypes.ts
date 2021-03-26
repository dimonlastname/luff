import {LuffDate} from "./Date"
import {LibraryNumber} from "./Number";
import {Dict} from "../interfaces";


//get type: Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();

let Type = {
    Number:  'number',
    Float:   'number',
    Int:     'int',
    UInt:    'uint',
    Bool:    'boolean',
    String:  'string',
    Text:    'text',    //rich text
    Function:'function',
    Date:    'date',
    List:    'list',
    Array:   'list',
    NodeList:'list',
    Object:  'object',

    Any: 'any'
};




let Types = {
    Number:  {
        t: 'float',
        js: 'number',
    },
    Float: {
        t: 'float',
        js: 'number',
    },
    Int: {
        t: 'int',
        js: 'number',
    },
    UInt: {
        t: 'uint',
        js: 'number',
    },
    Bool: {
        t: 'boolean',
        js: 'boolean',
    },
    String: {
        t: 'string',
        js: 'string',
    },
    Text: {
        t: 'text',    //rich text
        js: 'string'
    },
    Date: {
        t: 'date',
        js: 'date',
    },
    DateTime: {
        t: 'datetime',
        js: 'date',
    },
    Function:'function',
    //Date:    'date',
    List:    'list',
    Array:   'list',
    NodeList:'list',
    Object:  'object',

    Any: 'any'
};
let fn = {
    Number: function number(Value: any, PropertyName?: string) : number {
        let n = parseFloat(Value);
        if (Number.isNaN(n) || !isFinite(n))
        {
            console.warn(`[Luff.PropTypes] ${PropertyName} ${Value} is not a Number`);
            n = 0;
        }
        return n;
    },
    Int: function int(Value: any, PropertyName?: string) : number {
        let n = parseInt(Value);
        if (Number.isNaN(n) || !isFinite(n))
        {
            console.warn(`[Luff.PropTypes] ${PropertyName} ${Value} is not an Int`);
            n = 0;
        }
        return n;
    },
    UInt: function uint(Value: any, PropertyName?: string) : number {
        let n = parseInt(Value);
        if (Number.isNaN(n) || n < 0 || !isFinite(n))
        {
            console.warn(`[Luff.PropTypes] ${PropertyName} ${Value} is not an UInt`);
            n = 0;
        }
        return n;
    },
    String: function string(Value: any, PropertyName?: string) : string {
        return String(Value);
    },
    StringRich: function text(Value: any, PropertyName?: string) : string {
        return String(Value);
    },
    Bool: function boolean(Value: any, PropertyName?: string) : boolean {
        if (Value === 'true')
            Value = true;
        if (Value === 'false')
            Value = false;
        if (Value !== true && Value !== false){
            console.warn(`[Luff.PropTypes] ${PropertyName} ${Value} is not a Bool`);
            Value = false;
        }
        return Value;
    },
    Date: function boolean(value: any, propertyName?: string) : Date {
        if (value.constructor.name === 'LuffDate')
            return value;
        return new LuffDate(value).Date;
    },
};
type PropTypeParseType = (value: any, propertyName: string) => any;
export type PropTypeType = {
    Type: string;
    JS: string;
    TryParse: PropTypeParseType;
}
interface IPropTypes {
    //IsNumeric(value: any): boolean;
    GetType(obj: any): string;

    Number: PropTypeType;
    Float: PropTypeType;
    Int: PropTypeType;
    UInt: PropTypeType;
    Bool: PropTypeType;
    String: PropTypeType;
    Date: PropTypeType;
    DateTime: PropTypeType;
    Any: PropTypeType;
    //Text: PropTypeType;
//    [key: string]:PropTypeType;
    //Check(propTypes: Dict<PropTypeType>, obj: any): void;
    //CheckProp(obj: any, type: string, property: string): void;

}
const PropTypeEnum: Dict<number> = {
    Number: 1,
    Bool:   2,
    String: 3,
    Date:   4,
};
export class PropTypes {
    static GetType(obj: any) : string {
        if (obj instanceof Array || obj instanceof NodeList)
            return 'array';
        if (LibraryNumber.IsNumeric(obj))
            return 'number';
        if (obj instanceof Date || obj instanceof LuffDate)
            return 'date';
        if (obj instanceof Function)
            return 'function';
        if (obj instanceof Node)
            return 'node';
        if (obj instanceof Object)
            return 'object';
        if (obj === null)
            return null;
        return typeof (obj);
    }
    static Number: PropTypeType = {
        JS: 'number',
        Type: 'float',
        TryParse: fn.Number,
    };
    static Float: PropTypeType =  {
        JS: 'number',
        Type: 'float',
        TryParse: fn.Number,
    };
    static Int: PropTypeType =   {
        JS: 'number',
        Type: 'int',
        TryParse: fn.Int,
    };
    static UInt: PropTypeType =   {
        JS: 'number',
        Type: 'uint',
        TryParse: fn.UInt,
    };
    static Bool: PropTypeType =   {
        JS: 'boolean',
        Type: 'boolean',
        TryParse: fn.Bool,
    };
    static String: PropTypeType =   {
        JS: 'string',
        Type: 'string',
        TryParse: fn.String,
    };
    static Date: PropTypeType =   {
        JS: 'date',
        Type: 'date',
        TryParse: fn.Date,
    };
    static DateTime: PropTypeType =   {
        JS: 'date',
        Type: 'datetime',
        TryParse: fn.Date,
    };
    static Any: PropTypeType =   {
        JS: 'any',
        Type: 'any',
        TryParse: fn.Int,
    };
}