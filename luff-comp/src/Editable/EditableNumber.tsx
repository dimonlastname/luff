import Luff, {React,IObservableStateSimple} from "luff";

import EditableBase from "./EditableBase";
import TextBox from "../Input/TextBox";
import NumBox from "../Input/NumBox";

type TExtraProps = {
    min?: number | IObservableStateSimple<number>;
    max?: number | IObservableStateSimple<number>;
}


export default class EditableNumber extends EditableBase<number, TExtraProps> {
    private TextBox: TextBox;

    protected AfterBuild(): void {
        super.AfterBuild();
        this.TextBox = this.GetComponentByName('editableTextBox');
    }

    protected GoToEdit(e) {
        super.GoToEdit(e);
        this.TextBox.Focus();
        this.TextBox.Select();
    }

    RenderContent(): Luff.Node {
        return (
            <NumBox
                name="editableTextBox"
                className="l-edit l-edit-editor l-edit-textbox"
                value={this.ValueTemp}
                onKeyEnter={() => this.Confirm()}
                onKeyEsc={() => this.GoToView()}
                min={this.props.min}
                max={this.props.max}
            />
        )
    }
}