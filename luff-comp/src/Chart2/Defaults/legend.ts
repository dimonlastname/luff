import {ChartPositionType} from "../default";

export type TChartLegend = {
    Position?: ChartPositionType;
    Visible?: boolean
};

export const legend : TChartLegend = {
    Position: ChartPositionType.Top,
    Visible: true,
};