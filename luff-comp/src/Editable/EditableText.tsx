import Luff, {IObservableOrValue, React, IObservableStateSimple} from "luff";

import EditableBase from "./EditableBase";
import TextBox, {TInputMask} from "../Input/TextBox";


export default class EditableText extends EditableBase<string, {mask?: IObservableOrValue<TInputMask>;}> {
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
            <TextBox
                name="editableTextBox"
                className="l-edit l-edit-editor l-edit-textbox"
                value={this.ValueTemp as IObservableStateSimple<string>}
                onKeyEnter={() => this.Confirm()}
                onKeyEsc={() => this.GoToView()}
                mask={this.props.mask}
            />
        )
    }
}