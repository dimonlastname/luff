import {LibraryDOM} from "./DOM";

export class LuffListener {
    private _Interval: any;
    private _TimeOut: any;
    private _Timer: any;
    private readonly Freq: number;
    private readonly Delay: number;
    private readonly Target: HTMLElement;
    private Width: number;
    private Height: number;
    private readonly OnEvent: () => void;
    private Type: string;
    Run(){
        this.Stop();
        this._Interval = setInterval(()=>{
            this._Listen();
        }, this.Freq)
    }
    Stop(){
        clearInterval(this._Interval);
        clearTimeout(this._TimeOut);
    }

    _Listen(){
        if (!this.Target){
            this.Stop();
        }
        let Width = this.Target.clientWidth;
        if (Width !== this.Width){
            this.Width = Width;
            return this._OnEvent('width');
        }
        let Height = this.Target.clientHeight;
        if (Height !== this.Height){
            this.Height = Height;
            return this._OnEvent('height');
        }
    }
    _OnEvent(dimension?: string){
        clearTimeout(this._TimeOut);
        this._TimeOut = setTimeout(()=>{
            this.OnEvent();
        }, this.Delay)

    }
    constructor({
                    Target = null,
                    Type   = 'resize',
                    Freq   = 20,
                    Delay  = 0,
                    OnEvent = ()=>{},
                }={}){
        this.Target = LibraryDOM.Select(Target);
        if (this.Target === null)
            return;
        this.Type = 'resize';
        this.Freq = Freq;
        this.Delay = Delay;
        this.OnEvent = OnEvent;

        this._Interval = null;
        this._TimeOut    = null;

        this.Width  = this.Target.clientWidth;
        this.Height = this.Target.clientHeight;

        this._Timer = 0;
        this.Run();


    }
}