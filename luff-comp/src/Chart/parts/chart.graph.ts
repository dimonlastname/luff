import {BChartContent} from "./chart.base";
import LuffChartInitializer from "./chart.initializer";
import {LibraryString, LibraryNumber, LibraryDOM} from "luff";
import {
    LuffChartObjectSeries_mod,
    LuffChartObjectTooltip,
    LuffChartObjectTooltip_mod,
    LuffChartTip, TChartPoint,
    TRedrawOptions
} from "../types";

type TPathBuilder = (Points: TChartPoint[], Episode: LuffChartObjectSeries_mod, line: number, Options: TRedrawOptions) => string;

export class ChartContentGraph extends BChartContent{
    _Rendered: any;
    _FirstRedraw: any;

    GenContentProps(){
        this.ChartGrid      = LibraryDOM.Select('.chart-grid',        this.Content);
        this.AxisX          = LibraryDOM.Select('.axis-x',            this.Content);
        this.AxisYLeft      = LibraryDOM.Select('.hook-axis-y.left',  this.Content);
        this.AxisYRight     = LibraryDOM.Select('.hook-axis-y.right', this.Content);
        this.StickV         = LibraryDOM.Select('.v-stick',           this.Content);
    }

    GetPathLine(Points: TChartPoint[], Episode: LuffChartObjectSeries_mod, line: number, Options: TRedrawOptions) : string {
        const n = Points.length;

        let xs = [];        //x
        let ys = [];        //y
        let dys = [];       //dx
        let dxs = [];       //dy
        let ds = [];        //derivative
        let ms = [];        //desired slope (m) at each point using Fritsch-Carlson method
        for(let i = 0; i < n; i++) {
            xs[i] = Points[i][0];
            ys[i] = Points[i][1];
        }
        // Calculate deltas and derivative
        for(let i = 0; i < n - 1; i++) {
            dys[i] = ys[i + 1] - ys[i];
            dxs[i] = xs[i + 1] - xs[i];
            ds[i] = dys[i] / dxs[i];
        }
        // Determine desired slope (m) at each point using Fritsch-Carlson method
        // See: http://math.stackexchange.com/questions/45218/implementation-of-monotone-cubic-interpolation
        ms[0] = ds[0];
        ms[n - 1] = ds[n - 2];
        for(let i = 1; i < n - 1; i++) {
            if(ds[i] === 0 || ds[i - 1] === 0 || (ds[i - 1] > 0) !== (ds[i] > 0)) {
                ms[i] = 0;
            } else {
                ms[i] = 3 * (dxs[i - 1] + dxs[i]) / (
                    (2 * dxs[i] + dxs[i - 1]) / ds[i - 1] +
                    (dxs[i] + 2 * dxs[i - 1]) / ds[i]);
                if(!isFinite(ms[i])) {
                    ms[i] = 0;
                }
            }
        }
        let d = `M ${xs[0]},${ys[0]}`;
        let CSSAnimation = this.Options.Animation.Line;
        let CSSAnimationMark = this.Options.Animation.Marker;
        CSSAnimation = Options.Animation === false ? '':CSSAnimation;
        CSSAnimationMark = Options.Animation === false ? '':CSSAnimationMark;

       // CSSAnimation = Options.Animation === false ? '':CSSAnimation;
        let dots = '<g class="chart-markers">';
        for(let i = 0; i < n - 1; i++) {
            d += ` C ${xs[i] + dxs[i] / 3},${ys[i] + ms[i] * dxs[i] / 3} ${xs[i + 1] - dxs[i] / 3},${ys[i + 1] - ms[i + 1] * dxs[i] / 3} ${xs[i + 1]},${ys[i + 1]}`;
            if (Episode.Marker.Visible) {
                //dots += this.GetPathLineMarker(xs[i] , ys[i], line, i, Episode.Color, Episode.Marker.Radius );
                dots +=`<circle class="chart-marker ${CSSAnimationMark}" data-line="${line}" data-item="${i}" cx="${xs[i]}" cy="${ys[i]}" r="${Episode.Marker.Radius}" stroke="${Episode.Color}" stroke-width="2" fill="#fff" ></circle>`;
            }
        }
        if (Episode.Marker.Visible)
            dots +=`<circle class="chart-marker" data-line="${line}" data-item="${n-1}" cx="${xs[n-1]}" cy="${ys[n-1]}" r="${Episode.Marker.Radius}" stroke="${Episode.Color}" stroke-width="2" fill="#fff" ></circle>`;
            //dots += this.GetPathLineMarker(xs[n-1] , ys[n-1], line, n-1, Episode.Color, Episode.Marker.Radius );
        dots += '</g>';
        return `<g class="chart-episode"><path class="${CSSAnimation}" data-line="${line}" d="${d}" fill="none" stroke="${Episode.Color}" stroke-width="${Episode.Width}"></path> ${dots}</g>`;
    }
    GetPathLineMarker(x: number, y: number, i: number, j: number, color: string, width: number) : string {
        return `<circle class="chart-marker" data-line="${i}" data-item="${j}" cx="${x}" cy="${y}" r="${width}" stroke="${color}" stroke-width="2" fill="#fff" ></circle>`
    }
    GetPathBar(Points: TChartPoint[], Episode: LuffChartObjectSeries_mod, line: number, Options: TRedrawOptions) : string {
        let BarCount = this.Options._Series.Bar.Count;
        let BarCountPrepared = this.Options._Series.Bar.CountPrepared;
        let deilmit = 1;
        if (!this.Options.SeriesOptions.BarStack)
            deilmit = BarCount * 1.0;
        //let wd = Episode.Width;//this.Width/this.Options.Labels.Data.length/2 / deilmit;        //Episode.Width;

        let axisXlength = this.Options.AxisX.Data.length;
        if (axisXlength === 0) {
            axisXlength = Points.length;
        }

        let wd = Math.round(this.HookChart.clientWidth/Points.length/2 / deilmit);        //this.Options._Series.Bar.Width;//
        if (Episode.Width)
            wd = Episode.Width;
        //let wd = Math.round(this.HookChart.clientWidth/this.Options.AxisX.Data.length/2 / deilmit);        //this.Options._Series.Bar.Width;//
        //let wd = Luff.RoundBy(this.HookChart.clientWidth/this.Options.AxisX.Data.length/2 / deilmit, 0.5);        //this.Options._Series.Bar.Width;//
        //let wd = Episode.Width;
        let height = this.HookChart.clientHeight;

        let margin = ((wd*1.2) * (BarCountPrepared)) - (  (wd*1.2) *BarCount /2 - (wd*1.2)/2) ;
        if (this.Options.SeriesOptions.BarStack)
            margin = 0;
        //console.log('margin',margin);
        //TODO BAR STACK
        // debugger;

        let CSSAnimation = this.Options.Animation.Bar;
        CSSAnimation = Options.Animation === false ? '':CSSAnimation;
        let bricks = `<g class="chart-episode ${CSSAnimation}" data-type="bar" data-line="${line}">`;
        let GradientId = '';
        if (this.Options.SeriesOptions.BarGradient){
            GradientId = `lc-gradient-${LibraryNumber.GetID()}`;
            bricks += `<linearGradient id="${GradientId}"  x1="0" y1="0%"><stop offset="0%" stop-color="rgba(0,0,0,0.2)"/><stop offset="33%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0.3)"/></linearGradient>`;
        }
        let dots = '';
        for (let i = 0; i < Points.length; i++){
            //let d =`M ${margin+Points[i][0]-wd/2} ${height} L ${(margin+Points[i][0]+wd/2)} ${height} ${(margin+Points[i][0]+wd/2)} ${Points[i][1]} ${margin+Points[i][0]-wd/2} ${Points[i][1]}Z`;
            // debugger;
            let ID = LibraryNumber.GetID();

            let Px = margin+Points[i][0]-wd/2;
            let Py = Points[i][1] ;
            let h  = height-Points[i][1];
            if (wd > 1){ // wider than 1px
                Px = Math.round(Px);
                Py = Math.round(Py);
                h  = Math.round(h);
            }

            let color = Episode.Color;
            if (Episode.Colors && Episode.Colors[i])
                color = Episode.Colors[i];



            bricks += `<g class="lc-bar-elem"><rect class="chart-bar-elem" id="chart-b-${ID}" x="${Px}" y="${Py}" width="${wd}" height="${h}" fill="${color}" data-line="${line}" data-item="${i}"></rect>`;
            if (this.Options.SeriesOptions.BarGradient)
            {
                bricks += `<rect class="chart-bar-elem-gradient " id="chart-bg-${ID}" x="${Px}" y="${Py}" width="${wd}" height="${h}" fill="url(#${GradientId})" data-line="${line}" data-item="${i}"></rect>`;
            }
            bricks +='</g>';
        }
        bricks += dots+'</g>';
        this.Options._Series.Bar.CountPrepared++;
        return bricks;
    }
    GetPathBuilder(Type) : TPathBuilder {
        switch (Type){
            case 'line':
                return this.GetPathLine.bind(this);
            case 'bar':
                return this.GetPathBar.bind(this);
            default:
                return this.GetPathLine.bind(this)
        }
    }
    /*content's*/
    GetSeries() : void {
        this.Options.Graph = this.Options.Series.filter(s => LuffChartInitializer.isGraph(s.Type));
    }
    ChartSvgInit() : void {
        //this.Options.Svg.Height = this.HookChart.clientHeight;

        //debugger
        this.Options._Series.Padding = 0;
        this.Options._Series.Bar.Count = this.Options.Series.filter(s=>s.Type==='bar').length;
        if (this.Options._Series.Bar.Count > 0){
            this.Options._Series.Bar.Delimit = 1;
            if (!this.Options.SeriesOptions.BarStack)
                this.Options._Series.Bar.Delimit = this.Options._Series.Bar.Count * 0.8;
            let xLength = this.Options.AxisX.Data.length;
            if (xLength === 0) {
                xLength = Math.max.apply(null, this.Options.Series.map(x => x.Data.length));
            }
            this.Options.SeriesOptions.Width = this.HookChart.clientWidth / xLength / 2 / this.Options._Series.Bar.Delimit;
            if (this.Options._Series.Bar.Count === 1)
                this.Options._Series.Padding = this.Options.SeriesOptions.Width /2;
            else
                this.Options._Series.Padding = (this.Options.SeriesOptions.Width * 1.2)/2 * (this.Options._Series.Bar.Count );
        }
        if (this.AxisX) {
            this.AxisX.style.paddingLeft  = this.Options._Series.Padding + 'px';
            this.AxisX.style.paddingRight = this.Options._Series.Padding + 'px';
        }
        this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();

        this.ChartGrid.classList.remove('no-right');
        if (this._AxisYHtmlRight !== '')
            this.ChartGrid.classList.add('no-right');

        if (!this.Options.Title){
            this.ChartName.style.display = 'none';
        }
        else {
            this.ChartName.style.display = '';
        }
        //this.Options.Tooltip.Episode = this.Options.Graph[0];
        //this.ChartSvg.style.height = this.HookChart.clientHeight+'px';
    }

    MakeLegend() : void {
        if (!this.Options.Legend.Visible)
            return;
        this._LegendHtml = '';

        for (let i = 0; i < this.Options.Graph.length; i++){
            let Episode = this.Options.Graph[i];
            let Name  = Episode.Name;
            let Value = Episode.Data[i];
            let Color = Episode.Color;

            let ValueFormatted = Name;
            if (Episode.Format !== null)
                ValueFormatted = Episode.Format.call(this.Chart, Name, Value, Episode, i);

            let checked = this.Options.Series[i].Visible ? `checked="checked"` : '';
            this._LegendHtml += `<div class="legend-item">
                <input class="legend-checkbox" type="checkbox" ${checked} id="legend-ch-${this.ID}-${i}" data-line="${i}" data-name="${Name}">
                <label class="legend-label" for="legend-ch-${this.ID}-${i}">
                    <div class="legend-icon" style="background-color: ${Color}"></div>
                    <div>${ValueFormatted}</div>
                </label>
              </div>`;
        }
        this._LegendHtml = `<div class="legend-box">${this._LegendHtml}</div>`;
    }

    MakeAxisX(AutoSkipCoeff: number = 0, stack: number = 0) : void {
        if (!this.Options.AxisX.Visible) {
            this._AxisXHtml = '';
            return;
        }


        stack++;
        let LabelList = this.Options.AxisX.Data;
        let Len = LabelList.length;
        let AxisHtml = '';
        let GridLineHtml = '';
        let FullTextLabels = '';
        let MaxLengthLabel = '';
        let LabelCount = 0;

        let WidthTextList = []; //save widths of labels for set  them after rotation calc;
        if (!this.Options.AxisX.SkipFn) { //linar
            for (let i = 0; i < Len; i++) {
                //if (number-to-skip || no-skip)
                if ((i % this.Options.AxisX.Skip === 0) || (this.Options.AxisX.Skip === null || AutoSkipCoeff === 0) || ( this.Options.AxisX.Skip === null && AutoSkipCoeff > 0 && i % AutoSkipCoeff === 0)) {
                    let ValueFormatted = (this.Options.AxisX.Format !== null ? this.Options.AxisX.Format.call(this, LabelList[i]) : LabelList[i]).toString();
                    //let w = Weights[i]*LabelCount/Len;
                    let LabelText = ValueFormatted;
                    let LabelElem = LibraryDOM.CreateElementFromString(ValueFormatted);
                    if (LabelElem !== void 0){
                        LabelText = LabelElem.innerText;
                    }
                    WidthTextList.push(LibraryString.GetTextWidth(LabelText));

                    AxisHtml += `<div class="axis-x-label ${ValueFormatted.toString().length > 0 ? '' : 'label-empty'}"><span class="axis-x-label-text" style="left: %MarginText%px">${ValueFormatted}</span></div>`;
                    FullTextLabels += " "+ValueFormatted;
                    LabelCount++;
                    if (MaxLengthLabel.length < LabelText.length){
                        MaxLengthLabel = LabelText;
                    }
                    if (i > 0)
                        GridLineHtml += `<div class="chart-grid-cell"></div>`;
                }
            }
        } else
            {
            let Weight = 0;
            let Ws = 0;
            let Weights = [];

            let LList = LabelList
                .filter((l, i) => {
                    //if (function || number-to-skip || no-skip)
                    let Cond = (!this.Options.AxisX.SkipFn.call(this.Chart, l))
                        || (Number(i > 0) % this.Options.AxisX.Skip === 0)
                        || ( AutoSkipCoeff > 0 && i % AutoSkipCoeff === 0);
                    if (!Cond) {
                        Weight++;
                    } else {
                        if (Weight > 0) {
                            Weights.push(Weight);
                            Ws += Weight;
                        }
                        Weight = 1;
                    }
                    return Cond;
                });
            let LabelCount = LList.length;
            //TODO CHECK THESE DAMN
            Weights.push(Weight-1);
            for (let i = 0; i < LList.length; i++) {
                let ValueFormatted = this.Options.AxisX.Format !== null ? this.Options.AxisX.Format.call(this.Chart, LList[i]) : LList[i];
                let w = Weights[i] * 1 / LabelCount;
                AxisHtml += `<div class="axis-x-label no-linear ${ValueFormatted.toString().length > 0 ? '' : 'label-empty'}" style="flex: ${w}"><span class="axis-x-label-text">${ValueFormatted}</span></div>`;
                GridLineHtml += `<div class="chart-grid-cell" style="flex: ${w}"></div>`;
            }
        }
        //p = window.performance.now() - p;
        //console.log(`[p.MakeAxisX] ${Math.round(p)}ms`, p);

        //let t = performance.now();
        this.AxisX.style.setProperty('--axis-x-label-rotation', '0deg');
        this.AxisX.style.setProperty('--axis-x-label-translateX', '0px');
        this.AxisX.style.setProperty('--axis-x-label-translateY', '0px');
        this.AxisX.style.setProperty('--axis-x-label-height', 'auto');


        let st = window.getComputedStyle(this.AxisX);
        let wt = LibraryString.GetTextWidth(FullTextLabels, st.fontFamily, st.fontSize)*1.05;

        let MaxPossibleLabelWidth = this.AxisX.clientWidth/LabelCount * 0.85; //make sure that we have at least 15% white space
        let WidestLabelWidth = LibraryString.GetTextWidth(MaxLengthLabel, st.fontFamily, st.fontSize);


        let AngleDeg = 7;
        let AngleRad = AngleDeg * Math.PI / 180;
        if (this.Options.AxisX.Visible && WidestLabelWidth > MaxPossibleLabelWidth){
            //let MinW = this.AxisX.clientWidth / Len;
            let d = (wt - this.AxisX.clientWidth)/LabelCount;
            let AngleCos = MaxPossibleLabelWidth / WidestLabelWidth;

            AngleRad = Math.acos(AngleCos);
            AngleRad = AngleRad * 10/9; // up 80deg to 90+
            AngleRad = AngleRad > Math.PI/2 ? Math.PI/2: AngleRad; //set 90deg max

            AngleDeg = AngleRad*180/Math.PI;

            // let h = parseInt(st.height);
            // if (h === 0)
            //     h = 27;

            //console.log(`deg -> ${deg}, a-> ${(Math.sin(rad))*(MaxLen)}, b-> ${Math.sin(rad)*h}, MaxLen-> ${MaxLen}`);
            let sin = Math.sin(AngleRad);
            let cos = Math.cos(AngleRad);

            let Y = sin * (WidestLabelWidth/2);
            //let Y = (Math.sin(deg*Math.PI/360))*(MaxLen + h);
            let X = -d/2; //Math.sin(rad)*(MaxLen + h) / 2 ;
            const HalfFontHeight = 16; //TODO: get font height
            //let wh = cos * (WidestLabelWidth + HalfFontLineHeight)/2 ;
            let wh = sin * WidestLabelWidth + cos * HalfFontHeight ;
            //console.log(`wt:${wt}/${this.AxisX.clientWidth}, deg: ${AngleDeg}, d:${d},  wh: ${wh}, Y:${Y}, X:${X}`);
            //debugger
            this.AxisX.style.setProperty('--axis-x-label-rotation', `-${AngleDeg}deg`);
            this.AxisX.style.setProperty('--axis-x-label-translateX', `${X}px`);
            this.AxisX.style.setProperty('--axis-x-label-translateY', `${Y}px`);
            this.AxisX.style.setProperty('--axis-x-label-height', `${wh}px`);
        }
        let sin = Math.sin(AngleRad);
        let cos = Math.cos(AngleRad);
        //console.log(`cos: ${cos.toFixed(3)}, sin: ${sin.toFixed(3)}, 1-sin: ${(1-sin).toFixed(3)}, 1-cos: ${(1-cos).toFixed(3)},  AngleRad: ${AngleRad}, AngleDeg: ${AngleDeg}, MaxPossibleLabelWidth/2: ${MaxPossibleLabelWidth/2}`);
        //console.log(stack, WidthTextList);

        for (let wid of WidthTextList){
            let val = -wid * cos / 2;
            AxisHtml = AxisHtml.replace("%MarginText%",  val.toString());
        }
        //console.info(performance.now() - t);
        this._AxisXHtml = AxisHtml;
        this._GridHtmlLine = GridLineHtml;
        //const SkipCoeff = Math.ceil(wt*Math.abs( Math.cos(AngleRad) )/this.AxisX.clientWidth);
        const SkipCoeff = Math.ceil(parseFloat(st.lineHeight) / MaxPossibleLabelWidth);
        if (!this.Options.AxisX.SkipFn && this.Options.AxisX.Skip === null && SkipCoeff > 1 && stack < 2){
            return this.MakeAxisX(SkipCoeff, stack);
        }


    }
    MakeAxisY() : void {
        let i = 0;
        if (!this.Options.AxisY.Visible)
        {
            this._AxisYHtml = '';
            i = 1;
            if (this.Options.Graph.filter(x=>x.AxisY).length < 1)
                return;
        }
        let Scales = this.GetScaleY(this.HookChart.clientHeight);
        //console.log('Scales', Scales);
        let AxisYLeft = '';
        let AxisYRight = '';
        this._AxisYHtmlLeft = '';
        this._AxisYHtmlRight = '';
        //TODO render by html tree, no by string!
        for (i ; i < Scales.length; i++){
            let Scale : any = Scales[i];

            let caption = `<div class="y axis-y-caption">
    <div class="axis-y-caption-value">${i > 0 ? this.Options.Graph[Scale.SIndex].Title : this.Options.Title}</div>
</div>`;
            let a = '';
            for (let j = 0; j < Scale.Values.length; j++){
                a += `<div class="axis-y-label"><span class="axis-y-label-text">${Scale.Values[j]}</span></div>`;
            }
            let Axis = `<div class="axis-y" ${(i>0)? ('style="color: '+this.Options.Graph[Scale.SIndex].Color+'; font-weight: bold;"'):''} data-line="${i}">
    ${caption}
    <div class="axis-y-labels">${a}</div>
</div>`;
            if (Scale.SIndex < 0 && this.Options.AxisY.Position === 'left')
                AxisYLeft += Axis;
            else if (Scale.SIndex < 0 && this.Options.AxisY.Position === 'right')
                AxisYRight += Axis;
            else if (Scale.SIndex > -1 && this.Options.Graph[Scale.SIndex].AxisY.Position !== 'right')
                AxisYLeft += Axis;
            else if (Scale.SIndex > -1 && this.Options.Graph[Scale.SIndex].AxisY.Position === 'right')
                AxisYRight += Axis;
        }
        this._AxisYHtmlLeft  = AxisYLeft;
        this._AxisYHtmlRight = AxisYRight;
    }

    GetScaleY(Height) : any {
        //console.log('GetScaleY.Height', Height);
        let Series = this.Options.Graph;
        let DefaultScale = {
            Min:  this.Options.AxisY.Min  !== null ? this.Options.AxisY.Min  : Number.MAX_VALUE, //Series[0].Data[0], // to override. any value less than MAX_VALUE
            Max:  this.Options.AxisY.Max  !== null ? this.Options.AxisY.Max  : -Number.MAX_VALUE,  //Series[0].Data[0], //any value more than (-MAX_VALUE)
            Step: this.Options.AxisY.Step !== null ? this.Options.AxisY.Step : 'auto',
            StepMin: this.Options.AxisY.StepMin,

            _Min:  this.Options.AxisY.Min,
            _Max:  this.Options.AxisY.Max,
            _Step: this.Options.AxisY.Step,
            SIndex: -1,
            //Position: this.Options.AxisY.Position,

            // Title: this.Options.Title,
            // Name: this.Options.Name,
        };

        let Scales = [DefaultScale];
        //get min and max values
        for (let i = 0; i < Series.length; i++){

            let S = Series[i];
            if (!S.Visible)
                continue;
            let SData = Series[i].Data;
            let Scale : any = {
                Min: SData[0],
                Max: SData[0],
                Step: 'auto',
                SIndex: -1,
            };
            if (S.AxisY.Visible){
                Scale.SIndex = i;
                Scale.Min  = S.AxisY.Min  !== null ? S.AxisY.Min  : Scale.Min;
                Scale.Max  = S.AxisY.Max  !== null ? S.AxisY.Max  : Scale.Max;
                Scale.Step = S.AxisY.Step !== null ? S.AxisY.Step : Scale.Step;
                Scale._Min  = S.AxisY.Min;
                Scale._Max  = S.AxisY.Max;
                Scale._Step = S.AxisY.Step;

                Scales.push(Scale);
            }
            if (SData.length > 1) {
                for (let j = 0; j < SData.length; j++) {
                    let SValue = SData[j];
                    //DefaultScale
                    if (!S.AxisY.Visible && DefaultScale._Min === null && SValue < DefaultScale.Min)
                        DefaultScale.Min = SValue;
                    if (!S.AxisY.Visible && DefaultScale._Max === null && SValue > DefaultScale.Max)
                        DefaultScale.Max = SValue;

                    //Series scale
                    if (S.AxisY && S.AxisY.Min === null && SValue < Scale.Min)
                        Scale.Min = SValue;
                    if (S.AxisY && S.AxisY.Max === null && SValue > Scale.Max)
                        Scale.Max = SValue;
                }
            } else {
                if (DefaultScale.Min > SData[0])
                    DefaultScale.Min = SData[0];
                if (DefaultScale.Max < SData[0])
                    DefaultScale.Max = SData[0];

            }
        }
        if (DefaultScale.Min === DefaultScale.Max){
            if (DefaultScale.Min >= 0){
                DefaultScale.Min = 0;
            }else{
                DefaultScale.Max = 0;
            }
        }


        //calc scales
        const MagicConst = 20;   //TODO line-height or not to do
        for (let i = 0; i < Scales.length; i++){
            let Scale:any = Scales[i];
            let Step = Scale.Step;
            if (Scale.Min === 0 && Scale.Max === 0){
                Scale.Max = 1;
            }

            let OrderMax = LibraryNumber.GetNumberOrder(Scale.Max);
            if (Step === 'auto'){
                let dy = Scale.Max - Scale.Min;
                let Rounder = 5 * Math.pow(10, OrderMax-2);
                Step = LibraryNumber.RoundBy( dy * MagicConst/Height, Rounder);
            }

            if (Scale._Min === 'auto' && OrderMax > -1 && Scale.Min % 5 > 0){
                let OrderMin = LibraryNumber.GetNumberOrder(Scale.Max);
                let ToFixed = OrderMin < 0 ? -OrderMin : 0;
                Scale.Min = LibraryNumber.RoundBy(Scale.Min, Step) - Step;
                Scale.Min = parseFloat(Scale.Min.toFixed(2+ToFixed).replace('.00'+'0'.repeat(ToFixed), ''));
            }
            let ToFixed = OrderMax < 0 ? -OrderMax : 0;
            let ScaleValues = [];
            let StageValue = Scale.Min;
            let lim = 0;
            //if (strict max || auto max)
            if (Scale.Min === Scale.Max){
                Step = 1;
            }
            if (Math.abs(Step) < Math.abs(DefaultScale.StepMin))
                Step = DefaultScale.StepMin;

            while (Step !== 0 && ((StageValue <= Scale.Max && Scale._Max === 'auto') || StageValue < Scale.Max && Scale._Max !== 'auto') && lim < 10000){
                lim++;
                ScaleValues.push(StageValue);
                StageValue += Step;
                StageValue = parseFloat(StageValue.toFixed(2+ToFixed).replace('.00'+'0'.repeat(ToFixed), ''));
            }
            if (lim >= 1000)
                console.warn('Chart.GetScaleYError', this);

            ScaleValues.push(StageValue);
            Scale.Values = ScaleValues;
        }
        this._Scales = Scales;
        return Scales;
    }

    MakeGrid() : void {
        this.Options.Grid.Html = '';
        if (!this.Options.Grid.Visible)
            return;

        if (this.Options._Series.Padding > 0){
            this._GridHtmlLine = `<div class="chart-grid-cell" style="min-width: ${this.Options._Series.Padding}px; flex: 0;"></div>` + this._GridHtmlLine;
            this._GridHtmlLine += `<div class="chart-grid-cell" style="min-width: ${this.Options._Series.Padding}px; flex: 0;"></div>`;
        }
        let SizeY = this._Scales[0].Values.length-1;
        let Grid = '';
        for (let i = 0; i < SizeY; i++){
            Grid += `<div class="chart-grid-line" >${this._GridHtmlLine}</div>`;
        }
        this.Options.Grid.Html = Grid;
        this.ChartGrid.innerHTML = this.Options.Grid.Html;
    }
    MakeSvg(Options) : void{
        let svgHeight = this.HookChart.clientHeight;
        if (svgHeight < 1)
            svgHeight = 100;
        const svgWidth  = this.HookChart.clientWidth;
        this._SvgHtml = '';
        //this.Options.Svg.Width = this.HookChart.clientWidth;
        this.Options._Series.Line.CountPrepared = 0;
        this.Options._Series.Bar.CountPrepared = 0;
        this.Options._Series.Pie.CountPrepared = 0;
        for (let i = 0; i < this.Options.Graph.length; i++){
            let Episode = this.Options.Graph[i];
            if (!Episode.Visible)
                continue;
            //Episode.Prepared = {};
            let Scale = this._Scales.find(x=>x.SIndex === i);
            let Ys = this.GetValuesY(Episode, Scale, this._Scales[0], svgHeight);
            let Xs = this.GetValuesX(Episode, svgWidth);
            Episode.Points = this.GetPoints(Xs, Ys);
            //console.log(`PrepareSeries`,Ys, Xs);
            const getPath = this.GetPathBuilder(Episode.Type);
            this._SvgHtml += getPath(Episode.Points, Episode, i, Options);
        }
        this.ChartSvg.innerHTML = this._SvgHtml;
    }

    GetTip(ValueX: number, EpisodeNum: number, ValueNum: number) : LuffChartObjectTooltip_mod {
        let Episode = this.Options.Tooltip.Episode;
        let Points = Episode.Points;
        let Index = Math.round(ValueX / Points[Points.length - 1][0] * (Points.length-1));
        if (Index > Points.length-1)
            Index = Points.length-1;
        if (Index < 1)
            Index = 0;

        let TipPrev = this.Options.Tooltip.TipPrev;

        let Tip =  {
            Name: Episode.Name,
            Color: Episode.Color,
            ValueX: Episode.AxisX.Data[Index],
            ValueY: Episode.Data[Index],
            Value: Episode.Data[Index],
            Episode: Episode,
            x: Points[Index][0],
            y: Points[Index][1],
            SvgWidth: this.HookChart.clientWidth,
            SvgHeight: this.HookChart.clientHeight,
            EpisodeIndex: Episode.Line,
            ValueIndex: Index,
            TipPrev: TipPrev,
        };
        if (TipPrev && TipPrev.x === Tip.x && TipPrev.y === Tip.y)
            return TipPrev;
        return Tip;
    }
    FillLegend(){
        if (this.Options.Legend.Visible)
            this.ChartLegend.innerHTML = this._LegendHtml;
    }
    FillAxisX(){
        if (this.Options.AxisX.Visible)
            this.AxisX.innerHTML = this._AxisXHtml;
    }
    FillAxisY(){
        if (this.Options.AxisY.Visible){
            this.AxisYLeft.innerHTML      = this._AxisYHtmlLeft;
            this.AxisYRight.innerHTML     = this._AxisYHtmlRight;
        }
    }
    Fill(){
        this.ChartName.innerHTML      = this.Options.Title;
        this.FillLegend();
        this.FillAxisX();
        this.FillAxisY();
    }

    Refresh(Options: TRedrawOptions = {Animation: true}){
        this.MakeAxisX();
        this.MakeAxisY();
        this.MakeGrid();
        this.FillAxisY();
        //this.AxisYLeft.innerHTML = this._AxisYHtmlLeft;
        //this.AxisYRight.innerHTML = this._AxisYHtmlRight;
        this.MakeSvg(Options);
    }
    Redraw(Options : TRedrawOptions = {Animation: true}){
        this.GetSeries();    //get graph series
        this.MakeLegend();

        this.MakeAxisX(0, 2);
        this.MakeAxisY();

        //fix crawl width
        if (this.Options.Legend.Position === 'right' || this.Options.Legend.Position === 'left')
            this.FillLegend();
        this.FillAxisY();
        this.MakeAxisX();
        //---

        this.Fill();         //this.Proto.Refresh();
        this.ChartSvgInit();

        this.MakeSvg(Options);
        this.MakeGrid();
    }

    OnLegendChange(e){
        let i = e.currentTarget.dataset['line'];
        let Episode = this.Options.Graph[i];
        Episode.Visible = e.currentTarget.checked;
        //console.log('changed', e.currentTarget, Episode);
        if (this.Options.Graph.filter(g=>g.Visible).length < 1){
            Episode.Visible = true;
            e.currentTarget.checked = true;
            return;
        }
        this.Refresh({Animation: false});
    }
    OnChartMouseMove(e){
        //console.log(`e.target.tagName ${e.target.tagName}`);
        if (e.target.tagName === 'rect' || e.target.tagName === 'path' || e.target.tagName === 'circle'){
            let i = e.target.dataset["line"];
            this.Options.Tooltip.Episode = this.Options.Graph[i];
        }
        if (!this.Options.Tooltip.Episode)
            return;
        this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();
        let x = e.clientX - this.Options.Svg.Rect.left;
        let EpisodeNum = e.target.dataset['line'];
        let ValueNum = e.target.dataset['item'];
        let Tip = this.GetTip(x, EpisodeNum, ValueNum);
        this.Tooltip.Tip = Tip;

        //console.log(`e.pageX:${e.pageX}, e.clientX: ${e.clientX}`, e);
        this.StickV.style.left = Tip.x + 'px';
        this.Tooltip.Refresh.call(this);
    }

    constructor(Chart){
        super(Chart);

        this._Rendered = {
            /** @type {AxisXLabelItem[]} */
            AxisX: [],
            Grid: [],
        };
        this._FirstRedraw = true;
        this.Tooltip.Format = this.Tooltip.Format  ? this.Tooltip.Format : LuffChartInitializer.Default.R.Tooltip.FormatGraph;
    }
};



