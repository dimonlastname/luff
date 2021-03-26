import Luff, {React, IObservableStateSimple} from "luff";

import EditableBase from "./EditableBase";
import DateBox from "../Input/DateBox";

type TExtraProps = {
    min?: Date | IObservableStateSimple<Date>;
    max?: Date | IObservableStateSimple<Date>;
    format?: string;
    isTimePick?: boolean;
}


export default class EditableDate extends EditableBase<Date, TExtraProps> {
    // static defaultProps = {
    //     getValueView: d => Luff.Date(d).Format(Luff.Culture.Current.DateFormat)
    // };

    private DateBox: DateBox;

    protected AfterBuild(): void {
        super.AfterBuild();
        this.DateBox = this.GetComponentByName('editableTextBox');
    }

    RenderContent(): Luff.Node {

        //return this.props.children;
        return (
            <DateBox
                name="editableTextBox"
                className="l-edit l-edit-editor l-edit-date"
                value={this.ValueTemp}
                min={this.props.min}
                max={this.props.max}
                format={this.props.format}
                isTimePick={this.props.isTimePick}
            />
        )
    }
}