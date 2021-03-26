import Luff, {IObservableState, IObservableStateArray, IObservableStateSimple, State, React} from "luff";

import EditableBase, {EditableContent, TEditableProps} from "./EditableBase";

type TExtraProps<T> = {
    value: IObservableState<T>;
    specialRender: (props: TEditableProps<T>, valueTemp: IObservableState<T>, valueView: IObservableStateSimple<string>) => Luff.Node;
}
export default class EditableSpecial<T> extends EditableBase<T, TExtraProps<T>> {


    RenderContent(): Luff.Node {
        return (
            this.props.specialRender(this.props, this.ValueTemp, this.ValueView)
        )
    }
}

export type TEditableSpecialArrProps<T> = {
    value: IObservableStateArray<T>;
    specialRender: (props: TEditableSpecialArrProps<T>, valueTemp: IObservableStateArray<T>, valueView: IObservableStateSimple<string>) => Luff.Node;

    onChange?(value: T[]) : void;
    onClick?(e: Luff.MouseEvent) : void;
    caption?: string;
    disabled?: IObservableStateSimple<boolean>;

    className?: string;
    serverConfirm?: (val: T[]) => Promise<number>;
}
export class EditableSpecialArr<T> extends Luff.Content<TEditableSpecialArrProps<T>> {
    static defaultProps = {
        caption: '',
        className: '',
    };

    protected Mode = Luff.State(-1);
    protected IsBusy = Luff.State(false);
    protected ValueTemp = Luff.StateArr<any>([]);
    //protected ValueView: IObservableStateSimple<string>;

    protected BeforeBuild(): void {
        //this.ValueTemp.SValue = this.props.value.SValue;
        // this.props.value.AddOnChange(v => {
        //     this.ValueView.SValue = this.props.getValueView(v);
        // })
        //this.ValueView = this.props.value.SubState(v => this.props.getValueView(v));
    }

    protected GoToEdit(e: Luff.MouseEvent<HTMLElement>) {
        this.ValueTemp.SValue = this.props.value.SValue;
        this.Mode.SValue = 1;
        //setTimeout(() => this.Mode.SValue = 1); // prevent outside click;
        //if (e.target.classList.contains())
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        e.stopPropagation();
    }
    protected Confirm() {
        this.GoToView();
        let value = this.props.value.SValue;
        let tempValue = this.ValueTemp.SValue;

        if (value != tempValue) {
            if (!this.props.serverConfirm){
                //simple set
                this.props.value.SValue = tempValue;
                return;
            }
            this.IsBusy.SValue = true;
            this.props.serverConfirm(tempValue)
                .then(res => {
                    this.IsBusy.SValue = false;
                    if (res > -1) {
                        this.props.value.SValue = tempValue;
                        return;
                    }
                    throw new Error();
                })
                .catch(() => {
                    this.IsBusy.SValue = false;
                    this.ValueTemp.SValue = value;
                    const st = this.props.value as any as State;
                    console.error(`[Luff.Editable] failed to update property "${st._Property ? st._Property: ''}" to ${tempValue}`);
                })
        }
    }
    protected GoToView() {
        this.Mode.SValue = -1;

    }

    Render() : Luff.Node {
        //this.ValueView = this.props.value.SubState(v => this.props.getValueView(v));

        const children = this.props.children;
        const className = this.Mode.SubState(mode => {
            let classNameList = "l-edit-container " + this.props.className;
            const value = this.props.value.SValue;
            const valueTemp = this.ValueTemp.SValue;
            const isBusy = this.IsBusy.SValue;

            if (mode > 0 && value != valueTemp) {
                classNameList += ' l-edit-changed';
            }
            if (isBusy) {
                classNameList += ' l-busy';
            }
            return classNameList;
        }, [this.props.value, this.ValueTemp, this.IsBusy]);

        const isViewMode = this.Mode.SubState(m => m < 0);
        const isEditMode = this.Mode.SubState(m => m > 0);
        return (
            <div className={className} onDoubleClick={(e) => this.GoToEdit(e)}>
                <div className="l-edit l-edit-value" isVisible={isViewMode}>
                    {children}
                </div>
                <EditableContent Mode={this.Mode} isVisible={isEditMode}>
                    {children}
                    {this.props.specialRender(this.props, this.ValueTemp, null)}
                </EditableContent>
                <div className="l-edit l-edit-controls">
                    <div className="l-edit l-edit-icon l-edit-proto l-edit-btn-edit" title="Изменить" onClick={(e) => this.GoToEdit(e)} />
                    {/*<div className="l-edit l-edit-icon l-edit-controller l-edit-btn-remove" title="Удалить" onClick={remove}/>}*/}
                </div>
            </div>
        )
    }
}
