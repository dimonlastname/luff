import {TChartLegend} from "./Defaults/legend";
import {TChartAnimation} from "./Defaults/animation";
import {TChartToolTip} from "./Defaults/toolTip";




export type TChartCommonProps = {
    Title?: string; // chart caption
    Legend?: TChartLegend;
    Height?: number;
    Width?: number;
    Animation?: TChartAnimation;
    ToolTip?: TChartToolTip;
}




// export type TChartGraphProps = {
//     Title?: string; // chart caption
//
//     Legend?: {
//         Position?: ChartPositionType;
//         Visible?: boolean
//     };
//
//     Series: ChartGraphSeriesBase<any>[];
//     SeriesDefault?: {
//         Line: any;
//         Bar: any;
//     }
//     Height?: number;
//     Width?: number;
//
//     HasGrid?: boolean;
// }



// export type ChartCtor = {
//
//     //Animation?: LuffChartObjectAnimation;
//     HasGrid?: boolean;
//     AxisX?: LuffChartObjectAxisX;
//     AxisY?: LuffChartObjectAxisY;
//     //Tooltip?: LuffChartObjectTooltip;
//     SeriesOptions?: LuffChartObjectSeriesOptions;
//     Height?: number;
//     Width?: number;
//
//     Responsible?: boolean;
//     DrawAfterInit?: boolean;
//     //Disabled?: boolean;
//
//     //???^
//     //Labels?: LuffChartObjectSeriesLabel;
// }