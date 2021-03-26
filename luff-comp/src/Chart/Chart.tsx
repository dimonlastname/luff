import Luff, {React, ComponentSimple, LibraryDOM, LuffListener} from "luff";
import "./Chart.scss";
import {
    LuffChartCtor,
    LuffChartCtor_mod,
    LuffChartObjectSeries,
    LuffChartObjectSeries_mod,
    TRedrawOptions
} from "./types";

import LuffChartInitializer from "./parts/chart.initializer";
import {ChartContentGraph} from "./parts/chart.graph";
import {ChartContentDraw} from "./parts/chart.draw";

type TLuffChart = {
    options: LuffChartCtor;
}



const DELAY_REDRAW = 50;

export default class LuffChart extends Luff.Content<TLuffChart> {
    static Type = {
        Line: 'line',
        Bar: 'bar',
        Ring: 'ring',
        Pie: 'pie',
    };
    static LegendPosition = {
        Top: 'top',
        Left: 'left',
        Right: 'right',
        Bottom: 'bottom',
    };
    private _t: number; //performance check
    private isGraph: boolean;
    private _ContentManager: any;
    private _locked: boolean;

    Target: HTMLElement;
    Options: LuffChartCtor_mod;
    Listener: any;

    // AfterBuild() : void {
    //     this.Redraw();
    //     console.log('[Luff.Chart] AfterBuild');
    // }
    OnAppear(): void {
        this.Redraw();
        //console.log('[Luff.Chart] On Appear');
    }
    _TimeoutRedraw: number;

    _Redraw(options?: TRedrawOptions) : void {
        //console.log('[Luff.Chart] Redraw');
        //let r = window.performance.now();
        if (this._ContentManager.Content.clientHeight){
            this._locked = true;
            this._ContentManager.Redraw(options);
            setTimeout(() => {
                this._locked = false;
                //this._t = window.performance.now() - this._t;
                //r = window.performance.now() - r;
                //console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
            })
        }
    }
    Redraw(options?: TRedrawOptions) {
        clearTimeout(this._TimeoutRedraw);
        this._TimeoutRedraw = window.setTimeout(() => {
            this._Redraw(options);
        }, DELAY_REDRAW)
    }
    Refresh(Options?){
        if (!this._ContentManager.Options.Graph && !this._ContentManager.Options.Draws)
            return this._ContentManager.Redraw(Options);
        this._locked = true;
        this._ContentManager.Refresh(Options);
        setTimeout(() => {
            this._locked = false;
        })
        //
        // this._ContentManager.Refresh();
        //
        // setTimeout(()=>{
        //     this._t = window.performance.now() - this._t;
        //     r = window.performance.now() - r;
        //     console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
        // }, 0)
    }
    SerieSwitch(SeriesNumber: number, SectorNumber: number) : void {
        let Series = this.Options.Series[SeriesNumber];
        let LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}`;
        let isChecked;
        if (Series.Type === 'pie' || Series.Type === 'ring'){
            LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}-${SectorNumber}`;
            isChecked = !this.Options.Series[SeriesNumber].Visibles[SectorNumber];
            this.Options.Series[SeriesNumber].Visibles[SectorNumber] = isChecked;
        }
        else{
            isChecked = !this.Options.Series[SeriesNumber].Visible;
            this.Options.Series[SeriesNumber].Visible = isChecked;
        }
        let Checkbox = document.getElementById(LegendID) as HTMLInputElement;
        if (Checkbox)
            Checkbox.checked = isChecked;
        this.Refresh({Animation:false});
    }
    get Series() : LuffChartObjectSeries[] {
        return this.Options.Series;
    }
    set Series(se) {
        this.Options.Series = se as LuffChartObjectSeries_mod[];
        LuffChartInitializer.GetSeries(this.Options);
    }


    SetSeries(series: LuffChartObjectSeries[], hasRedrawAnimation: boolean = false) {
        this.Options.Series = series as LuffChartObjectSeries_mod[];
        LuffChartInitializer.GetSeries(this.Options);
        this.Redraw({Animation: hasRedrawAnimation});
    }


    // componentDidUpdate(prevProps: Readonly<TLuffChart>, prevState: Readonly<{}>, snapshot?: any): void {
    //     //console.log('componentDidUpdate', this.props);
    //     if (this._Chart) {
    //         this._Chart.Series = this.props.options.Series;
    //         this._Chart.Redraw({Animation: false});
    //     }
    // }





    private ChartCtor(R: LuffChartCtor){
        this._t = window.performance.now();
        if (R.Disabled)
            return;

        this._locked = false;
        this.Target = LibraryDOM.Select(R.Target);
        LuffChartInitializer.InitR.call(this, R);

        // if (this.Options.Height === 'auto' && this.Target.clientHeight === 0)
        //     this.Target.style.height = LuffChartInitializer.Default.R.Height + 'px';

        if (this.isGraph)
            this._ContentManager = new ChartContentGraph(this);
        else
            this._ContentManager = new ChartContentDraw(this);


        // if (R.Responsible){
        //     //wait 4 render
        //     setTimeout(() => {
        //         this.Listener = new LuffListener({
        //             Target: this._ContentManager.Content,
        //             Freq: 50,
        //             Delay: 50,
        //             OnEvent: ()=>{
        //                 if (this.Listener.Height > 0 && !this._locked)
        //                     this.Redraw({Animation: false});
        //             }
        //         });
        //         this.Listener.Run();
        //     })
        // }
        // if (R.DrawAfterInit)
        // {
        //     this.Redraw();
        // }
    }

    _GenerateDOM() {
        super._GenerateDOM();
        let ctor = this.props.options;
        //ctor.Target = this.ParentElement.GetFirstDOM();
        ctor.Target = this.GetFirstParentDOM();

        this.ChartCtor(ctor);
        this.DOM = this._ContentManager.Content;
        this.AfterBuild();
        return this.DOM;
    }
}
