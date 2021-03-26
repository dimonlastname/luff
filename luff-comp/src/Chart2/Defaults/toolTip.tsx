import {React, IObservableState, IRenderElement} from "luff";
import {ChartSeriesType} from "../default";

export type TChartToolTip = {
    Render?: (data: IObservableState<TChartToolTipData>) => IRenderElement | any;
    Visible?: boolean;
    Duration?: number;
    Timeout?: number;
}

export type TChartToolTipData = {
    ValueX: number;
    ValueY: number;
    ValueOriginalY: number;

    Name: string;
    Label: string;
    Color: string;
    i: number;
    j: number;
    EpisodeSum: number;

    SvgHeight: number;
    SvgWidth: number;
    TypeID: ChartSeriesType;

    Left: number;
    Top: number;
}


export const defaultToolTip : TChartToolTip = {
    Render: (tip) => {
        //let percent = Math.round(tip.ValueY.SValue / tip.EpisodeSum.SValue * 1000) / 10; // XX.X%

        let percent = tip.ValueY.SubState(valueY => {
            let p = Math.round(valueY / tip.EpisodeSum.SValue * 1000) / 10;
            if (isNaN(p)) {
                p = 0;
            }
            return p;
        }, [tip.EpisodeSum]);

        // if (percent > 1)
        //     percent = Math.round(percent);
        // else
        //     percent = Math.round(percent*100) / 100;

        const styleIcon = tip.Color.SubState(c => `background-color: ${c}`);
        return (
            <div className="tip">
                <div className="tip-bg"/>
                <div className="tip-value">
                    <div className="l-row l-flexa-center">
                        <div className="tip-icon" style={styleIcon}/>
                        <div className="tip-label">{tip.Name}: {tip.ValueOriginalY} ({percent}%)</div>
                    </div>
                </div>
            </div>
        )
    },
    Visible: false,
    Duration: 200,
    Timeout: 700,
};
