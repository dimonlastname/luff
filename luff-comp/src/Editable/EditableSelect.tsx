import Luff, {React, IObservableStateArray, TValueName} from "luff";

import EditableBase from "./EditableBase";
import ComboBox from "../Input/ComboBox/ComboBox";

type TExtraProps<T> = {
    data?: IObservableStateArray<TValueName<T>>;
    dataStatic?: TValueName<T>[];
    isSearchEnabled?: boolean;
}

function delegateView<T>(item: TValueName<T>) : string {
    return item.Name;
}
function delegateValue<T>(item: TValueName<T>) : T {
    return item.Value;
}

export default class EditableSelect<T> extends EditableBase<T, TExtraProps<T>> {

    RenderContent(): Luff.Node {
        if (!this.props.data && !this.props.dataStatic) {
            console.error(`[Luff.Editable] 'EditableSelect' must have 'data' or 'dataStatic' property`);
        }

        return (
            <ComboBox<TValueName<T>, T>
                value={this.ValueTemp}
                data={this.props.data}
                dataStatic={this.props.dataStatic}
                dataDelegateView={delegateView}
                dataDelegateValue={delegateValue}
                isSearchEnabled={this.props.isSearchEnabled}
            />
        )
    }
}