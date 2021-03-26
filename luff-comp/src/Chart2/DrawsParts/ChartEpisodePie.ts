import ChartDrawingSeriesBase, {TEpisodeOptionsBase} from "./ChartDrawingEpisodeBase";
import {ChartSeriesType} from "../default";

export type PieOptions = {
    Width?: number;
    AngleStart?: number;
    IsRelative?: boolean;
}
export type PieCtor = PieOptions & TEpisodeOptionsBase;


const defaultEpisode: PieOptions = {
    Width: 0,
    AngleStart: -90,
    IsRelative: false,
}

// type TEpisodePie = {
//     Data: TEpisodeValue[];
// }


export default class ChartEpisodePie extends ChartDrawingSeriesBase<PieCtor> {
    Type = ChartSeriesType.Pie;






    CompileData() {
        if (this.Episode.IsRelative && this.Episode.Data.length > 2) {
            throw new Error('[Luff.Chart] Pie chart with IsRelative=true must have 2 values only');
        }
        this.Episode = {
            ...defaultEpisode,
            ...this.Episode,
        };

        if (this.Episode.IsRelative) {
            let data = this.Episode.Data.SValue;
            let episodeData = [0, 0];
            episodeData[0] = (data[0] / data[1]) || 0;
            episodeData[1] = 1 - episodeData[0];
            if (episodeData[0] > 1) {
                episodeData[0] = 1;
                episodeData[1] = 0;
            }
            this.Data = episodeData.map((x, i) => {
                return {
                    ValueOriginal: data[i],
                    Value: x,
                }
            });
            return;
        }
        this.Data = this.Episode.Data.map(x => ({
            ValueOriginal: x,
            Value: x,
        }));
    }
    CompileSeries(chartOptions): void {
        super.CompileSeries(chartOptions);
        this.Episode = {
            Name: '',
            ...chartOptions.SeriesDefault.Pie,
            ...this.Episode,
        };
        this.CompileData();
    }

    constructor(ctor: PieCtor) {
        super(ctor);

    }
}