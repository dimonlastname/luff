import {Dict, IObservableState, IRenderElement, LibraryDOM, LibraryNumber, React, ComponentFactory} from "luff";
import "./Chart.scss";
import {ChartPositionType} from "./default";
import ChartBase from "./ChartBase";
import {TPositionPoint, TRedrawOptions} from "../Chart/types";
import ChartDrawingEpisodeBase from "./DrawsParts/ChartDrawingEpisodeBase";
import {seriesDrawingDefault, TSeriesDrawingDefault} from "./Defaults/seriesDrawingDefault";
import {seriesDrawingPieDefault} from "./Defaults/seriesDrawingPieDefault";
import ChartEpisodePie from "./DrawsParts/ChartEpisodePie";
import {TChartToolTipData} from "./Defaults/toolTip";

//import {LuffChartClass} from "./parts/chart";




// const GRAPH_CHART_SERIES_TYPES = [
//     ChartSeriesType.Line,
//     ChartSeriesType.Bar,
// ];
// const DRAWING_CHART_SERIES_TYPES = [
//     ChartSeriesType.Pie,
// ];
export type TChartDrawingProps = {
    Series: ChartDrawingEpisodeBase<any>[];
    SeriesDefault?: TSeriesDrawingDefault;
};




export default class ChartDrawing extends ChartBase<TChartDrawingProps> {
    static Pie = ChartEpisodePie;

    static PositionType = ChartPositionType;

    static defaultProps = {
        Title: '',
    };

    ID = LibraryNumber.GetID();
    //private _ContentManager: any;


    //Target: HTMLElement;
    //Options: LuffChartCtor_mod;

    // AfterBuild() : void {
    //     this.Redraw();
    //     console.log('[Luff.Chart] AfterBuild');
    // }
    // OnAppear(): void {
    //     this.Redraw();
    //     console.log('[Luff.Chart] On Appear');
    // }
    // _TimeoutRedraw: number;
    // _Redraw(options?: TRedrawOptions) : void {
    //     //console.log('[Luff.Chart] Redraw');
    //     //let r = window.performance.now();
    //     if (this._ContentManager.Content.clientHeight){
    //         this._locked = true;
    //         this._ContentManager.Redraw(options);
    //         setTimeout(() => {
    //             this._locked = false;
    //             //this._t = window.performance.now() - this._t;
    //             //r = window.performance.now() - r;
    //             //console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
    //         })
    //     }
    // }
    // Redraw(options?: TRedrawOptions) {
    //     clearTimeout(this._TimeoutRedraw);
    //     this._TimeoutRedraw = setTimeout(() => {
    //         this._Redraw(options);
    //     }, DELAY_REDRAW)
    // }
    // Refresh(Options?){
    //     if (!this._ContentManager.Options.Graph && !this._ContentManager.Options.Draws)
    //         return this._ContentManager.Redraw(Options);
    //     this._locked = true;
    //     this._ContentManager.Refresh(Options);
    //     setTimeout(() => {
    //         this._locked = false;
    //     })
    //     //
    //     // this._ContentManager.Refresh();
    //     //
    //     // setTimeout(()=>{
    //     //     this._t = window.performance.now() - this._t;
    //     //     r = window.performance.now() - r;
    //     //     console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
    //     // }, 0)
    // }
    // SerieSwitch(SeriesNumber: number, SectorNumber: number) : void {
    //     let Series = this.Options.Series[SeriesNumber];
    //     let LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}`;
    //     let isChecked;
    //     if (Series.Type === 'pie' || Series.Type === 'ring'){
    //         LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}-${SectorNumber}`;
    //         isChecked = !this.Options.Series[SeriesNumber].Visibles[SectorNumber];
    //         this.Options.Series[SeriesNumber].Visibles[SectorNumber] = isChecked;
    //     }
    //     else{
    //         isChecked = !this.Options.Series[SeriesNumber].Visible;
    //         this.Options.Series[SeriesNumber].Visible = isChecked;
    //     }
    //     let Checkbox = document.getElementById(LegendID) as HTMLInputElement;
    //     if (Checkbox)
    //         Checkbox.checked = isChecked;
    //     this.Refresh({Animation:false});
    // }
    // get Series() : LuffChartObjectSeries[] {
    //     return this.Options.Series;
    // }
    // set Series(se) {
    //     this.Options.Series = se as LuffChartObjectSeries_mod[];
    //     LuffChartInitializer.GetSeries(this.Options);
    // }
    //
    //
    // SetSeries(series: LuffChartObjectSeries[], hasRedrawAnimation: boolean = false) {
    //     this.Options.Series = series as LuffChartObjectSeries_mod[];
    //     LuffChartInitializer.GetSeries(this.Options);
    //     this.Redraw({Animation: hasRedrawAnimation});
    // }


    Target: HTMLElement;
    ///// OLD STUFF
    //ChartName: HTMLElement;
    HookChart: HTMLElement;
    ChartLegend: HTMLElement;
    ChartSvg: HTMLElement;
    ChartTooltip: HTMLElement;

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

    _SvgRect: DOMRect;
    _PieCountPrepared: number;

    /////
    PolarToCartesius(centerX: number, centerY: number, radius: number, angleInDegrees: number): TPositionPoint {
        let angleInRadians = (angleInDegrees-0) * Math.PI / 180;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    GetArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) : string {
        //debugger;
        let start = this.PolarToCartesius(x, y, radius, endAngle);
        let end = this.PolarToCartesius(x, y, radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    }
    GetSector(x: number, y: number, radius: number, startAngle: number, endAngle: number) : string {
        //debugger;
        let start = this.PolarToCartesius(x, y, radius, endAngle);
        let end = this.PolarToCartesius(x, y, radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${x} ${y} Z`;

        // return [
        //     "M", start.x, start.y,
        //     "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        //     "L", x, y,
        //     "Z"
        // ].join(" ");
    };
    GetRing(x: number, y: number, radius: number, startAngle: number, endAngle: number, width: number) : string {
        //debugger;
        let start = this.PolarToCartesius(x, y, radius, endAngle);
        let end = this.PolarToCartesius(x, y, radius, startAngle);

        let start1 = this.PolarToCartesius(x, y, radius-width, endAngle);
        let end1 = this.PolarToCartesius(x, y, radius-width, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        //return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", end1.x, end1.y,
            "M", end1.x, end1.y,
            "A", radius-width, radius-width, 0, largeArcFlag, 1, start1.x, start1.y,
            "L", start.x, start.y
        ].join(" ");
    }

    // GetPath(i, diameter, svgHeight, svgWidth, prevState) : string {
    //     const episodeOptions = this.Episode;
    //     let sectors = '';
    //
    //     let CSSAnimationPie = this.Options.Animation.Pie;
    //     let AnimationDuration = this.Options.AnimationDurationPie;
    //
    //     let sum = 0;
    //     let AngleStart = episodeOptions.AngleStart; //-45;
    //     let r = diameter/2 * (this.Options.Series.length-i)/this.Options.Series.length;
    //     let wd = 2 * r;
    //
    //     let pieWidth = episodeOptions.Width;
    //
    //     if (pieWidth == 0 && i > 0){ //pie
    //         r = prevState.PrevRadius - prevState.PrevWidth /*- episodeOptions.Margin*/ / 2 - 0.2;
    //         if (r < 0){
    //             r = prevState.PrevRadius - i/this.Options.Series.length*prevState.PrevRadius;
    //         }
    //     }
    //     if (pieWidth > 0){ //ring
    //         wd = episodeOptions.Width;
    //         //r = r*2;// - wd/2;
    //         if (i > 0){
    //             r = prevState.PrevRadius - (prevState.PrevWidth- 0.2) /*- episodeOptions.Margin*/; //-0.2 for remove gap between rings
    //         }
    //     }
    //     prevState.PrevRadius = r;
    //     //prevState.PrevWidth = episodeOptions.Type === "pie" ? episodeOptions.Width : wd;
    //     prevState.PrevWidth = wd;
    //
    //
    //     let Sectors : number[] = [];
    //     let SectorsCount = 0;
    //     this.Sum = 0;
    //     for (let j = 0; j < this.Data.length; j++){
    //         this.Sum += this.Data[j].Value;
    //         if (!this.EpisodeDataVisibles[j])
    //         {
    //             Sectors.push(null);
    //             continue;
    //         }
    //         SectorsCount++;
    //         Sectors.push(this.Data[j].Value);
    //         sum += this.Data[j].Value;
    //     }
    //     //draw something if data empty
    //     if (SectorsCount < 1)
    //         Sectors = this.Data.map(() => 1);
    //     SectorsCount = Sectors.length;
    //     let SectorVisibleCount = this.EpisodeDataVisibles.filter(x => x).length;
    //     for (let j = 0; j < Sectors.length; j++){
    //         if(Sectors[j] === null)
    //             continue;
    //         let angle = Sectors[j]/sum * 360;
    //         if (sum === 0){
    //             angle = 360/ SectorVisibleCount;
    //         }
    //         if (angle === 360 || !Number.isFinite(angle))
    //         {
    //             angle = 359.99; //collapsing 360deg = 0deg
    //             AngleStart = 0;
    //         }
    //         let style= '';
    //         if (CSSAnimationPie) {
    //             style = `opacity: 0;transform: scale(0.01,0.01) ;  animation-delay: ${j * AnimationDuration / SectorsCount / 2}ms`;
    //         }
    //         sectors += `<g>`;
    //         if (pieWidth > 0)
    //         {
    //             sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetRing(svgWidth/2, svgHeight/2, r, AngleStart, AngleStart + angle, wd)}" fill="${episodeOptions.Colors[j]}" stroke="noe" stroke-width="0" fill-opacity="1" data-type="${this.Type}" data-line="${i}" data-sector="${j}"></path>`;
    //             //if (this.props.Tooltip.Visible)
    //             //    sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetRing(Width/2, Height/2, r, AngleStart, AngleStart+angle, wd)}" fill="#fff" stroke="none" stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
    //         }
    //         if (pieWidth === 0)
    //         {
    //             sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetSector(svgWidth/2, svgHeight/2, r, AngleStart, AngleStart + angle)}" fill="${episodeOptions.Colors[j]}" stroke="none" data-type="${this.Type}" data-line="${i}" data-sector="${j}"></path>`;
    //             //if (this.props.Tooltip.Visible)
    //             //    sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetSector(Width/2, Height/2, r, AngleStart, AngleStart+angle)}" fill="#fff" stroke="none"  stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
    //         }
    //
    //         sectors += `</g>`;
    //         AngleStart += angle;
    //     }
    //     return sectors;
    // }



    GetSvg(redrawOptions: TRedrawOptions) : string {
        return this.GetSvgPie(redrawOptions);
    }

    GetSvgPie(redrawOptions: TRedrawOptions) : string {
        //let Options = this.Options;
        //debugger
        let sectors = '';
        let svgHeight = this.HookChart.clientHeight;
        let svgWidth = this.HookChart.clientWidth;
        let diameter = svgHeight < svgWidth? svgHeight : svgWidth ;
        diameter = diameter - 2; //chrome cuts svg by ~1px


        let prevRadius = -1;
        let prevWidth = -1;
        for (let i = 0; i < this.props.Series.length; i++){
            let episode = this.props.Series[i];
            let episodeOptions = episode.Episode;
            // if (!this.props.Series[i].Visible)
            //     continue;
            //sectors += episode.GetPath(i, d, svgHeight, svgWidth, prevState);
            let CSSAnimationPie = redrawOptions.Animation === false ? '' : this.Options.Animation.Pie;
            let AnimationDuration = this.Options.AnimationDurationPie;



            let sum = 0;
            let AngleStart = episodeOptions.AngleStart; //-45;
            let r = diameter/2 * (this.Options.Series.length-i)/this.Options.Series.length;
            let wd = 2 * r;

            let pieWidth = episodeOptions.Width;

            if (pieWidth == 0 && i > 0){ //pie
                r = prevRadius - prevWidth /*- episodeOptions.Margin*/ / 2 - 0.2;
                if (r < 0){
                    r = prevRadius - i/this.Options.Series.length*prevRadius;
                }
            }
            if (pieWidth > 0){ //ring
                wd = episodeOptions.Width;
                //r = r*2;// - wd/2;
                if (i > 0){
                    r = prevRadius - (prevWidth- 0.2) /*- episodeOptions.Margin*/; //-0.2 for remove gap between rings
                }
            }
            prevRadius = r;
            //prevWidth = episodeOptions.Type === "pie" ? episodeOptions.Width : wd;
            prevWidth = wd;


            let sectorsDrawing : number[] = [];
            let sectorsDrawingCount = 0;
            episode.Sum = 0;
            for (let j = 0; j < episode.Data.length; j++){
                episode.Sum += episode.Data[j].Value;
                if (!episode.EpisodeDataVisibles[j])
                {
                    sectorsDrawing.push(null);
                    continue;
                }
                sectorsDrawingCount++;
                sectorsDrawing.push(episode.Data[j].Value);
                sum += episode.Data[j].Value;
            }
            //draw something if data empty
            if (sectorsDrawingCount < 1)
                sectorsDrawing = episode.Data.map(() => 1);
            sectorsDrawingCount = sectorsDrawing.length;
            let SectorVisibleCount = episode.EpisodeDataVisibles.filter(x => x).length;
            for (let j = 0; j < sectorsDrawing.length; j++){
                if(sectorsDrawing[j] === null)
                    continue;
                let angle = sectorsDrawing[j]/sum * 360;
                if (sum === 0){
                    angle = 360/ SectorVisibleCount;
                }
                if (angle === 360 || !Number.isFinite(angle))
                {
                    angle = 359.99; //collapsing 360deg = 0deg
                    AngleStart = 0;
                }
                let style= '';
                if (CSSAnimationPie) {
                    style = `opacity: 0;transform: scale(0.01,0.01) ;  animation-delay: ${j * AnimationDuration / sectorsDrawingCount / 2}ms`;
                }
                let episodeColor = episodeOptions.Colors[j];
                if (!episodeColor) {
                    episodeColor = `#${LibraryNumber.GetRandom(100000, 999999)}`;
                }

                sectors += `<g>`;
                if (pieWidth > 0)
                {
                    sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetRing(svgWidth/2, svgHeight/2, r, AngleStart, AngleStart + angle, wd)}" fill="${episodeColor}" stroke="noe" stroke-width="0" fill-opacity="1" data-type="${episode.Type}" data-line="${i}" data-sector="${j}"></path>`;
                    if (this.Options.ToolTip.Visible)
                        sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetRing(svgWidth/2, svgHeight/2, r, AngleStart, AngleStart+angle, wd)}" fill="#fff" stroke="none" stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
                }
                if (pieWidth === 0)
                {
                    sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetSector(svgWidth/2, svgHeight/2, r, AngleStart, AngleStart + angle)}" fill="${episodeColor}" stroke="none" data-type="${episode.Type}" data-line="${i}" data-sector="${j}"></path>`;
                    //if (this.props.Tooltip.Visible)
                    //    sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetSector(Width/2, Height/2, r, AngleStart, AngleStart+angle)}" fill="#fff" stroke="none"  stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
                }

                sectors += `</g>`;
                AngleStart += angle;
            }
        }
        //debugger;
        return sectors;
    }
    //-----


    _InitializeSeries() {
        //this.Options.Draws = this.Options.Series.filter(s => LuffChartInitializer.isDraw(s.Type));
        //let series = [];
        for (let s of this.props.Series) {
            s.CompileSeries(this.Options);
            s.Episode.Data.AddOnChange((newValue, changedState) => {
                s.CompileData();
                this.Redraw();
            })
        }

    }
    MakeLegend() {
        if (!this.props.Legend.Visible)
            return;

        let legend = '';
        for (let i = 0; i < this.props.Series.length; i++) {
            let episode = this.props.Series[i];
            legend += episode.MakeLegend(this.ID, i);

        }
        this._LegendHtml = `<div class="legend-box">${legend}</div>`
    }
    Fill() {
        //this.ChartName.innerHTML   = this.Options.Title;
        if (this.props.Legend.Visible)
            this.ChartLegend.innerHTML = this._LegendHtml;
    }
    ChartSvgInit() : void {
        this._SvgRect = this.HookChart.getBoundingClientRect();
        //this.ChartSvg.style.height = this.HookChart.clientHeight+'px';
    };
    MakeSvg(redrawOptions: TRedrawOptions) : void {
        this._PieCountPrepared = 0;
        this._SvgHtml = this.GetSvg(redrawOptions);
        this.ChartSvg.innerHTML = this._SvgHtml;
    };


    Redraw(redrawOptions: TRedrawOptions = {Animation: true}) {
        //const t = window.performance.now();
        //this.GetSeries();
        this.MakeLegend();
        this.Fill();         //this.Proto.Refresh();
        this.ChartSvgInit();
        this.MakeSvg(redrawOptions);
        //console.log('LuffChart', window.performance.now() - t);
    }

    private _InitializeSeriesDefault() {
        this.props.SeriesDefault = {
            ...seriesDrawingDefault,
            ...this.props.SeriesDefault
        };
        this.props.SeriesDefault.Pie = {
            ...seriesDrawingPieDefault,
            ...this.props.SeriesDefault.Pie
        }
    }
    GetContent() : HTMLElement {
        let htmlLegend = `<div class="legend"></div>`;
        let title = <div className="chart-name">${this.props.Title}</div>;
        return LibraryDOM.CreateElementFromString(
            `<div class="l-chart l-chart-2 l-col">
                        <table class="l-chart-t">
                            <tr class="tr-hook-top">
                                <td colspan="5" class="hook-top">
                                    ${this.props.Title && title} 
                                    ${this.props.Legend.Visible && this.props.Legend.Position===ChartPositionType.Top? htmlLegend:''}
                                </td>
                            </tr>
                            
                            <tr class="tr-hook-mid">
                                <td>${this.props.Legend.Visible && this.props.Legend.Position===ChartPositionType.Left? htmlLegend:''}</td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook left"></div>
                                </td>
                                <td rowspan="1" class="hook-chart">
                                    <div class="chart-svg-wrapper">
                                        <svg class="chart-svg"></svg>
                                    </div>
                                    <div class="chart-tooltip" style="display: none"></div>
                                </td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook right"></div>
                                </td> 
                                <td>${this.props.Legend.Visible && this.props.Legend.Position ===ChartPositionType.Right? htmlLegend:''}</td>
                            </tr>
                             
                            <tr class="tr-hook-bottom">
                                <td colspan="5" class="td-hook-bottom">
                                    ${this.props.Legend.Visible && this.props.Legend.Position===ChartPositionType.Bottom? htmlLegend:''}
                                </td> 
                            </tr>
                        </table>
                      </div>`
        );
    }
    // GetRender() {
    //     const htmlLegend = <div className="legend"/>;
    //     return (
    //         <div className="l-chart l-col">
    //             <table className="l-chart-t">
    //                 <tr className="tr-hook-top">
    //                     <td colSpan={5} className="td-hook-top">
    //                         <div className="chart-name">${this.props.Title}</div>
    //                         {
    //                             (this.props.Legend.Visible && this.props.Legend.Position === ChartPositionType.Top)
    //                             &&
    //                             htmlLegend
    //                         }
    //                     </td>
    //                 </tr>
    //
    //                 <tr className="tr-hook-mid">
    //                     <td>
    //                         {
    //                             (this.props.Legend.Visible && this.props.Legend.Position === ChartPositionType.Left)
    //                             &&
    //                             htmlLegend
    //                         }
    //                     </td>
    //                     <td rowSpan={1}>
    //                         <div className="hook-axis-y hook left"/>
    //                     </td>
    //                     <td rowSpan={1} className="hook-chart">
    //                         <div className="chart-svg-wrapper">
    //                             <svg className="chart-svg"/>
    //                         </div>
    //                         <div className="chart-tooltip"/>
    //                     </td>
    //                     <td rowSpan={1}>
    //                         <div className="hook-axis-y hook right"/>
    //                     </td>
    //                     <td>
    //                         {
    //                             (this.props.Legend.Visible && this.props.Legend.Position === ChartPositionType.Right)
    //                             &&
    //                             htmlLegend
    //                         }
    //                     </td>
    //                 </tr>
    //
    //                 <tr className="tr-hook-bottom">
    //                     <td colSpan={1} className="td-hook-bottom">
    //                         {
    //                             (this.props.Legend.Visible && this.props.Legend.Position === ChartPositionType.Bottom)
    //                             &&
    //                             htmlLegend
    //                         }
    //                     </td>
    //                 </tr>
    //             </table>
    //         </div>
    //     )
    // }

    OnLegendChange(e){
        let i = e.currentTarget.dataset['line'];
        let j = e.currentTarget.dataset['sector'];
        let Episode = this.Options.Series[i];
        Episode.EpisodeDataVisibles[j] = e.currentTarget.checked;
        if (Episode.EpisodeDataVisibles.filter(x=>x).length < 1){
            Episode.EpisodeDataVisibles[j] = true;
            e.currentTarget.checked = true;
            return;
        }
        this.Redraw({Animation: false});
    }
    _ToolTipTimeout : number;
    _ToolTipDict: Dict<IObservableState<TChartToolTipData>> = {};



    OnChartMouseEnter(){
        //console.log('OnChartMouseEnter');
        this.Tooltip.Reset();
    }
    OnChartMouseLeave(){
        //console.log('OnChartMouseLeave');
        this.Tooltip.Close();
    }
    OnChartMouseMove(e) {
        //console.log('OnChartMouseMove');
        clearTimeout(this._ToolTipTimeout);
        this._ToolTipTimeout = window.setTimeout(() => {
            //console.log(`e.target.tagName ${e.target.tagName}`);
            if (e.target.tagName.toLowerCase() !== 'path')
                return false;
            let i = parseInt(e.target.dataset["line"]);
            let j = parseInt(e.target.dataset["sector"]);
            const episode = this.Options.Series[i];
            if (!episode)
                return;


            let x = e.clientX - this._SvgRect.left;
            let y = e.clientY - this._SvgRect.top;

            //let toolTip = this._ToolTipDict[`${i}-${j}`];

            this._ToolTipState.SValue = {
                Name:  episode.Episode.Labels[j],
                Label: episode.Episode.Labels[j],
                Color: episode.Episode.Colors[j],
                ValueX: episode.Episode.Labels[j],
                ValueY: episode.Data[j].Value,
                ValueOriginalY: episode.Data[j].ValueOriginal,
                EpisodeSum: episode.Sum,

                SvgWidth: this.HookChart.clientWidth,
                SvgHeight: this.HookChart.clientHeight,

                i: i,
                j: j,
                TypeID: episode.Type,

                Left: x,
                Top: y,
            };
            this.Tooltip.Refresh();
        }, 10);
    }

    private _Initialize() {
        this._InitializeCommon();
        this._InitializeSeriesDefault();
        this._InitializeSeries();

        /* HTML */
        this.Target = this.GetFirstParentDOM();
        this.DOM = this.GetContent();

        //this.ChartName      = LibraryDOM.Select('.chart-name',        this.Content);
        this.HookChart      = LibraryDOM.Select('.hook-chart',        this.DOM);
        this.ChartLegend    = LibraryDOM.Select('.legend',            this.DOM);
        this.ChartSvg       = LibraryDOM.Select('.chart-svg',         this.DOM);
        this.ChartTooltip   = LibraryDOM.Select('.chart-tooltip',     this.DOM);

        this.Target.appendChild(this.DOM);

        /* EVENTS */
        LibraryDOM.AddEventListenerGlobal('change', '.legend-checkbox', this.OnLegendChange.bind(this), this.DOM, this);
        if (this.props.ToolTip.Visible) {
            this.HookChart.addEventListener('mousemove',  this.OnChartMouseMove.bind(this));
            this.HookChart.addEventListener('mouseenter', this.OnChartMouseEnter.bind(this));
            this.HookChart.addEventListener('mouseleave', this.OnChartMouseLeave.bind(this));

            let toolTipRendered : IRenderElement = this.props.ToolTip.Render(this._ToolTipState);
            let built = ComponentFactory.Build(toolTipRendered, null, null);
            let toolTipInner = built._GenerateDOM();
            this.ChartTooltip.appendChild(toolTipInner);
            this.Tooltip = {
                Timer: null,
                Hide: () => {
                    LibraryDOM.AsyncToggle(null, null, this.ChartTooltip, () => {},() => {
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
                        //this.Options.Tooltip.Episode = null;
                    }, this.props.ToolTip.Timeout);
                },
                Refresh: () => {
                    let Tip = this._ToolTipState.SValue;
                    const Width  = this.ChartTooltip.clientWidth;
                    const Height = this.ChartTooltip.clientHeight;

                    let Left = Tip.Left - 30;
                    let Top  = Tip.Top - 20 - Height;

                    this.ChartTooltip.style.left = Tip.Left + 'px';
                    this.ChartTooltip.style.top  = Tip.Top + 'px';

                    if (Left + Width >= Tip.SvgWidth){
                        this.ChartTooltip.classList.add('reverse');
                        Left = Tip.Left + 30 - Width;
                        this.ChartTooltip.style.left = Left + 'px';
                        this.ChartTooltip.style.top  = Top + 'px';
                    } else {
                        this.ChartTooltip.classList.remove('reverse');
                    }
                    this.Tooltip.Show();
                },
            };
            this._ToolTipState.Left.AddOnChange(() => this.Tooltip.Refresh());
            this._ToolTipState.Top.AddOnChange(() => this.Tooltip.Refresh());

        }


        //this._ContentManager = new ChartContentDraw(this);

        // if (this.Options.Height === 'auto' && this.Target.clientHeight === 0)
        //     this.Target.style.height = LuffChartInitializer.Default.R.Height + 'px';

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
        this._Initialize();



        //let ctor = this.props.options;
        // //ctor.Target = this.ParentElement.GetFirstDOM();
        // ctor.Target = this.GetFirstParentDOM();
        //
        // this.ChartCtor(ctor);
        // this.DOM = this._ContentManager.Content;
        // this.AfterBuild();
        return this.DOM;
    }
}
