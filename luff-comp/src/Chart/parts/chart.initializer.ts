import {
    LuffChartCtor,
    LuffChartCtor_mod,
    LuffChartObjectSeries,
    LuffChartObjectSeries_mod, LuffChartObjectTooltip_mod,
    LuffChartTip
} from "../types";
import {LibraryObject} from "luff";
const seriesSample: LuffChartObjectSeries = {
    Type: 'line',
    Data: [],
    Name: '',      //ex.: Speed limit
    Title: '',     //ex.: km/h
    Visible: true,
    //Enabled: true,

    Format: null,

    AxisX: {
        Data: void 0,
        Start: null,
        End: null,
        Step: null,
        Skip: null,
        //Skip: 30,
        //Skip: (value)=>{return value},
        //Linear: true, // false if Skip is a function
    },
    AxisY:{
        Position: 'left',
        Min:  null,
        Max:  null,
        Step: null,
        Visible: false,
    },

    Marker: {
        Radius: null,
        Shape: 'circle',
        Visible: true,
    },

    Width: 2,
    /* Draw */
    Labels: {
        Data: [],
        Format: null, // Format(Name, Value, Episode, j)
        Visible: true,
    },
};
const defaultCtor : LuffChartCtor_mod = {
    Series: [],
    Graph: [],
    Draws: [],


    //Target: '',
    Type: 'line',
    Title: '',
    Animation: {
        Bar: 'l-animate-svg-bar', //'' or false for disable
        Line: 'l-animate-svg-line',
        Marker: 'l-animate-svg-mark',
        Pie: 'l-animate-svg-pie',
        Ring: 'l-animate-svg-ring',
    },
    Legend: {
        Position: 'top',
        Visible: true,
    },
    Grid: {
        Visible: true,
        Html: ''
    },
    AxisX: {
        Data: [],
        Format: null,
        Rotation: 'auto',
        Skip: null,
        Step: null,

        Position: 'bottom',
        Visible: true,

    },
    AxisY: {
        Position: 'left',
        Min:  null, //0
        Max:  null, //max-value
        Step: null,
        StepMin: 0,
        Visible: true,
    },
    Tooltip: {
        Format: null, /*(Tip)=>{return `<div>Name: ${Tip.Episode.Name}</div><div>Value: ${p.Value}</div>`},*/ // p {Name,Value,x,y,Episode}
        FormatGraph: function (Tip: LuffChartTip): string {
            let valueX = String(Tip.ValueX);
            let valueY = `${Tip.Episode.Name}: ${Tip.Value}`;
            if (Tip.ValueX === void 0 || Tip.ValueX === null) {
                valueX = Tip.Episode.Name;
                valueY = String(Tip.Value);
            }
            let color = Tip.Episode.Color;
            if (this.Options.Series[Tip.EpisodeIndex].Colors && this.Options.Series[Tip.EpisodeIndex].Colors[Tip.ValueIndex])
                color = this.Options.Series[Tip.Episode.Line].Colors[Tip.ValueIndex]; 

            return `<div class="tip">
                              <div class="tip-bg"></div>
                              <div class="tip-value">
                                <div class="l-row">
                                  <div class="tip-icon" style="background-color: ${color}"></div>
                                  <div class="tip-label">${valueX}</div>
                                </div>
                                <div class="l-row">${valueY}</div> 
                              </div>
                            </div>`
        },
        FormatDraws: function (Tip: LuffChartTip) {
            let Percent = Tip.Value / Tip.Episode.Sum * 100;
            if (isNaN(Percent)){
                Percent = 0;
            }
            if (Percent > 1)
                Percent = Math.round(Percent);
            else
                Percent = Math.round(Percent*100)/100;
            return `<div class="tip">
                              <div class="tip-bg"></div>
                              <div class="tip-value">
                                <div class="l-row l-flexa-center">
                                  <div class="tip-icon" style="background-color: ${Tip.Color}"></div>
                                  <div class="tip-label">${Tip.Name}: ${Tip.Value} (${Percent}%)</div>
                                </div>
                              </div>
                            </div>`
        },
        Template: '<div>Name: {{Name}}</div><div>Value: {{Value}}</div>',
        Visible: true,
        Duration: 200,
        Timeout: 700,

        TipPrev: null,
        Tip: {
            Left:0,
            Top:0,
            Color: '#000',
        },//private
        Episode: null,
        Position: null,
        x: 0,
        y: 0,
        //MultiValues: false
    },
    SeriesOptions: {
        Colors: ['red', 'green', 'cornflowerblue', 'purple', 'palevioletred', 'orange', 'tomato', 'darkblue', 'cadetblue', 'crimson'],
        // _Bar:{
        //     Stack: false,
        //     Gradient: true,
        //
        //     _Count: 0,
        // },
        BarStack:    false,
        BarGradient: true,

        PieStack:  false,
        PieType:   'pie',
        StartAngle: 0,
        Width: 2,
        Marker: {
            Radius: null,
            Shape: 'circle',
            Visible: true,
        }
    },
    Height: 400,
    Width: 600,
    Responsible: true,
};



const LuffChartInitializer = {
    isGraph: function(type){
        return LuffChartInitializer.Type.Graph.indexOf(type.toLowerCase()) > -1
    },
    isDraw: function(type){
        return LuffChartInitializer.Type.Draw.indexOf(type.toLowerCase()) > -1
    },
    Type: {
        Graph: ['line', 'bar'],
        Draw: ['pie', 'ring'],
    },
    Default:{
        Color: ['red', 'green', 'cornflowerblue', 'purple', 'palevioletred', 'orange', 'tomato', 'darkblue', 'cadetblue', 'crimson'],
        R: defaultCtor,
    },
    RAnimation(R: LuffChartCtor) : void {
        if (R.Animation === null) {
            R.Animation = {
                Bar: '',
                Line: '',
                Marker: '',
                Pie: '',
                Ring: '',
            };
            return;
        }
        R.Animation = {
            ...defaultCtor.Animation,
            ...R.Animation,
        };
        //
        // if (R.Animation){
        //     R.Animation.Bar    = R.Animation.Bar    !== void 0 ? R.Animation.Bar    : defaultCtor.Animation.Bar;
        //     R.Animation.Line   = R.Animation.Line   !== void 0 ? R.Animation.Line   : defaultCtor.Animation.Line;
        //     R.Animation.Marker = R.Animation.Marker !== void 0 ? R.Animation.Marker : defaultCtor.Animation.Marker;
        //     R.Animation.Pie    = R.Animation.Pie    !== void 0 ? R.Animation.Pie    : defaultCtor.Animation.Pie;
        //     R.Animation.Ring   = R.Animation.Ring   !== void 0 ? R.Animation.Ring   : defaultCtor.Animation.Ring;
        // } else{
        //     if (R.Animation === void 0)
        //         R.Animation = LibraryObject.Clone(defaultCtor.Animation);
        //     else
        //         R.Animation = {
        //             Bar: '',
        //             Line: '',
        //             Marker: '',
        //             Pie: '',
        //             Ring: '',
        //         };
        // }
    },
    RLegend(R: LuffChartCtor){
        R.Legend = {
            ...defaultCtor.Legend,
            ...R.Legend,
        };
        // if (R.Legend){
        //     R.Legend.Position = R.Legend.Position !== void 0 ? R.Legend.Position : defaultCtor.Legend.Position;
        //     R.Legend.Visible  = R.Legend.Visible  !== void 0 ? R.Legend.Visible :  defaultCtor.Legend.Visible;
        // }
        // else {
        //     R.Legend = LibraryObject.Clone(defaultCtor.Legend);
        // }
    },
    RLabels(R: LuffChartCtor) {
        R.Labels = {
            ...defaultCtor.Labels,
            ...R.Labels
        };
        //
        // if (R.Labels){
        //     R.Labels.Rotation = R.Labels.Rotation !== void 0 ? R.Labels.Rotation : defaultCtor.Labels.Rotation;
        //     R.Labels.Visible  = R.Labels.Visible  !== void 0 ? R.Labels.Visible  : defaultCtor.Labels.Visible;
        //     R.Labels.Data     = R.Labels.Data     !== void 0 ? R.Labels.Data     : defaultCtor.Labels.Data;
        //     R.Labels.Format   = R.Labels.Format   !== void 0 ? R.Labels.Format   : defaultCtor.Labels.Format;
        // }
        // else {
        //     R.Labels = LibraryObject.Clone(defaultCtor.Labels);
        // }
    },
    RGrid(R: LuffChartCtor_mod) {
        R.Grid = {
            ...defaultCtor.Grid,
            ...R.Grid,
        };
        // if (R.Grid){
        //     R.Grid.Visible  = R.Grid.Visible  !== void 0 ? R.Grid.Visible : defaultCtor.Grid.Visible;
        //     R.Grid.Html = '';
        // }
        // else {
        //     R.Grid = LibraryObject.Clone(defaultCtor.Grid);
        // }
    },
    RAxisX(R: LuffChartCtor_mod) {
        R.AxisX = {
            ...defaultCtor.AxisX,
            ...R.AxisX,
        };
        if (R.AxisX.Data.length === 0)
            R.AxisX.Visible = false;
        // R.AxisX.Linear = typeof R.AxisX.Skip !== 'function';
        // if (R.AxisX){
        //     R.AxisX.Visible  = R.AxisX.Visible  !== void 0 ? R.AxisX.Visible  : defaultCtor.AxisX.Visible;
        //     R.AxisX.Position = R.AxisX.Position !== void 0 ? R.AxisX.Position : defaultCtor.AxisX.Position;
        //     R.AxisX.Rotation = R.AxisX.Rotation !== void 0 ? R.AxisX.Rotation : defaultCtor.AxisX.Rotation;
        //     R.AxisX.Data     = R.AxisX.Data     !== void 0 ? R.AxisX.Data     : defaultCtor.AxisX.Data;
        //     R.AxisX.Format   = R.AxisX.Format   !== void 0 ? R.AxisX.Format   : defaultCtor.AxisX.Format;
        //     R.AxisX.Skip     = R.AxisX.Skip     !== void 0 ? R.AxisX.Skip     : defaultCtor.AxisX.Skip;
        //     R.AxisX.Step     = R.AxisX.Step     !== void 0 ? R.AxisX.Step     : defaultCtor.AxisX.Step;
        //
        //     R.AxisX.Linear   = typeof R.AxisX.Skip !== 'function';
        // }
        // else {
        //     R.AxisX = LibraryObject.Clone(defaultCtor.AxisX);
        // }
    },
    RAxisY(R: LuffChartCtor_mod){
        R.AxisY = {
            ...defaultCtor.AxisY,
            ...R.AxisY,
        };
        // if (R.AxisY){
        //     R.AxisY.Visible  = R.AxisY.Visible  !== void 0 ? R.AxisY.Visible  : defaultCtor.AxisY.Visible;
        //     R.AxisY.Position = R.AxisY.Position !== void 0 ? R.AxisY.Position : defaultCtor.AxisY.Position;
        //
        //     R.AxisY.Min     = R.AxisY.Min  !== void 0 ? R.AxisY.Min  : defaultCtor.AxisY.Min;
        //     R.AxisY.Max     = R.AxisY.Max  !== void 0 ? R.AxisY.Max  : defaultCtor.AxisY.Max;
        //     R.AxisY.Step    = R.AxisY.Step !== void 0 ? R.AxisY.Step : defaultCtor.AxisY.Step;
        //     R.AxisY.StepMin = R.AxisY.StepMin !== void 0 ? R.AxisY.StepMin : defaultCtor.AxisY.StepMin;
        //
        //     // set font by css instead
        //     // R.AxisY.Font        = R.AxisY.Font        !== void 0 ? R.AxisY.Font        : defaultCtor.AxisY.Font;
        //     // R.AxisY.Font.Family = R.AxisY.Font.Family !== void 0 ? R.AxisY.Font.Family : defaultCtor.AxisY.Font.Family;
        //     // R.AxisY.Font.Size   = R.AxisY.Font.Size   !== void 0 ? R.AxisY.Font.Size   : defaultCtor.AxisY.Font.Size;
        // }
        // else {
        //
        //     R.AxisY = LibraryObject.Clone(defaultCtor.AxisY);
        // }
    },

    RTooltip(R: LuffChartCtor_mod){
        R.Tooltip = {
            ...defaultCtor.Tooltip,
            ...R.Tooltip,
        };
        // if (R.Tooltip){
        //     R.Tooltip.Visible  = R.Tooltip.Visible   !== void 0 ? R.Tooltip.Visible  : defaultCtor.Tooltip.Visible;
        //     R.Tooltip.Template = R.Tooltip.Template  !== void 0 ? R.Tooltip.Template : defaultCtor.Tooltip.Template;
        //     R.Tooltip.Format   = R.Tooltip.Format    !== void 0 ? R.Tooltip.Format   : defaultCtor.Tooltip.Format;
        //     R.Tooltip.Timeout  = R.Tooltip.Timeout   !== void 0 ? R.Tooltip.Timeout  : defaultCtor.Tooltip.Timeout;
        //     R.Tooltip.Duration = R.Tooltip.Duration  !== void 0 ? R.Tooltip.Duration : defaultCtor.Tooltip.Duration;
        //     R.Tooltip.Tip = {};
        // }
        // else {
        //     R.Tooltip = LibraryObject.Clone(defaultCtor.Tooltip);
        // }
    },
    RSeries(R: LuffChartCtor_mod){},
    RSeriesOptions(R: LuffChartCtor_mod){
        R.SeriesOptions = {
            ...defaultCtor.SeriesOptions,
            ...R.SeriesOptions,
        };
        R.SeriesOptions.Marker = {
            ...defaultCtor.SeriesOptions.Marker,
            ...R.SeriesOptions.Marker,
        }
        //
        // if (R.SeriesOptions){
        //     R.SeriesOptions.Colors    = R.SeriesOptions.Colors    !== void 0 ? R.SeriesOptions.Colors    : defaultCtor.SeriesOptions.Colors;
        //
        //     R.SeriesOptions.BarStack    = R.SeriesOptions.BarStack    !== void 0 ? R.SeriesOptions.BarStack    : defaultCtor.SeriesOptions.BarStack;
        //     R.SeriesOptions.BarGradient = R.SeriesOptions.BarGradient !== void 0 ? R.SeriesOptions.BarGradient : defaultCtor.SeriesOptions.BarGradient;
        //     R.SeriesOptions.PieStack    = R.SeriesOptions.PieStack    !== void 0 ? R.SeriesOptions.PieStack    : defaultCtor.SeriesOptions.PieStack;
        //     R.SeriesOptions.PieType     = R.SeriesOptions.PieType     !== void 0 ? R.SeriesOptions.PieType     : defaultCtor.SeriesOptions.PieType;
        //     R.SeriesOptions.StartAngle  = R.SeriesOptions.StartAngle  !== void 0 ? R.SeriesOptions.StartAngle  : defaultCtor.SeriesOptions.StartAngle;
        //
        //     R.SeriesOptions.Width          = R.SeriesOptions.Width         !== void 0 ? R.SeriesOptions.Width         : defaultCtor.SeriesOptions.Width;
        //     R.SeriesOptions.Marker         = R.SeriesOptions.Marker         !== void 0 ? R.SeriesOptions.Marker         : defaultCtor.SeriesOptions.Marker;
        //     R.SeriesOptions.Marker.Visible = R.SeriesOptions.Marker.Visible !== void 0 ? R.SeriesOptions.Marker.Visible : defaultCtor.SeriesOptions.Marker.Visible;
        //     R.SeriesOptions.Marker.Radius  = R.SeriesOptions.Marker.Radius  !== void 0 ? R.SeriesOptions.Marker.Radius  : defaultCtor.SeriesOptions.Marker.Radius;
        //     R.SeriesOptions.Marker.Shape   = R.SeriesOptions.Marker.Shape   !== void 0 ? R.SeriesOptions.Marker.Shape   : defaultCtor.SeriesOptions.Marker.Shape;
        //
        //
        // }else{
        //     R.SeriesOptions = LibraryObject.Clone(defaultCtor.SeriesOptions);
        // }
    },



    /*###*/
    GetSeries(R: LuffChartCtor_mod) : LuffChartObjectSeries_mod[] {
        let Series = R.Series;
        let SeriesList = [];

        for (let i = 0; i < Series.length; i++) {
            //let Episode = Series[i];
            let Ep = Series[i];
            //let Ep = LibraryObject.Clone(Series[i]);

            Ep.Line = i;
            //Ep.Data = LibraryObject.Clone(Episode.Data);

            Ep.Type  = Ep.Type  !== void 0 ? Ep.Type.toLowerCase() : R.Type;
            Ep.Name  = Ep.Name  !== void 0 ? Ep.Name               : '';
            Ep.Title = Ep.Title !== void 0 ? Ep.Title              : '';

            Ep.Color = Ep.Color !== void 0 ? Ep.Color : R.SeriesOptions.Colors[i];
            Ep.Color = Ep.Color !== void 0 ? Ep.Color : '#000';

            Ep.Width = Ep.Width !== void 0 ? Ep.Width : R.SeriesOptions.Width;

            Ep.Visible = Ep.Visible !== void 0 ? Ep.Visible : seriesSample.Visible;

            Ep.Format = Ep.Format !== void 0 ? Ep.Format : seriesSample.Format;

            Ep.AxisX          = Ep.AxisX          !== void 0 ? Ep.AxisX       : LibraryObject.Clone(seriesSample.AxisX);
            Ep.AxisX.Data     = Ep.AxisX.Data     !== void 0 ? Ep.AxisX.Data  : R.AxisX.Data;
            Ep.AxisX.Start    = Ep.AxisX.Start    !== void 0 ? Ep.AxisX.Start : seriesSample.AxisX.Start;
            Ep.AxisX.End      = Ep.AxisX.End      !== void 0 ? Ep.AxisX.End   : seriesSample.AxisX.End;




            Ep.AxisY          = Ep.AxisY          !== void 0 ? Ep.AxisY          : LibraryObject.Clone(seriesSample.AxisY);
            //if Ep.AxisY is exists - visible by default
            Ep.AxisY.Visible  = Ep.AxisY.Visible  !== void 0 ? Ep.AxisY.Visible  :
                Ep.AxisY  !== void 0 ? true : seriesSample.AxisY.Visible;
            Ep.AxisY.Position = Ep.AxisY.Position !== void 0 ? Ep.AxisY.Position : seriesSample.AxisY.Position;

            Ep.AxisY.Min  = Ep.AxisY.Min  !== void 0 ? Ep.AxisY.Min  : seriesSample.AxisY.Min;
            Ep.AxisY.Max  = Ep.AxisY.Max  !== void 0 ? Ep.AxisY.Max  : seriesSample.AxisY.Max;
            Ep.AxisY.Step = Ep.AxisY.Step !== void 0 ? Ep.AxisY.Step : seriesSample.AxisY.Step;


            Ep.Marker         = Ep.Marker         !== void 0 ? Ep.Marker         : LibraryObject.Clone(R.SeriesOptions.Marker);
            Ep.Marker.Visible = Ep.Marker.Visible !== void 0 ? Ep.Marker.Visible : R.SeriesOptions.Marker.Visible;
            Ep.Marker.Shape   = Ep.Marker.Shape   !== void 0 ? Ep.Marker.Shape   : R.SeriesOptions.Marker.Shape;
            Ep.Marker.Radius  = Ep.Marker.Radius  !== void 0 ? Ep.Marker.Radius  : R.SeriesOptions.Marker.Radius;
            Ep.Marker.Radius  = Ep.Marker.Radius  !== null   ? Ep.Marker.Radius  : (4 + Ep.Width/4);





            if (LuffChartInitializer.Type.Draw.indexOf(Ep.Type) > -1){
                Ep.Colors     = Ep.Colors     ? Ep.Colors     : LuffChartInitializer.Default.Color;
                Ep.Width      = Ep.Width      ? Ep.Width      : 30;
                Ep.AngleStart = Ep.AngleStart ? Ep.AngleStart : 0;
                Ep.Margin     = Ep.Margin     ? Ep.Margin     : 0;

                Ep.Labels         = Ep.Labels         !== void 0 ? Ep.Labels         : seriesSample.Labels;
                Ep.Labels.Visible = Ep.Labels.Visible !== void 0 ? Ep.Labels.Visible : seriesSample.Labels.Visible;
                Ep.Labels.Data    = Ep.Labels.Data    !== void 0 ? Ep.Labels.Data    : seriesSample.Labels.Data;
                Ep.Labels.Format  = Ep.Labels.Format  !== void 0 ? Ep.Labels.Format  : seriesSample.Labels.Format;

                Ep.Visibles = Ep.Visibles !== void 0 ? Ep.Visibles : Ep.Data.map(() => true);


            }

            SeriesList.push(Ep);
        }
        return SeriesList;

    },

    InitR: function (R) {

        R.Name   = R.Name   !== void 0 ? R.Name   : '';
        R.Title  = R.Title  !== void 0 ? R.Title  : '';
        R.Type   = R.Type   !== void 0 ? R.Type.toLowerCase()  : 'line';
        R.Height = R.Height !== void 0 ? R.Height : 'auto';
        R.Width  = R.Width  !== void 0 ? R.Width  : 'auto';

        R.Responsible = R.Responsible  !== void 0 ? R.Responsible  : true;

        LuffChartInitializer.RAnimation(R);
        LuffChartInitializer.RLegend(R);
        //LuffChartInitializer.RLabels(R);
        LuffChartInitializer.RGrid(R);
        LuffChartInitializer.RAxisX(R);
        LuffChartInitializer.RAxisY(R);
        LuffChartInitializer.RTooltip(R);
        LuffChartInitializer.RSeriesOptions(R);

        R.DrawAfterInit = R.DrawAfterInit !== void 0 ? R.DrawAfterInit : true;

        this.Options = R;
        this.Options.Series = LuffChartInitializer.GetSeries(R);
        //FIXME IS IT OK PLACE FOR SVG.HTML?
        this.Options.Svg = {
            Html: '',
            Height: 0,
        };
        this.Options.AxisX.Html      = '';
        this.Options.AxisY.HtmlLeft  = '';
        this.Options.AxisY.HtmlRight = '';
        this.Options.Grid.Html       = '';
        this.Options.Legend.Html     = '';
        this.Options.Tooltip.Html    = '';
        //this.Options.Tooltip.Tip     = {};
        this.isGraph = this.Options.Series.filter(s=>s.Type.toLowerCase() !== 'line' && s.Type.toLowerCase() !== 'bar').length === 0;

        this.Options._Series = {
            Padding: 0,
            Line: {
                Count: 0,
                CountPrepared: 0
            },
            Bar: {
                Count: this.Options.Series.filter(s => s.Type === 'bar').length,
                CountPrepared: 0
            },
            Pie: {
                Count: this.Options.Series.filter(s => s.Type === 'bar').length,
                CountPrepared: 0
            },
            Ring: {
                Count: this.Options.Series.filter(s => s.Type === 'ring').length,
                CountPrepared: 0
            }
        }


    }
};
export default LuffChartInitializer;