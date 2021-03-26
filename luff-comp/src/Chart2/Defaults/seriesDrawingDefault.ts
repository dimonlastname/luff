import {seriesDrawingPieDefault} from "./seriesDrawingPieDefault";
import {PieOptions} from "../DrawsParts/ChartEpisodePie";

export type TSeriesDrawingDefault = {
    Pie: PieOptions;
}
export const seriesDrawingDefault : TSeriesDrawingDefault = {
    Pie: {
        ...seriesDrawingPieDefault
    }
};