import Luff, {React, TContentCtor, IObservableStateSimple, State, JSXElement} from "luff";

import "./Editable.scss";

type TEditableState = {}
export type TEditableProps<T> = {
    value: IObservableStateSimple<T>;
    getValueView?(value: T) : string;
    onChange?(value: T) : void;
    caption?: string;
    disabled?: IObservableStateSimple<boolean>;

    className?: string;
    serverConfirm?: (val: T) => Promise<number>;
}
type TEdContent = {
    Mode: IObservableStateSimple<number>;
}

export class EditableContent extends Luff.Content<TEdContent> {
    Render(): JSXElement {
        return (
            this.props.children
            &&
            <div className="l-edit-container-content">
                {this.props.children}
            </div>
        );
    }
    protected Ctor(): TContentCtor {
        return {
            OnOutSideClick: e => {
                if (Luff.DOM.Closest(e.target as any, '.l-period_picker')) {
                    return;
                }
                // if (e.target.classList.contains('l-edit-btn-edit'))
                //     return;
                if (this.props.Mode.SValue > 0) {
                    //console.info('OnOutSideClick', e);
                    this.props.Mode.SValue = -1;
                }
            }
        }
    }
}

export default class EditableBase<T, ExtraProps = {}> extends Luff.Content<TEditableProps<T> & ExtraProps, TEditableState> {
    static defaultProps = {
        caption: '',
        getValueView: v => String(v),
        className: '',
    };

    protected Mode = Luff.State(-1);
    protected IsBusy = Luff.State(false);
    protected ValueTemp = Luff.State<any>('default');
    protected ValueView: IObservableStateSimple<string>;

    protected BeforeBuild(): void {
        //this.ValueTemp.SValue = this.props.value.SValue;
        // this.props.value.AddOnChange(v => {
        //     this.ValueView.SValue = this.props.getValueView(v);
        // })
        this.ValueView = this.props.value.SubState(v => this.props.getValueView(v));
    }

    protected GoToEdit(e: Luff.MouseEvent<HTMLElement>) {
        this.ValueTemp.SValue = this.props.value.SValue;
        this.Mode.SValue = 1;
        //setTimeout(() => this.Mode.SValue = 1); // prevent outside click;
        //if (e.target.classList.contains())
        e.stopPropagation();
    }
    private SetOriginalValue(newValue: T) {
        if (this.props.onChange) {
            this.props.onChange(newValue);
            return;
        }
        this.props.value.SValue = newValue;
    }
    protected Confirm() {
        this.GoToView();
        let value = this.props.value.SValue;
        let tempValue = this.ValueTemp.SValue;

        if (value != tempValue) {
            if (!this.props.serverConfirm){
                //simple set
                this.SetOriginalValue(tempValue);
                return;
            }
            this.IsBusy.SValue = true;
            this.props.serverConfirm(tempValue)
                .then(res => {
                    this.IsBusy.SValue = false;
                    if (res > -1) {
                        this.SetOriginalValue(tempValue);
                        return;
                    }
                    throw new Error();
                })
                .catch(() => {
                    this.IsBusy.SValue = false;
                    this.ValueTemp.SValue = value;
                    const st = this.props.value as State;
                    console.error(`[Luff.Editable] failed to update property "${st._Property ? st._Property: ''}" to ${tempValue}`);
                })
        }
    }
    protected GoToView() {
        this.Mode.SValue = -1;
    }


    RenderContent(): Luff.Node {
        return null;
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


        const isViewMode = this.Mode.SubState(m => m < 0); //todo: support disabled property;
        const isEditMode = this.Mode.SubState(m => m > 0);

        let isControlsVisible = isViewMode;
        if (this.props.disabled) {
            isControlsVisible = this.props.disabled.SubState(isDisabled => {
                if (this.Mode.SValue > 0)
                    return false;
                return !isDisabled;
            }, [this.Mode]);
        }

        return (
            <div className={className} /*onDoubleClick={(e) => this.GoToEdit(e)}*/>
                {/*<div className="l-edit l-edit-value">*/}
                {/*{!!children && children}*/}
                {/*{!children && this.ValueView}*/}
                {/*</div>*/}
                <div className="l-edit l-edit-value" isVisible={isViewMode}>
                    {(!children || children.length === 0) && this.ValueView}
                    {!!children && children}
                </div>

                <EditableContent Mode={this.Mode} isVisible={isEditMode}>
                    {this.RenderContent()}
                    <div className="l-edit l-edit-controls">
                        <div className="l-edit l-edit-icon l-edit-proto l-edit-btn-save" title="Применить" onClick={(e) => {
                            this.Confirm();
                            e.stopPropagation();
                        }}/>
                    </div>
                </EditableContent>

                <div className="l-edit l-edit-controls" isVisible={isControlsVisible}>
                    <div className="l-edit l-edit-icon l-edit-proto l-edit-btn-edit" title="Изменить" onClick={(e) => this.GoToEdit(e)}/>
                    {/*<div className="l-edit l-edit-icon l-edit-controller l-edit-btn-remove" title="Удалить" onClick={remove}/>}*/}
                </div>
            </div>
        )
    }
}

/*
<div className="l-editable-with-box">
                <div className="l-edit l-edit-value" name="l-editable-with-box-value">{this.ValueView}</div>
                <div className="l-edit l-edit-controls">
                    <div className="l-edit l-edit-icon l-edit-proto l-edit-btn-edit" title="Изменить" onClick={() => this.CallEditor()} />
                </div>
                {this.RenderContent()}
            </div>
*/