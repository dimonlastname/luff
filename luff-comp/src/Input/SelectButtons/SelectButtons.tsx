import Luff, {IObservableStateSimple, React, TIDNamePair} from "luff";
import RadioButton from "../Radio/Radio";

import "./SelectButtons.scss";


type TProps = {
    value: IObservableStateSimple<number>;
    data: TIDNamePair[]
    valuesDeprecated?: number[]
    setValue?: (val: number) => void
}

export class SelectButtons extends Luff.ComponentSimple<TProps> {
    Render(): Luff.Node {
        const {data, value, setValue, valuesDeprecated} = this.props;
        return (
            <div className="l-select-buttons">
                {
                    data.map(item => {
                        return (
                            <div class="l-sb-holder">
                                <RadioButton
                                    className="l-select-button-radio"
                                    currentValue={value}
                                    value={item.ID}
                                    onChange={setValue}
                                >{item.Name}</RadioButton>
                            </div>
                        );
                    })
                }
            </div>
        )
    }
}