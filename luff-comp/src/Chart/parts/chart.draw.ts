import {BChartContent} from "./chart.base";
import LuffChartInitializer from "./chart.initializer";
import {PropTypes, LibraryNumber, LibraryDOM} from "luff";
import {LuffChartCtor, LuffChartCtor_mod, TPositionPoint, TRedrawOptions} from "../types";



export class ChartContentDraw extends BChartContent {




    PolarToCartesius(centerX: number, centerY: number, radius: number, angleInDegrees: number): TPositionPoint {
        let angleInRadians = (angleInDegrees-0) * Math.PI / 180;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    GetPathPie(Options: TRedrawOptions) : string {
        //let Options = this.Options;
        //debugger
        let sectors = '';
        let Width = this.HookChart.clientWidth;
        let Height = this.HookChart.clientHeight;
        if (this.Options.Legend.Position === 'right' || this.Options.Legend.Position === 'left'){
            // Width = Width - this.Block.Legend.clientWidth;
        }
        //let d = Height < Width? Height*0.9:Width*0.9;
        let d = Height < Width? Height :Width ;
        d = d - 2; //chrome cuts svg by ~1px
        let PrevRadius = -1;
        let PrevWidth = -1;


        let CSSAnimationPie = this.Options.Animation.Pie;
        CSSAnimationPie = Options.Animation === false ? '' :CSSAnimationPie;
        let AnimationDuration = LibraryDOM.GetDurationAnimation(CSSAnimationPie);
        for (let i = 0; i < this.Options.Draws.length; i++){
            if (!this.Options.Draws[i].Visible)
                continue;
            let Episode = this.Options.Draws[i];
            let sum = 0;
            let AngleStart = Episode.AngleStart; //-45;
            let r = d/2 * (this.Options.Draws.length-i)/this.Options.Draws.length;
            let wd = 2*r;
            if (Episode.Type === 'pie' && i > 0){
                r = PrevRadius - PrevWidth - Episode.Margin/2 - 0.2;
                if (r < 0){
                    r = PrevRadius - i/this.Options.Draws.length*PrevRadius;
                }
            }
            if (Episode.Type === 'ring'){
                wd = Episode.Width;
                //r = r*2;// - wd/2;
                if (i > 0){
                    r = PrevRadius - (PrevWidth- 0.2) - Episode.Margin; //-0.2 for remove gap between rings
                }
            }
            PrevRadius = r;
            PrevWidth = Episode.Type === "pie" ? Episode.Width : wd;


            let Sectors = [];
            let SectorsCount = 0;
            Episode.Sum = 0;
            for (let j = 0; j < Episode.Data.length; j++){
                Episode.Sum += Episode.Data[j];
                if (!Episode.Visibles[j])
                {
                    Sectors.push(null);
                    continue;
                }
                SectorsCount++;
                Sectors.push(Episode.Data[j]);
                sum += Episode.Data[j];
            }
            //draw something if data empty
            if (SectorsCount < 1)
                Sectors = Episode.Data.map(() => 1);
            SectorsCount = Sectors.length;
            let SectorVisibleCount = Episode.Visibles.filter(x=>x).length;
            for (let j = 0; j < Sectors.length; j++){
                if(Sectors[j] === null)
                    continue;
                let angle = Sectors[j]/sum * 360;
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
                    style = `opacity: 0;transform: scale(0.01,0.01) ;  animation-delay: ${j * AnimationDuration / SectorsCount / 2}ms`;
                }
                sectors += `<g>`;
                if (Episode.Type !== 'pie')
                {
                    sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetRing(Width/2, Height/2, r, AngleStart, AngleStart + angle, wd)}" fill="${Episode.Colors[j]}" stroke="noe" stroke-width="0" fill-opacity="1" data-type="${Episode.Type}" data-line="${i}" data-sector="${j}"></path>`;
                    if (this.Options.Tooltip.Visible)
                        sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetRing(Width/2, Height/2, r, AngleStart, AngleStart+angle, wd)}" fill="#fff" stroke="none" stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
                }
                if (Episode.Type === 'pie')
                {
                    sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetSector(Width/2, Height/2, r, AngleStart, AngleStart + angle)}" fill="${Episode.Colors[j]}" stroke="none" data-type="${Episode.Type}" data-line="${i}" data-sector="${j}"></path>`;
                    if (this.Options.Tooltip.Visible)
                        sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetSector(Width/2, Height/2, r, AngleStart, AngleStart+angle)}" fill="#fff" stroke="none"  stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
                }

                sectors += `</g>`;
                AngleStart += angle;
            }
        }
        //debugger;
        return sectors;
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
        //return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", x, y,
            "Z"
        ].join(" ");
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

    GetContent() : HTMLElement {
        let HTMLLegend = `<div class="legend"></div>`;
        return LibraryDOM.CreateElementFromString(
            `<div class="l-chart l-col">
                        <table class="l-chart-t">
                            <tr class="tr-hook-top">
                                <td colspan="5" class="hook-top">
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


    /*content's*/
    GetSeries() : void {
        this.Options.Draws = this.Options.Series.filter(s => LuffChartInitializer.isDraw(s.Type));
    }
    ChartSvgInit() : void {
        this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();
        if (this.Options.Title === ''){
            this.ChartName.style.display = 'none';
        }
        else {
            this.ChartName.style.display = '';
        }
        //this.ChartSvg.style.height = this.HookChart.clientHeight+'px';
    };
    MakeLegend() : void {
        if (!this.Options.Legend.Visible)
            return;
        this._LegendHtml = '';

        for (let i = 0; i < this.Options.Draws.length; i++){
            let Episode = this.Options.Draws[i];

            let l = '';
            for (let j = 0; j < Episode.Labels.Data.length; j++){
                let Name = Episode.Labels.Data[j];
                let Value = Episode.Data[j];
                let ValueFormatted = Name;
                if (Episode.Labels.Format !== null)
                    ValueFormatted = Episode.Labels.Format.call(this.Chart, Name, Value, Episode, j);
                let Color = Episode.Colors[j] ? Episode.Colors[j] : `#${LibraryNumber.GetRandom(100000, 999999)}`;

                let checked = this.Options.Series[i].Visibles[j] ? `checked="checked"` : '';
                l += `<div class="legend-item">
                                  <input class="legend-checkbox" type="checkbox" ${checked} id="legend-ch-${this.ID}-${i}-${j}" data-line="${i}" data-sector="${j}">
                                  <label class="legend-label" for="legend-ch-${this.ID}-${i}-${j}">
                                     <div class="legend-icon" style="background-color: ${Color}"></div>
                                     <div>${ValueFormatted}</div>
                                  </label>
                                </div>`
            }
            this._LegendHtml += `<div class="legend-box">${l}</div>`;
        }
    }
    MakeSvg(Options: TRedrawOptions) : void {
        this.Options._Series.Pie.CountPrepared = 0;
        this._SvgHtml = this.GetPathPie(Options);
        this.ChartSvg.innerHTML = this._SvgHtml;
    };

    Fill(){
        this.ChartName.innerHTML   = this.Options.Title;
        if (this.Options.Legend.Visible)
            this.ChartLegend.innerHTML = this._LegendHtml;
    }
    Refresh(Options: TRedrawOptions = {Animation: true}) {
        this.MakeSvg(Options);
    }
    Redraw(Options: TRedrawOptions = {Animation: true}) {
        this.GetSeries();
        this.MakeLegend();
        this.Fill();         //this.Proto.Refresh();
        this.ChartSvgInit();
        this.MakeSvg(Options);
    }


    OnLegendChange(e){
        let i = e.currentTarget.dataset['line'];
        let j = e.currentTarget.dataset['sector'];
        let Episode = this.Options.Draws[i];
        Episode.Visibles[j] = e.currentTarget.checked;
        if (Episode.Visibles.filter(x=>x).length < 1){
            Episode.Visibles[j] = true;
            e.currentTarget.checked = true;
            return;
        }
        this.Refresh({Animation: false});
    }
    _ToolTipTimeout : number;
    OnChartMouseMove(e){
        clearTimeout(this._ToolTipTimeout);
        this._ToolTipTimeout = window.setTimeout(() => {
            //console.log(`e.target.tagName ${e.target.tagName}`);
            if (e.target.tagName.toLowerCase() !== 'path')
                return false;
            let i = e.target.dataset["line"];
            let j = e.target.dataset["sector"];
            this.Options.Tooltip.Episode = this.Options.Draws[i];
            this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();
            if (!this.Options.Tooltip.Episode)
                return;
            let x = e.clientX - this.Options.Svg.Rect.left;
            let y = e.clientY - this.Options.Svg.Rect.top;

            let EpisodeNum = e.target.dataset['line'];
            let ValueNum = e.target.dataset['item'];

            this.Tooltip.Tip =  {
                Name:  this.Options.Tooltip.Episode.Labels.Data[j],
                Label: this.Options.Tooltip.Episode.Labels.Data[j],
                Color: this.Options.Tooltip.Episode.Colors[j],
                ValueX: this.Options.Tooltip.Episode.Labels.Data[j],
                ValueY: this.Options.Tooltip.Episode.Data[j],
                Value:  this.Options.Tooltip.Episode.Data[j],
                Episode: this.Options.Tooltip.Episode,
                x: x,
                y: y,
                SvgWidth: this.HookChart.clientWidth,
                SvgHeight: this.HookChart.clientHeight,
                EpisodeNum,
                ValueNum,
            };
            //console.log(`e.pageX:${e.pageX}, e.clientX: ${e.clientX}`, e);
            this.Tooltip.Refresh();
        }, 50);

    }


    constructor(Chart){
        super(Chart);
        this.Tooltip.Format = this.Tooltip.Format  ? this.Tooltip.Format : LuffChartInitializer.Default.R.Tooltip.FormatDraws;
    }
}