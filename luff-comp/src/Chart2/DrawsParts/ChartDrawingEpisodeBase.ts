import {ChartSeriesType} from "../default";
import {IObservableStateArray, LibraryNumber} from "luff";
import {TChartDrawingProps} from "../ChartDrawing";
import {TChartCommonProps} from "../types";
import {TChartOptions} from "../ChartBase";
import {defaultColors} from "../Defaults/colors";

export type TEpisodeOptionsBase = {
    Name?: string;
    Labels?: string[];
    Data: IObservableStateArray<number>;
    Colors?: string[];
}

type TPrevState = {
    PrevRadius: number;
    PrevWidth: number;
}
type TEpisodeValue = {
    ValueOriginal: number;
    Value: number;
}

export default class ChartDrawingEpisodeBase<TEpisodeOptions> {
    Type: ChartSeriesType;
    Episode: TEpisodeOptions & TEpisodeOptionsBase;
    Options: TChartOptions & TChartDrawingProps & TChartCommonProps;

    Data: TEpisodeValue[];
    EpisodeDataVisibles: boolean[];
    Sum: number = 0;


    MakeLegend(chartID: number,  index: number) {
        const episode = this.Episode;
        let legend = '';
        for (let j = 0; j < episode.Labels.length; j++){
            let Name = episode.Labels[j];
            let Value = episode.Data[j];
            let ValueFormatted = Name;
            // if (episode.Labels.Format !== null)
            //     ValueFormatted = episode.Labels.Format.call(this.Chart, Name, Value, episode, j);
            //TODO get chart COLOR
            let color = (episode.Colors && episode.Colors[j]) ? episode.Colors[j] : `#${LibraryNumber.GetRandom(100000, 999999)}`;

            let checked = this.EpisodeDataVisibles[j] ? `checked="checked"` : '';
            legend += `<div class="legend-item">
                          <input class="legend-checkbox" type="checkbox" ${checked} id="legend-ch-${chartID}-${index}-${j}" data-line="${index}" data-sector="${j}">
                          <label class="legend-label" for="legend-ch-${chartID}-${index}-${j}">
                             <div class="legend-icon" style="background-color: ${color}"></div>
                             <div>${ValueFormatted}</div>
                          </label>
                        </div>`
        }
        return legend;
    }

    // GetPath(i : number, diameter: number, svgHeight: number, svgWidth: number, prevState: TPrevState) : string {
    //     return '';
    // }

    CompileData() : void {}
    CompileSeries(chartOptions: TChartOptions & TChartDrawingProps & TChartCommonProps) : void {
        this.Options = chartOptions;

        this.EpisodeDataVisibles = this.Episode.Data.map(() => true);
        if (!this.Episode.Colors) {
            this.Episode.Colors = defaultColors;
        }


    }
    constructor(ctor: TEpisodeOptions & TEpisodeOptionsBase) {
        this.Episode = ctor;

    }
}