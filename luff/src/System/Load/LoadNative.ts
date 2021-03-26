import {LibraryDOM} from "../../Library";
import Select = LibraryDOM.Select;

import "./Load.scss";

type TLoadCtor = {
    Target?: HTMLElement;
    SaveOriginalStylePosition?: boolean;
    BackgroundColor?: string;
    CustomSvg?: string;
    Size?: number[];
}

function getDefaultCtor() : TLoadCtor {
    return {
        Target: document.body,
        SaveOriginalStylePosition: false,
        BackgroundColor: '',
        CustomSvg: '',
        Size:[60, 60],
    }
}

function DoArc(radius: number, maxAngle: number, cx: number, cy: number) : string {
    let d = " M "+ (cx + radius) + " " + cy;
    for (let angle = 0; angle < maxAngle; angle++)
    {
        let rad = angle * (Math.PI / 180);  //deg to rad
        let x = cx + Math.cos(rad) * radius;
        let y = cy + Math.sin(rad) * radius;
        d += " L "+x + " " + y;
    }
    return d;
}
function getDOM() : HTMLElement {
    let dom = document.createElement('div');
    dom.classList.add('l-load-wrap');
    dom.style.display = 'none';
    return dom;
}
// `
//     <svg class="l-load-spinner" xmlns="http://www.w3.org/2000/svg">
//     <path d="${DoArc(45, 160, radius, radius)}" class="l-spinner-arc l-spinner-arc-1" fill="none" stroke="#449b22" stroke-width="5"></path>
//         <path d="${DoArc(40, 130, radius, radius)}" class="l-spinner-arc l-spinner-arc-2" fill="none" stroke="#61c8de" stroke-width="5"></path>
//         <path d="${DoArc(35, 100, radius, radius)}" class="l-spinner-arc l-spinner-arc-3" fill="none" stroke="#761c19" stroke-width="5"></path>
//         <path d="${DoArc(30, 70, radius, radius)}" class="l-spinner-arc l-spinner-arc-4" fill="none" stroke="#333333" stroke-width="5"></path>
//         </svg>
//     `
function getDefaultSpinner(radius: number) {
    return `
    <svg class="l-load-spinner" xmlns="http://www.w3.org/2000/svg">
    <path d="${DoArc(45, 160, radius, radius)}" class="l-spinner-arc l-spinner-arc-1" fill="none" stroke="#5c9baa" stroke-width="5"></path>
        <path d="${DoArc(37, 130, radius, radius)}" class="l-spinner-arc l-spinner-arc-2" fill="none" stroke="#45c971" stroke-width="5"></path>
        <path d="${DoArc(29, 100, radius, radius)}" class="l-spinner-arc l-spinner-arc-3" fill="none" stroke="#b54038" stroke-width="5"></path>
        <path d="${DoArc(21, 70, radius, radius)}" class="l-spinner-arc l-spinner-arc-4" fill="none" stroke="#777777" stroke-width="5"></path>
        </svg>
    `
}

let spinner = getDefaultSpinner(60);

export class LuffLoadNative {
    //static DefaultSvg: string;
    static SetSpinner(spinnerHTML: string) : void {
        spinner = spinnerHTML;
    }

    private _IsActive: boolean = false;
    private _Target: HTMLElement;
    private readonly DOM: HTMLElement;

    private _Timeout: number;
    private _TimeoutHide: number;

    get IsActive(){
        return this._IsActive;
    }

    Show(){
        clearTimeout(this._Timeout);
        clearTimeout(this._TimeoutHide);
        this._IsActive = true;
        this._Timeout = window.setTimeout(()=>{
            this.DOM.style.display = '';
        }, 70);
    }
    Hide(){
        clearTimeout(this._Timeout);
        clearTimeout(this._TimeoutHide);
        this._IsActive = false;
        this._TimeoutHide = window.setTimeout(() => {
            this.DOM.style.display = 'none';
        }, 250); //hide may be called in same time as the show()
    }

    constructor(ctor: TLoadCtor = {}){
        ctor = {
            ...
                getDefaultCtor(),
            ...
                ctor
        };

        this._Target = Select(ctor.Target);
        const pos = getComputedStyle(this._Target).position.toLowerCase();
        if (pos !== 'absolute' && pos !== 'relative')
            this._Target.style.position = 'relative';
        this.DOM = getDOM();
        if (ctor.BackgroundColor !== void 0){
            this.DOM.style.backgroundColor = ctor.BackgroundColor;
        }
        let cx: number = ctor.Size[0]; //diameter
        let cy: number = ctor.Size[1];

        let innerContent;
        if (ctor.CustomSvg) {
            innerContent = ctor.CustomSvg;
        } else {
            innerContent = spinner;
        }
        this.DOM.innerHTML = innerContent;
        this._Target.appendChild(this.DOM);

        this._Timeout = void 0;
        this._TimeoutHide = void 0;
        //this.Target.style.position = pos;
    }
}