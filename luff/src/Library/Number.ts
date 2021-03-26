export namespace LibraryNumber {
    let idCounter = 0;

    export function GetRandom(max:number = 100, min:number = 0) : number {
        return Math.round(Math.random()*(max-min)+min)
    }
    export function RoundBy(number: number, divider: number, mode:string='ceil'): number { //mode: ceil, floor, round
        let b = number % divider;
        if (b === 0)
            return number;
        if (mode === 'ceil')
            return number - b + divider;
        else if (mode === 'floor')
            return number - b;
        return number - b +  (b/divider < 0.5 ? 0: divider);
    }
    export function IsNumeric(n: any) : boolean{
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    export function GetID() : number {
        idCounter++;
        return idCounter;
    }
    export function GetLastID() : number {
        return idCounter;
    }
    export function GetNumberOrder (num: number) : number {
        //debugger;
        let strNumber = num.toString().split('.');

        if (parseInt(strNumber[0]) !== 0){
            let n = strNumber[0].length;
            return n - 1;
        } else {
            let p = strNumber[1] ? strNumber[1].match(/[^0]/) : void 0;
            let px = p ? p.index + 1 : 1;
            return -px;
        }
    }
}