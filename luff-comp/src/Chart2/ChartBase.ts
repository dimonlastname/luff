import Luff, {IObservableState, LibraryDOM} from "luff";

import {legend} from "./Defaults/legend";
import {TChartCommonProps} from "./types";
import {defaultAnimation} from "./Defaults/animation";
import {defaultToolTip, TChartToolTipData} from "./Defaults/toolTip";

const DELAY_REDRAW = 50;

export type TChartOptions = {
    AnimationDurationLine: number;
    AnimationDurationPie: number;
    AnimationDurationBar: number;
}

export default class ChartBase<TProps> extends Luff.Content<TProps & TChartCommonProps> {
    Options: TChartOptions & TProps & TChartCommonProps = {} as any;

    protected _locked: boolean;
    protected Listener: any;

    _ToolTipState : IObservableState<TChartToolTipData>;
    Tooltip: any;

    OnAppear(): void {
        this.Redraw();
    }
    Redraw(){}

    private _InitializeLegend() {
        this.props.Legend = {
            ...legend,
            ...this.props.Legend,
        };
    }
    private _InitializeToolTip() {
        this.props.ToolTip = {
            ...defaultToolTip,
            ...this.props.ToolTip
        };
        if (this.props.ToolTip.Visible) {
            this._ToolTipState = Luff.State<TChartToolTipData>({
                TypeID: 0,
                j: 0,
                i: 0,
                ValueX: 0,
                ValueY: 0,
                ValueOriginalY: 0,
                EpisodeSum: 0,
                Color: '',
                Label: '',
                Name: '',
                SvgHeight: 0,
                SvgWidth: 0,
                Left: 0,
                Top: 0,
            })
        };

    }
    private _InitializeAnimation() : void {
        if (this.props.Animation === null) {
            this.props.Animation = {
                Bar: '',
                Line: '',
                Marker: '',
                Pie: '',
                Ring: '',
            };
            return;
        }
        this.props.Animation = {
            ...defaultAnimation,
            ...this.props.Animation,
        };
        if (this.props.Animation.Line) {
            this.Options.AnimationDurationLine = LibraryDOM.GetDurationAnimation(this.props.Animation.Line)
        }
        if (this.props.Animation.Bar) {
            this.Options.AnimationDurationBar = LibraryDOM.GetDurationAnimation(this.props.Animation.Bar)
        }
        if (this.props.Animation.Pie) {
            this.Options.AnimationDurationPie = LibraryDOM.GetDurationAnimation(this.props.Animation.Pie)
        }
    }
    private _InitializeOptions() {
        this.Options = {
            ...this.props,
            ...this.Options,
            // AnimationDurationLine: 0,
            // AnimationDurationBar: 0,
            // AnimationDurationPie: 0,
        }
    }
    protected _InitializeCommon() {
        this._InitializeAnimation();
        this._InitializeLegend();
        this._InitializeToolTip();

        this._InitializeOptions();
    }
}