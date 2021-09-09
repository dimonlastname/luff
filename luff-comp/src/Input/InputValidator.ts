import InputBoxBase, {TInputValidResult} from "./_InputBoxBase";
import {ElementBase, TPositionObject} from "luff";
import {LuffHint} from "../";

export type TIVCtor = {
    //Components: InputBoxBase<any>[];
    Comps: TCheckItem[];
    HintDuration?: number;
    HintMargin?: TPositionObject;
}


type TCheckItem = {
    Comp: ElementBase;
    IsValidFn?: () => TInputValidResult;
}

export class InputValidator {
    private Ctor: TIVCtor;

    private Checks: TCheckItem[] = [];
    private HintDuration = 5000;
    private HintMargin : TPositionObject = {x: 25, y: -5};


    constructor(ctor: TIVCtor) {
        this.Ctor = ctor;
        this.HintDuration = ctor.HintDuration !== void 0 ? ctor.HintDuration : this.HintDuration;
        this.HintMargin = ctor.HintMargin !== void 0 ? ctor.HintMargin : this.HintMargin;


        for (let ch of ctor.Comps) {
            let isValidFn = ch.IsValidFn;
            if (!isValidFn) {
                const input = ch.Comp as InputBoxBase<any>;
                isValidFn = input.IsInputValidDefault;
            }

            this.Checks.push({
                Comp: ch.Comp,
                IsValidFn: isValidFn,
            })
        }


    }

    public Check() : TCheckItem[] {
        let failedItems : TCheckItem[] = [];
        for (let ch of this.Checks) {
            const res = ch.IsValidFn.call(ch.Comp);
            if (!res.IsValid) {
                const dom = ch.Comp.GetFirstDOMElement();
                failedItems.push(ch);
                LuffHint.PopHint({
                    Margin: this.HintMargin,
                    Direction: 'top-left',
                    OnElement: dom,
                    Text: res.Message,
                    ClassName: 'l-hint-error',
                    TargetArea: document.body,
                    IsContainment: true,
                    Duration: this.HintDuration,
                });
            }
        }
        return failedItems;
    }
    public IsValid() {
        return this.Check().length === 0;
    }
}