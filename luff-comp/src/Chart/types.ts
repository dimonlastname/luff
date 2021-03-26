import {Dict} from "luff";


export enum LuffChartType {
    Line = 1,
    Bar = 2,
    Pie = 3,
    Ring = 4,
}
export type TChartPoint = number[];
export type TPositionPoint = {
    x: number;
    y: number;
}
export type TRedrawOptions = {
    Animation: boolean;
}


export type AxisXLabelItem = {
    LabelItem: Element;
    LabelItemText: Element;
}
export type LuffChartTip = {
    Name : string;
    Color : string;
    ValueX : number;
    ValueY : number;
    Value : number;
    Episode : LuffChartObjectSeries_mod;
    x : number;
    y : number;
    SvgWidth : number;
    SvgHeight : number;
    EpisodeIndex: number;
    ValueIndex: number;
}
export type LuffChartObjectSeriesOptions = {
    Colors?: string[];
    BarStack?: boolean; //default: false
    BarGradient?: boolean; //default: true
    PieStack?: boolean; //default: false
    PieType?: string; //default: 'pie' (pie, ring)
    StartAngle?: number; // (for pieChart)
    Marker?: LuffChartObjectMarker; // (for pieChart)
    Width?: number;

}

export type LuffChartObjectAnimation = {
    Bar?: string;
    Line?: string;
    Marker?: string;
    Pie?: string;
    Ring?: string;
}


export interface LuffChartObjectTooltip {
    Format?: (v) => string; //default: null
    FormatGraph?: (v) => string; //default: null
    FormatDraws?: (v) => string; //default: null
    Duration?: number; //default: 200
    Timeout?: number;// default: 700
    Position?: string; //default: 'left'
    Visible?: boolean; //default: true
    Template?: string;
    Tip?: {
        Left?:number,
        Top?:number,
        Color?: string,
    }
}
export interface LuffChartObjectTooltip_mod extends LuffChartObjectTooltip{
    Episode: LuffChartObjectSeries_mod;
    TipPrev: LuffChartObjectTooltip_mod;
    x: number;
    y: number;
}
export type LuffChartObjectSeriesLabel = {
    Data?: any[];
    Format?: (name, value, episode, j) => string; //// Format(Name, Value, Episode, j)
    Rotation?: string;
    Visible?: boolean;
}

export type LuffChartObjectMarker = {
    Radius?: number; // default: null
    Shape?: string; // default: 'circle'
    Visible?: boolean; // default: 'circle'
}
type skipFn = () => number;
export type LuffChartObjectAxisX = {
    Data: any[];
    Format?: (v) => string | null; //default: null
    Rotation?: string; //default: 'auto'
    Skip?: number; //default: null
    SkipFn?:  skipFn; //default: null
    Min?: number; //default: null
    Max?: number; //default: null
    Step?: number; //default: null
    Position?: string; //default: 'bottom'
    Visible?: boolean; //default: true
    //
    Start?: number; //null
    End?: number; //null
    //Linear?: boolean; // false if Skip is a function
}
export type LuffChartObjectAxisY = {
    Min?: number; //default: null
    Max?: number; //default: null
    Step?: number; //default: null
    StepMin?: number; //def: 0
    Position?: string; //default: 'bottom'
    Visible?: boolean; //default: true
}

export type LuffChartObjectSeries = {
    Type?: string; //default: 'line' or inherits from Chart.Type
    Data?: number[];
    Name?: string; //line-name
    Title?: string; //axis-name
    Format?: (val: any) => string; //???
    Visible?: boolean //  def: true
    AxisX?: LuffChartObjectAxisX;
    AxisY?: LuffChartObjectAxisY;
    Marker?: LuffChartObjectMarker;
    Width?: number;
    Labels?: LuffChartObjectSeriesLabel;
    Padding?: number;
    Colors?: string[];
    AngleStart?: number;
    Color?: string;
    Margin?: number;
}
export interface LuffChartObjectSeries_mod extends LuffChartObjectSeries {
    Visibles?: boolean[];
    Line: number;
    Sum?: number;
    Points?: TChartPoint[];

}
export interface LuffChartObjectScale {
    Values: number[];
}

export interface LuffChartCtor {
    Target?: HTMLElement;


    Series: LuffChartObjectSeries[];
    Type?: string; // default: 'line' (Line, Bar, Pie)
    Title?: string; ///(chart caption)
    Animation?: LuffChartObjectAnimation;
    Legend?: {Position?: string, Visible?: boolean};
    Grid?: {Visible: boolean};
    AxisX?: LuffChartObjectAxisX;
    AxisY?: LuffChartObjectAxisY;
    Tooltip?: LuffChartObjectTooltip;
    SeriesOptions?: LuffChartObjectSeriesOptions;
    Height?: number;
    Width?: number;
    Responsible?: boolean;
    DrawAfterInit?: boolean;
    Disabled?: boolean;

    //???^
    Labels?: LuffChartObjectSeriesLabel;
}
export interface LuffChartCtor_mod extends LuffChartCtor {
    Series: LuffChartObjectSeries_mod[];
    Grid: {
        Visible: boolean;
        Html: string;
    };
    Tooltip: LuffChartObjectTooltip_mod;
    Graph: LuffChartObjectSeries_mod[];
    Draws: LuffChartObjectSeries_mod[];
    //Draw: Dict<LuffChartObjectSeries_mod>;
    _Series?: {
        Padding: number;
        Line: {
            Count: number;
            CountPrepared: number;
            Delimit: number;
        },
        Bar: {
            Count: number
            CountPrepared: number;
            Delimit: number;
        },
        Pie: {
            Count: number,
            CountPrepared: number;
        },
        Ring: {
            Count: number,
            CountPrepared: number;
        }
    }

    Svg?: {
        Rect: DOMRect;
    }
}