import {LibraryDOM} from "./DOM";
import {LibraryNumber} from "./Number";

type TPosition = {
    x: number;
    y: number;
}
type TDragOptions = {
    OnMove?: (e?: MouseEvent) => void,
    OnDrop?: (e?: MouseEvent) => void,
    Grid?: number[],    //[1, 1]
    Containment?: any[], //void 0, [0, 1000, 0, 'auto'];
    IsGridHard?: boolean;
}

type TDragCtor = {
    Target: HTMLElement;
    Content: HTMLElement;
    Options?: TDragOptions;
}

export default class Draggable {
    _Position: TPosition = {
        x: 0,
        y: 0,
    };
    _IsDisabled: boolean = false;


    Content: HTMLElement;
    Target: HTMLElement;
    Parent: HTMLElement;

    Options: TDragOptions;




    /** @return {int[]} [left, top] */
    get Position(){
        return [this._Position.x, this._Position.y]
    }
    /** @param {int[]} pos */
    set Position(pos){
        this.Content.style.left = pos[0] + 'px';
        this.Content.style.top   = pos[1] + 'px';
    }
    Run(){

        this.Target.addEventListener('mousedown', this._drag);
        document.addEventListener('mousemove', this._move);
        document.addEventListener('mouseup', this._drop);
        return this._IsDisabled = true;
    }
    Stop(){
        this.Target.removeEventListener('mousedown', this._drag);
        document.removeEventListener('mousemove', this._move);
        document.removeEventListener('mouseup', this._drop);
        return this._IsDisabled = false;
    }


    private _drag(e: MouseEvent) : void {

    }
    private _move(e: MouseEvent) : void {

    }
    private _drop(e: MouseEvent) : void {

    }
    constructor(target: HTMLElement, movableElement: HTMLElement, options: TDragOptions){
        this.Target = LibraryDOM.Select(target);
        this.Content = movableElement ? LibraryDOM.Select(movableElement) : this.Target;

        this.Parent = this.Content.parentElement;
        this.Content.style.position = 'absolute';

        if (!options){
            options = {};
        }

        this.Options = {
            ...{
                Grid: [1, 1],
                IsGridHard: false,
                Containment: ['auto', 'auto', 'auto', 'auto'],
            },
            ...options
        };

        let obj: any, x: number, y: number, prev_x: number, prev_y: number;

        let ctn = this.Content;
        let ContentRect: ClientRect = this.Content.getBoundingClientRect();
        let ShiftY = this.Content.offsetTop - ContentRect.top;
        let ShiftX = this.Content.offsetLeft - ContentRect.left;
        let DeltaY = 0;
        let DeltaX = 0;
        this._drag = function(e: MouseEvent) {
            obj = ctn;
            ContentRect = obj.getBoundingClientRect();
            ShiftY = obj.offsetTop - ContentRect.top;
            ShiftX = obj.offsetLeft - ContentRect.left;
            prev_x = x - obj.offsetLeft;
            prev_y = y - obj.offsetTop;
        };
        this._move = (e: MouseEvent) => {
            if (e.pageX) {
                x = e.pageX;
                y = e.pageY;
            }
            if(obj) {
                //fix position if scrolling
                let ContentRectCurrent: ClientRect = obj.getBoundingClientRect();
                let ShiftYNew = obj.offsetTop - ContentRectCurrent.top;
                let ShiftXNew = obj.offsetLeft - ContentRectCurrent.left;
                DeltaY = ShiftYNew - ShiftY;
                DeltaX = ShiftXNew - ShiftX;
                let res_x = x - prev_x + DeltaX;
                let res_y = y - prev_y + DeltaY;

                ContentRect = ContentRectCurrent;
                if (this.Options.Grid[0] && this.Options.IsGridHard && x !== prev_x){
                    res_x = LibraryNumber.RoundBy(res_x, this.Options.Grid[0], x < prev_x ? 'ceil':'floor'); //todo check ceil/floor mode
                }
                if (this.Options.Grid[1] && this.Options.IsGridHard  && y!==prev_y){
                    res_y = LibraryNumber.RoundBy(res_y, this.Options.Grid[1], y < prev_y ? 'ceil':'floor');
                }
                if (this.Options.Containment[0] !== 'auto' && res_x < this.Options.Containment[0]){
                    res_x = <number>this.Options.Containment[0];
                }
                if (this.Options.Containment[1] !== 'auto' && res_y < this.Options.Containment[1]){
                    res_y = <number>this.Options.Containment[1];
                }
                if (this.Options.Containment[2] !== 'auto' && res_x + obj.clientWidth > this.Options.Containment[2]){
                    res_x = <number>this.Options.Containment[2] - obj.clientWidth;
                }
                if (this.Options.Containment[3] !== 'auto' && res_y + obj.clientHeight > this.Options.Containment[3]){
                    res_y = <number>this.Options.Containment[3] - obj.clientHeight;
                }
                //console.log(res_x, res_y);
                obj.style.left = res_x + 'px';
                obj.style.top = res_y + 'px';
                if (options.OnMove)
                    options.OnMove(e);
            }
        };
        this._drop = (e)=>{
            if (!obj)
                return;
            if(obj && !this.Options.IsGridHard ) {
                let res_x = x - prev_x + DeltaX;
                let res_y = y - prev_y + DeltaY;
                if (this.Options.Grid[0] && x!==prev_x){
                    res_x = LibraryNumber.RoundBy(res_x, this.Options.Grid[0], x < prev_x ? 'ceil':'floor');
                }
                if (this.Options.Grid[1] && y!==prev_y){
                    res_y = LibraryNumber.RoundBy(res_y, this.Options.Grid[1], y < prev_y ? 'ceil':'floor');
                }
                if (this.Options.Containment[0] !== 'auto' && res_x < this.Options.Containment[0]){
                    res_x = <number>this.Options.Containment[0];
                }
                if (this.Options.Containment[1] !== 'auto' && res_y < this.Options.Containment[1]){
                    res_y = <number>this.Options.Containment[1];
                }
                if (this.Options.Containment[2] !== 'auto' && res_x + obj.clientWidth > this.Options.Containment[2]){
                    res_x = <number>this.Options.Containment[2] - obj.clientWidth;
                }
                if (this.Options.Containment[3] !== 'auto' && res_y + obj.clientHeight > this.Options.Containment[3]){
                    res_y = <number>this.Options.Containment[3] - obj.clientHeight;
                }
                //console.log(res_x, res_y);
                this._Position.x = res_x;
                this._Position.y = res_y;
                obj.style.left = res_x + 'px';
                obj.style.top = res_y + 'px';
            }
            obj = false;
            if (options.OnDrop)
                options.OnDrop(e);
        };
        this.Target.addEventListener('mousedown', this._drag);
        document.addEventListener('mousemove', this._move);
        document.addEventListener('mouseup', this._drop);
    }
};