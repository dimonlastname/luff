import Luff, {React, ComponentSimple, luffState, TContentCtor, IObservableStateSimple, State} from "luff";

import './TextBox.scss';
import InputBoxBase from "./_InputBoxBase";



type TProps = {
    value: IObservableStateSimple<number>;

    className?: string;
    onChange?: (val?: number) => void;
    onClick?: (e: Luff.MouseEvent<HTMLInputElement>) => void;

    placeholder?: string;
    min?: number | IObservableStateSimple<number>;
    max?: number | IObservableStateSimple<number>;
    isHideInappropriateValue?: boolean;

    onKeyUp?: (e: Luff.KeyboardEvent) => void;
    onKeyEnter?: () => void;
    onKeyEsc?: () => void;
}

type TState<T> = {
    Value: T;
    IsDisabled: boolean;
}

export default class NumBox extends InputBoxBase<TProps> {
    static defaultProps = {
        className: '',
        disabled: false,
        placeholder: '',
        isPermissionWriteRequired: false,
        isHideInappropriateValue: true,
    };
    Render(): any {
        const isHideInappropriateValue = this.props.isHideInappropriateValue;
        const min = this.props.min;
        const max = this.props.max;

        let valueView : any = this.props.value;
        if (isHideInappropriateValue) {
            const isMinState = min instanceof State;
            const isMaxState = max instanceof State;
            const minSt = min as IObservableStateSimple<number>;
            const maxSt = max as IObservableStateSimple<number>;

            let deps = [];
            if (isMinState)
                deps.push(minSt);
            if (isMaxState)
                deps.push(maxSt);

            valueView = this.props.value.SubState(val => (val < min || val > max) ? '' : val, deps);
            //
            // if (isMinState && isMaxState) {
            //     valueView = this.props.value.SubState(val => (val < minSt.SValue || val > maxSt.SValue) ? '' : val, [minSt, maxSt])
            // }
            // else if (isMinState && !isMaxState) {
            //     valueView = this.props.value.SubState(val => (val < min || val > maxSt.SValue) ? '' : val, [maxSt])
            // }
            // else if (!isMinState && isMaxState) {
            //     valueView = this.props.value.SubState(val => (val < minSt.SValue || val > max) ? '' : val, [minSt])
            // }
            // else {
            //     valueView = this.props.value.SubState(val => (val < min || val > max) ? '' : val)
            // }
        }


        let keyUpFn;
        if (this.props.onKeyUp || this.props.onKeyEnter || this.props.onKeyEsc) {
            keyUpFn = e => {
                if (this.props.onKeyUp)
                    this.props.onKeyUp(e);
                if (this.props.onKeyEnter && e.keyCode === 13) {
                    this.props.onKeyEnter();
                }
                if (this.props.onKeyEsc && e.keyCode === 27) {
                    this.props.onKeyEsc();
                }
            }
        }

        return (
            <input type="number"
                   className={"l-textbox " + this.props.className}
                   value={valueView}
                   onChange={e => {
                       let value = parseFloat(e.currentTarget.value);
                       if (this.props.onChange) {
                           return this.props.onChange(value);
                       }
                       this.props.value.SValue = value;
                   }}
                   onKeyUp={keyUpFn}
                   onClick={this.props.onClick}
                   placeholder={this.props.placeholder}
                   min={this.props.min}
                   max={this.props.max}
                   disabled={this._IsDisabled as any}
            />
        )

    }
}
