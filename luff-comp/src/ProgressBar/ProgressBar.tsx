import {React, ComponentSimple, IObservableStateSimple} from "luff"

import "./ProgressBar.scss";

type TProgressBarProps = {
    percent: IObservableStateSimple<number>;
    caption?: string
}

export class ProgressBar extends ComponentSimple<TProgressBarProps> {
    static defaultProps = {
        percent: 100,
    };
    Render(): any {
        return (
            <div className="l-progress-bar" style={this.props.percent.SubState(percent => `--progress-percent: ${percent}%`)}>
                {
                    this.props.caption
                    &&
                    <div className="l-progress-caption">
                        <div className="l-progress-caption-text">caption</div>
                    </div>
                }
                <div className="l-progress-filler"/>
            </div>
        )
    }
}