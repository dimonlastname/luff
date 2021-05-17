import Luff, {React, TContentCtor, IObservableStateSimple} from "luff";

import "./RangeSlider.scss";

type TRangeSelectorProps = {
    value1: IObservableStateSimple<number>;
    value2?: IObservableStateSimple<number>;
    min: number;
    max: number;
    step?: number;

    renderView?: (value: IObservableStateSimple<number>) => Luff.Node;
}

function defaultRenderView(value: IObservableStateSimple<number>)  {
    return value ;
}

export class RangeSlider extends Luff.Content<TRangeSelectorProps> {
    static defaultProps = {
        renderView: defaultRenderView,
        step: 1,
    };
    private ValueView1DOM: HTMLElement;
    private ValueView2DOM: HTMLElement;
    private ValueBodyDOM: HTMLElement;

    protected AfterBuild(): void {
        this.ValueView1DOM = this.GetComponentByName('l-sr-value-view-1').DOM;
        this.ValueView2DOM = this.GetComponentByName('l-sr-value-view-2')?.DOM;
        this.ValueBodyDOM = this.GetComponentByName('l-sr-body').DOM;
    }

    protected OnAppear(): void {
        this.Value1.ForceUpdate();
        this.Value2?.ForceUpdate();
    }

    private Value1: IObservableStateSimple<number>;
    private Value2: IObservableStateSimple<number>;

    private IsActive = false;
    private CurrentValue : IObservableStateSimple<number>;

    private GetClosestValueState(value: number) : IObservableStateSimple<number> {
        if (!this.props.value2)
            return this.props.value1;

        let d1 = Math.abs(this.props.value1.SValue - value);
        let d2 = Math.abs(this.props.value2.SValue - value);
        if (d1 < d2) {
            return this.props.value1;
        }
        return this.props.value2;
    }
    private GetPositionValue(e: Luff.MouseEvent) : number {
        const {min, max, step} = this.props;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.

        const pos = x / e.currentTarget.clientWidth;
        let value = Math.round((max - min) * pos);

        if (step > 1) {
            const deltaStep = (value - min) % step;
            const halfStep = step / 2;
            //console.log('value=', value, 'deltaStep=', deltaStep, 'halfStep=',halfStep);
            if (deltaStep >= halfStep ) {
                value = value + (step - deltaStep);
            } else {
                value = value - deltaStep;
            }
        }

        return value;
    }
    private GetValue1State() : IObservableStateSimple<number> {
        const {min, max} = this.props;

        if (this.props.value2) {
            return this.props.value1.SubState(value1 => {
                const value2 = this.props.value2.SValue;
                const valueRange = (max - min);
                let val = Math.min(value1, value2 - 1);
                return val / valueRange * 100;
            }, [this.props.value2]);
        }
        return this.props.value1.SubState(value1 => {
            return Math.round(value1 / (max - min) * 100 );
        });
    }
    private GetValue2State() : IObservableStateSimple<number> {
        const {min, max} = this.props;

        if (this.props.value2) {
            return this.props.value2.SubState(value2 => {
                const value1 = this.props.value1.SValue;
                let val = Math.max(value2, value1 + 1);
                return (val / max ) * 100;
            },[this.props.value1]);
        }
        return Luff.State(100);
    }


    Render() : Luff.Node {
        const {min, max} = this.props;
        const isSingle = !this.props.value2;

        this.Value1 = this.GetValue1State();
        this.Value2 = this.GetValue2State();

        const width1 = this.Value1.SubState(v => v + '%');
        const width2 = this.Value2.SubState(v => (100 - v) + '%');

        const widthView1 = this.Value1.SubState(v => {
            if (!this.ValueBodyDOM)
                return 0;
            const wBody = this.ValueBodyDOM.getBoundingClientRect().width;
            const wViewHalf = this.ValueView1DOM.getBoundingClientRect().width / 2;
            const offset = (wViewHalf / wBody) * 100;

            return (v - offset) + '%';
        });
        const widthView2 = this.Value2.SubState(v => {
            if (!this.props.value2)
                return 0;
            if (!this.ValueBodyDOM)
                return 0;
            const wBody = this.ValueBodyDOM.getBoundingClientRect().width;
            const wViewHalf = this.ValueView2DOM.getBoundingClientRect().width / 2;
            const offset = (wViewHalf / wBody) * 100;
            return (100 - v - offset) + '%';
        });

        //document.addEventListener('mouseup', () => this.IsActive = false);
        return (
            <div className={"l-slider-range" + (isSingle ? " l-sr-single": "")}>
                <div className="l-sr-head">
                    <div className="l-sr-line-part l-sr-empty" style={{width: widthView1}}/>
                    <div className="l-sr-line-part l-sr-caption" style={{flex: 1}}>
                        <div className="l-sr-value-view" name="l-sr-value-view-1">
                            {this.props.renderView(this.props.value1)}
                        </div>
                        {
                            this.props.value2
                            &&
                            <div className="l-sr-value-view" name="l-sr-value-view-2">
                                {this.props.renderView(this.props.value2)}
                            </div>
                        }
                    </div>
                    <div className="l-sr-line-part l-sr-empty" style={{width: widthView2}}/>
                </div>
                <div
                    name="l-sr-body"
                    className="l-sr-body"
                    onMouseLeave={() => this.IsActive = false}
                    onMouseUp={() => this.IsActive = false}
                    onMouseDown={e => {
                        const value = this.GetPositionValue(e);
                        this.CurrentValue = this.GetClosestValueState(value);
                        this.IsActive = true;

                        if (value < min || value > max)
                            return;

                        this.CurrentValue.SValue = value;
                    }}
                    onMouseMove={e => {
                        if (!this.IsActive)
                            return;

                        const value = this.GetPositionValue(e);
                        if (value < min || value > max)
                            return;

                        if (this.props.value2) {
                            if (this.CurrentValue === this.props.value1 && value >= this.props.value2.SValue) {
                                this.props.value1.SValue = this.props.value2.SValue;
                                this.CurrentValue = this.props.value2;
                            }
                            if (this.CurrentValue === this.props.value2 && value <= this.props.value1.SValue) {
                                this.props.value2.SValue = this.props.value1.SValue;
                                this.CurrentValue = this.props.value1;
                            }
                        }

                        this.CurrentValue.SValue = value;

                    }}
                >
                    <div className="l-sr-line">
                        <div className="l-sr-line-part l-sr-line-left l-sr-empty" style={{width: width1}}/>
                        <div className="l-sr-hook l-sr-hook-1">
                            <div className="l-sr-pin"/>
                        </div>
                        {
                            this.props.value2
                            &&
                            <>
                                <div className="l-sr-line-part l-sr-fill"  style={{flex: 1}}/>
                                <div className="l-sr-hook l-sr-hook-1">
                                    <div className="l-sr-pin"/>
                                </div>
                                <div className="l-sr-line-part l-sr-empty" style={{width: width2}}/>
                            </>
                        }
                    </div>
                </div>

            </div>
        )
    }
}