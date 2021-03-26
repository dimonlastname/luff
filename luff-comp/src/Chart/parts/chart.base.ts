import {
    LuffChartCtor_mod,
    LuffChartObjectScale,
    LuffChartObjectSeries_mod,
    LuffChartObjectTooltip_mod,
    LuffChartTip, TChartPoint
} from "../types";
import {PropTypes, LibraryNumber, LibraryDOM} from "luff";
import LuffChart from "../Chart";

type TEpisodeWidthRange = {
    Start: number;
    EpisodeWidth: number;
}


export class BChartContent {
    ID: number;
    Options: LuffChartCtor_mod;
    Refresh(options?: any) : any {};
    Tooltip: any;
    GetTip(ValueX, EpisodeNum, ValueNum): LuffChartObjectTooltip_mod { return null }
    StickV: HTMLElement;
    Chart: any;
    Content: HTMLElement;
    ChartName: any;
    HookChart: any;
    ChartLegend: any;
    ChartSvg: any;
    ChartTooltip: any;

    ChartGrid: HTMLElement;
    AxisX: HTMLElement;
    AxisYLeft: HTMLElement;
    AxisYRight: HTMLElement;

    _LegendHtml: string;
    _SvgHtml: string;
    _AxisXHtml: string;
    _AxisYHtml: string;
    _AxisYHtmlLeft: string;
    _AxisYHtmlRight: string;
    _GridHtml: string;
    _GridHtmlLine: string;

    _Scales: any[];


    GetEpisodeWidthRange(episode: LuffChartObjectSeries_mod, width: number) : TEpisodeWidthRange {
        let XData = episode.AxisX.Data;
        if (XData.length === 0)
            XData = Object.keys(episode.Data);
        let Type = PropTypes.GetType(episode.AxisX.Data[0]);

        let Start = 0;
        let End   = width;

        if (Type === 'date'){
            XData = XData.map(x => x.valueOf());
        }


        if (episode.AxisX.Start !== null && (Type === 'number' || Type === 'date') ){
            let S = Type !== 'date'  ? episode.AxisX.Start : episode.AxisX.Start.valueOf();
            let pos = XData.indexOf(S);
            if (pos > -1)
                Start = width * pos / episode.AxisX.Data.length
        }
        if (episode.AxisX.End !== null && (Type === 'number' || Type === 'date')){
            let E = Type !== 'date' ? episode.AxisX.Start : episode.AxisX.End.valueOf();
            let pos = XData.indexOf(E);
            if (pos > -1)
                End = width * pos / episode.AxisX.Data.length;//Episode.Data.length;
        }
        let EpisodeWidth = End - Start;
        return {
            Start: Start,
            EpisodeWidth: EpisodeWidth
        };
    }
    GetValuesY(Episode: LuffChartObjectSeries_mod, Scale: LuffChartObjectScale, DefaultScale: LuffChartObjectScale, Height: number) : number[] {
        let Ys = [];
        let MaxValue = DefaultScale.Values[DefaultScale.Values.length - 1];  //Math.max.apply(null, DefaultScale.Values);
        let MinValue = DefaultScale.Values[0]; //Math.min.apply(null, DefaultScale.Values);
        MaxValue = !Scale ? MaxValue : Scale.Values[Scale.Values.length - 1];
        MinValue = !Scale ? MinValue : Scale.Values[0];
        for (let j= 0; j < Episode.Data.length; j++){
            Ys.push( Height - (  (Episode.Data[j] - MinValue) * Height/(MaxValue-MinValue) )  );
        }
        return Ys;
    }
    GetValuesX(Episode: LuffChartObjectSeries_mod, Width: number) : number[] {
        if (Episode.Data.length < 1)
            return [0];

            //return [EpisodeWidth/2];
        let w = this.GetEpisodeWidthRange(Episode, Width - 2 * this.Options._Series.Padding);
        let EpisodeWidth = w.EpisodeWidth;

        if (Episode.Data.length < 2) {
            const stepX = EpisodeWidth / (this.Options.Graph.length - 1);
            return [w.Start + Episode.Line * stepX]
        }

        let stepX = EpisodeWidth / (Episode.Data.length-1);
        return Episode.Data.map((x, i) => x !== null ? w.Start + i*stepX : 0);
    }
    GetPoints(xs : number[], ys: number[]): TChartPoint[] {
        let Points = [];
        for (let i = 0; i < ys.length; i++){
            Points.push([xs[i] + this.Options._Series.Padding, ys[i]]);
        }
        return Points;
    }





    GetContent() : HTMLElement {
        let HTMLLegend = `<div class="legend"></div>`;
        let HTMLAxisX = `<div class="axis-x"></div>`;
        return LibraryDOM.CreateElementFromString(
            `<div class="l-chart l-col">
                        <table class="l-chart-t">
                            <tr class="tr-hook-top">
                                <td colspan="5" class="td-hook-top">
                                    <div class="chart-name"></div>
                                    ${this.Options.Legend.Visible && this.Options.Legend.Position==='top'? HTMLLegend:''}
                                </td>
                            </tr>
                            
                            <tr class="tr-hook-mid">
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position==='left'? HTMLLegend:''}</td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook left"></div>
                                </td>
                                <td rowspan="1" class="hook-chart">
                                    <div class="chart-svg-wrapper">
                                        <svg class="chart-svg"></svg>
                                    </div>
                                    <div class="chart-grid"></div>
                                    <div class="chart-tooltip"></div>
                                    <div class="v-stick"></div>
                                </td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook right"></div>
                                </td> 
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position ==='right'? HTMLLegend:''}</td>
                            </tr>
                            
                            <tr class="tr-hook-axis-x">
                                <td colspan="1" class="td-hook-null"></td> 
                                <td colspan="1" class="td-hook-null"></td> 
                                <td colspan="1" class="hook-axis-x">
                                    ${this.Options.AxisX.Visible ? HTMLAxisX : ''} 
                                </td> 
                                <td colspan="1" class="td-hook-null"></td>
                                <td colspan="1" class="td-hook-null"></td>
                            </tr>
                            <tr class="tr-hook-bottom">
                                <td colspan="5" class="td-hook-bottom">
                                    ${this.Options.Legend.Visible && this.Options.Legend.Position==='bottom'? HTMLLegend:''}
                                </td>
                            </tr>
                        </table>
                      </div>`);
    }
    GetContentDraw() : HTMLElement {
        let HTMLLegend = `<div class="legend"></div>`;
        return LibraryDOM.CreateElementFromString(
            `<div class="l-chart l-col">
                        <table class="l-chart-t">
                            <tr class="tr-hook-top">
                                <td colspan="5" class="td-hook-top">
                                    <div class="chart-name"></div>
                                    ${this.Options.Legend.Visible && this.Options.Legend.Position==='top'? HTMLLegend:''}
                                </td>
                            </tr>
                            
                            <tr class="tr-hook-mid">
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position==='left'? HTMLLegend:''}</td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook left"></div>
                                </td>
                                <td rowspan="1" class="hook-chart">
                                    <div class="chart-svg-wrapper">
                                        <svg class="chart-svg"></svg>
                                    </div>
                                    <div class="chart-tooltip"></div>
                                </td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook right"></div>
                                </td> 
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position ==='right'? HTMLLegend:''}</td>
                            </tr>
                             
                            <tr class="tr-hook-bottom">
                                <td colspan="5" class="td-hook-bottom">
                                    ${this.Options.Legend.Visible && this.Options.Legend.Position==='bottom'? HTMLLegend:''}
                                </td> 
                            </tr>
                        </table>
                      </div>`
        );
    }
    GenContentProps(){}

    MakeLegend(){}

    OnLegendChange(e) : void {
        let i = e.currentTarget.dataset['line'];
        let Episode = this.Options.Graph[i];
        Episode.Visible = e.currentTarget.checked;
        //console.log('changed', e.currentTarget, Episode);
        let graphSeries : LuffChartObjectSeries_mod[] = this.Options.Graph;
        if (graphSeries.filter(g => g.Visible).length < 1){
            Episode.Visible = true;
            e.currentTarget.checked = true;
            return;
        }
        this.Refresh();
    }
    //_ToolTipTimeout : number;
    OnChartMouseMove(e): void {};
    // OnChartMouseMove(e) : void  {
    //     clearTimeout(this._ToolTipTimeout);
    //     this._ToolTipTimeout = window.setTimeout(() => {
    //         //console.log(`e.target.tagName ${e.target.tagName}`);
    //         if (e.target.tagName === 'path' || e.target.tagName === 'circle'){
    //             let i = e.target.dataset["line"];
    //             this.Options.Tooltip.Episode = this.Options.Graph[i];
    //         }
    //         if (!this.Options.Tooltip.Episode)
    //             return;
    //
    //         let x = e.clientX - this.Options.Svg.Rect.left;
    //         let EpisodeNum = e.target.dataset['line'];
    //         let ValueNum = e.target.dataset['item'];
    //         let Tip = this.GetTip(x, EpisodeNum, ValueNum);
    //         this.Tooltip.Tip = Tip;
    //
    //         //console.log(`e.pageX:${e.pageX}, e.clientX: ${e.clientX}`, e);
    //         this.StickV.style.left = Tip.x + 'px';
    //         this.Tooltip.Refresh();
    //         console.log('OnChartMouseMove');
    //     }, 50)
    //
    // }
    OnChartMouseEnter(){
        this.Tooltip.Reset();
    }
    OnChartMouseLeave(){
        this.Tooltip.Close();
    }
    constructor(Chart: LuffChart) {
        /* sys */
        this.ID = LibraryNumber.GetID();
        this.Chart = Chart;
        this.Options = Chart.Options;

        /* HTML */
        this.Content = this.GetContent();

        this.ChartName      = LibraryDOM.Select('.chart-name',        this.Content);
        this.HookChart      = LibraryDOM.Select('.hook-chart',        this.Content);
        this.ChartLegend    = LibraryDOM.Select('.legend',            this.Content);
        this.ChartSvg       = LibraryDOM.Select('.chart-svg',         this.Content);
        this.ChartTooltip   = LibraryDOM.Select('.chart-tooltip',     this.Content);

        this.GenContentProps();
        Chart.Target.appendChild(this.Content);

        /* EVENTS */
        LibraryDOM.AddEventListenerGlobal('change', '.legend-checkbox', this.OnLegendChange.bind(this), this.Content, this);
        this.Tooltip = {};
        if (this.Options.Tooltip.Visible){
            this.HookChart.addEventListener('mousemove',  this.OnChartMouseMove.bind(this));
            this.HookChart.addEventListener('mouseenter', this.OnChartMouseEnter.bind(this));
            this.HookChart.addEventListener('mouseleave', this.OnChartMouseLeave.bind(this));
            this.Tooltip = {
                Timer: null,
                Format: this.Options.Tooltip.Format,
                Hide: () => {
                    LibraryDOM.AsyncToggle(null, null, this.ChartTooltip, ()=>{},()=>{
                        this.ChartTooltip.style.display = 'none';
                    }, 'l-appear', 'l-disappear', 200, this.Tooltip.Timer)
                },
                Show: () => {
                    LibraryDOM.AsyncToggle(null, null, this.ChartTooltip, ()=>{
                        this.ChartTooltip.style.display = '';
                    },() => {}, 'l-disappear', 'l-appear', 200, this.Tooltip.Timer)
                },
                Reset: () => {
                    if (this.Tooltip.Timer)
                        clearTimeout(this.Tooltip.Timer);
                },
                Close: () => {
                    clearTimeout(this.Tooltip.Timer);
                    this.Tooltip.Timer = setTimeout(() => {
                        this.Tooltip.Hide();
                        this.Tooltip.Timer = null;
                        this.Options.Tooltip.Episode = null;
                    }, this.Options.Tooltip.Timeout);
                },
                Refresh: () => {
                    if (this.Tooltip.TipPrev === this.Tooltip.Tip)
                        return;
                    this.Options.Tooltip.TipPrev = this.Tooltip.Tip;
                    let Tip = this.Tooltip.Tip;

                    this.ChartTooltip.innerHTML = this.Tooltip.Format.call(this, Tip);

                    Tip.Width  = this.ChartTooltip.clientWidth;
                    Tip.Height = this.ChartTooltip.clientHeight;

                    Tip.Left = Tip.x - 30;
                    Tip.Top  = Tip.y - 20 - Tip.Height;

                    this.ChartTooltip.style.left = Tip.Left + 'px';
                    this.ChartTooltip.style.top  = Tip.Top + 'px';

                    if (Tip.Left + Tip.Width >= Tip.SvgWidth){
                        this.ChartTooltip.classList.add('reverse');
                        Tip.Left = Tip.x + 30 - Tip.Width;
                        this.ChartTooltip.style.left = Tip.Left + 'px';
                        this.ChartTooltip.style.top  = Tip.Top + 'px';
                    }else{
                        this.ChartTooltip.classList.remove('reverse');
                    }
                    this.Tooltip.Show();
                },
            };
        }



    }
};