// import Luff, {React, TContentCtor} from "luff";
//
// //import "./FilePicker.scss";
//
// type TFilePickerProps = {
//     class: string;
//     accept: string;
//     onChange: (files: FileList) => {}
//
// }
//
// export default class FilePicker extends Luff.ComponentSimple<TFilePickerProps> {
//     FilePicker: HTMLInputElement;
//     AfterBuild() {
//         this.FilePicker = this.Components.AllByName['l-inputFile'];
//     }
//     Click() {
//         this.FilePicker.click();
//     }
//     OnChange() {
//         this.props.onChange(this.FilePicker.files);
//     }
//     Render(): any {
//         return (
//             <button class={"l-button" + this.props.class} onClick={() => this.Click()}>
//                 <input name="l-inputFile" type="file" style="display: none" accept={this.props.accept} onChange={() => this.OnChange()}/>
//                 {this.props.children}
//             </button>
//         )
//     }
// }