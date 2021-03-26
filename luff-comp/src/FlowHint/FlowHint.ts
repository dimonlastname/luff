import "./FlowHint.scss";
import {DictN, LibraryDOM, TPositionObject} from "luff";

enum HintDirection {
    BottomRight = 1, //'bottom-right'
}

type HintRenderFn = (hintPack: THintPack) => HTMLElement;

interface TLuffHintCtor {
    TargetArea?: HTMLElement;
    ExtraClassNames?: string;
    QuerySelector?: string;
    DataProp?: string;
    Direction?: string;
    Margin?: TPositionObject;
    Delay?: number; //time before hint will be shown
    Duration?: number; //time before hint will be started hiding
    IsContainment?: boolean; //Auto-switch hint direction when out of screen (TargetArea)
    MethodShow?: (elem: HTMLElement) => any; //default: elem.style.opacity = 1
    MethodHide?: (elem: HTMLElement) => any; //default: elem.style.opacity = 0
    Render?: HintRenderFn; //custom hint-element render
    IsInstantRunListening?: boolean;
}

interface THintConfig extends TLuffHintCtor {
    AnimationDuration?: number;
}


type THintPack = {
    ID: number;
    Target: HTMLElement;
    Hint: HTMLElement;
    //Rect: DOMRect;
    TimeoutToShow: number;
    TimeoutToHide: number;
}
export class LuffHint {
    private readonly _HintDict: DictN<THintPack> = {};
    private _HintCounter: number = 1;
    private readonly _ListenToShowSafeContext: () => void; //save listener link here to add/remove listening
    Config: THintConfig;

    RunListening() {
        this.Config.TargetArea.addEventListener('mouseover', this._ListenToShowSafeContext);
        return true;
    }
    StopListening() {
        this.Config.TargetArea.removeEventListener('mouseover', this._ListenToShowSafeContext);
        return false;
    }

    _ListenToShow(e: MouseEvent){
        const eventTarget = e.target as HTMLElement;
        if (LibraryDOM.IsQuery(eventTarget, this.Config.QuerySelector)){
            const hintID : number = parseInt(eventTarget.dataset['luffHintID']);
            let hintPack : THintPack;
            if (hintID > 0) {
                hintPack = this._HintDict[hintID];
            } else {
                hintPack = {
                    ID: this._HintCounter++,
                    Target: eventTarget,
                    Hint: null,
                    TimeoutToShow: null,
                    TimeoutToHide: null,
                };
                this._HintDict[hintPack.ID] = hintPack;
                hintPack.Target.dataset['luffHintId'] = hintPack.ID.toString();
                hintPack.Target.addEventListener('mouseleave', (e) => this._ListenToHide(e, hintPack))
            }
            clearTimeout(hintPack.TimeoutToHide);
            clearTimeout(hintPack.TimeoutToShow);
            hintPack.TimeoutToShow = window.setTimeout(()=>{
                this._Show(hintPack);
            }, this.Config.Delay)
        }
    }
    _ListenToHide(e: MouseEvent, hintPack: THintPack){
        if (hintPack){
            hintPack.TimeoutToHide = window.setTimeout(() => {
                this._Hide(hintPack);
            }, this.Config.Duration)
        }
    }
    _GetPos(direction: string, rect: DOMRect, rectHint: DOMRect, rectContainment: DOMRect){
        let PosX = -rectContainment.x;
        let PosY = -rectContainment.y;
        if (direction === 'bottom-right'){
            PosX += rect.x + rect.width + this.Config.Margin.x;
            PosY += rect.y + rect.height + this.Config.Margin.y;
        }
        else if (direction === 'bottom-left'){
            PosX += rect.x - rectHint.width;
            PosY += rect.y + rect.height + this.Config.Margin.y;
        }
        else if (direction === 'top-right'){
            PosX += rect.x + rect.width + this.Config.Margin.x;
            PosY += rect.y - rectHint.height - this.Config.Margin.y;
        }
        else if (direction === 'top-left'){
            PosX += rect.x - rectHint.width - this.Config.Margin.x;
            PosY += rect.y - rectHint.height - this.Config.Margin.y;
        }
        return {
            x: PosX,
            y: PosY,
        }
    }
    _Show(hintPack: THintPack){
        if (!hintPack.Hint)
            hintPack.Hint = this.Config.Render(hintPack);

        if (hintPack.Hint === null)
            return;

        const rect = hintPack.Target.getBoundingClientRect();
        let rectContainment : DOMRect = this.Config.TargetArea.getBoundingClientRect();
        if (!hintPack.Hint.parentElement)
            this.Config.TargetArea.appendChild(hintPack.Hint);
        const RectHint = hintPack.Hint.getBoundingClientRect();


        let direction = this.Config.Direction;
        if (this.Config.IsContainment){

            let directions = direction.split('-');
            if (rect.y + rect.height + RectHint.height + this.Config.Margin.y > rectContainment.y + rectContainment.height){
                directions[0] = 'top';
            }
            else if (rect.y - RectHint.height - this.Config.Margin.y < rectContainment.y){
                directions[0] = 'bottom';
            }

            if (rect.x + rect.width + RectHint.width + this.Config.Margin.x > rectContainment.x + rectContainment.width){
                directions[1] = 'left';
            }
            else if (rect.x - RectHint.width - this.Config.Margin.x < rectContainment.x){
                directions[1] = 'right';
            }
            hintPack.Hint.classList.remove(direction);
            direction = directions.join('-');
            hintPack.Hint.classList.add(direction);
        }
        const Pos = this._GetPos(direction, rect, RectHint, rectContainment);
        hintPack.Hint.style.left = Pos.x + 'px';
        hintPack.Hint.style.top  = Pos.y + 'px';
        this.Config.MethodShow(hintPack.Hint);
    }
    _Hide(HintPack: THintPack){
        if (!HintPack.Hint)
            return;
        //return;
        this.Config.MethodHide(HintPack.Hint);
        setTimeout(()=>{
            HintPack.Hint.remove();
        }, this.Config.AnimationDuration)
    }

    constructor({
                    TargetArea = document.body,
                    ExtraClassNames = '',
                    QuerySelector = '.l-hint',
                    DataProp = 'hint',
                    Direction = 'top-right',
                    Margin = {x: 0, y: 0},
                    Delay = 0,
                    Duration = 0,

                    IsInstantRunListening = false,
                    IsContainment = true,

                    MethodShow = (elem) => elem.style.opacity = '1',
                    MethodHide = (elem) => elem.style.opacity = '0',
                    Render = (HintPack) => {
                        let HintText = HintPack.Target.dataset[this.Config.DataProp];
                        if (HintText === '')
                            return null;
                        return LibraryDOM.CreateElementFromString(`<div class="l-flow-hint ${this.Config.ExtraClassNames}">${HintText}</div>`);
                    }
                } : TLuffHintCtor = {}){
        this._ListenToShowSafeContext = this._ListenToShow.bind(this);
        this.Config = {
            DataProp,
            Delay,
            Duration,
            Direction,
            Margin,
            TargetArea,
            QuerySelector,
            IsContainment: IsContainment,
            ExtraClassNames,
            AnimationDuration: LibraryDOM.GetDurationAnimation('l-hint-pop'),

            MethodShow,
            MethodHide,
            Render,
        };

        const pos = getComputedStyle(TargetArea).position.toLowerCase();
        if (pos !== 'absolute' && pos !== 'relative')
            TargetArea.style.position = 'relative';

        if (IsInstantRunListening)
            this.RunListening();
    }
}