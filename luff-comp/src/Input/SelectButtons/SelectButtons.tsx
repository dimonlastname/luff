import Luff, {Each, IObservableStateArray, IObservableStateSimple, React, TValueName} from "luff";
import RadioButton from "../Radio/Radio";

import "./SelectButtons.scss";


type TProps = {
    value: IObservableStateSimple<number>;
    data: TValueName<number>[] | IObservableStateArray<TValueName<number>>;
    valuesDeprecated?: number[]
    setValue?: (val: number) => void
}

export class SelectButtons extends Luff.ComponentSimple<TProps> {
    Render(): Luff.Node {
        const {data, value, setValue, valuesDeprecated} = this.props;

        const dataArray = data as Array<TValueName<number>>;
        const dataStateArray = data as IObservableStateArray<TValueName<number>>;

        if (Array.isArray(dataArray)) {
            return (
                <div className="l-select-buttons">
                    {
                        dataArray.map(item => {
                            return (
                                <div class="l-sb-holder">
                                    <RadioButton
                                        className="l-select-button-radio"
                                        currentValue={value}
                                        value={item.Value}
                                        onChange={setValue}
                                    >{item.Name}</RadioButton>
                                </div>
                            );
                        })
                    }
                </div>
            )
        }


        return (
            <div className="l-select-buttons">
                <Each
                    source={dataStateArray}
                    render={item => {
                        return (
                            <div class="l-sb-holder">
                                <RadioButton
                                    className="l-select-button-radio"
                                    currentValue={value}
                                    value={item.Value}
                                    onChange={setValue}
                                >{item.Name}</RadioButton>
                            </div>
                        );
                    }}
                />
            </div>
        )
    }
}