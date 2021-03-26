import Luff, {React, IObservableStateSimple} from "luff";


export type TEditableMini<T> = {
    serverConfirm?: (val: T) => Promise<number>;

    onChange?(value: T) : void;
    onClick?(e: Luff.MouseEvent, onSubmit: (val: T) => Promise<T>) : void;

    disabled?: IObservableStateSimple<boolean>;
    className?: string;
}

export class EditableMini<T> extends Luff.Content<TEditableMini<T>> {
    static defaultProps = {
        className: ''
    };
    protected IsBusy = Luff.State(false);

    protected GoToEdit(e: Luff.MouseEvent<HTMLElement>) {
        if (this.props.onClick) {
            this.props.onClick(e, (val: T) => this.Confirm(val));
        }
        e.stopPropagation();
    }
    protected Confirm(val: T) : Promise<T> {
        let tempValue = val;

        if (!this.props.serverConfirm){
            return Promise.resolve(tempValue);
        }
        this.IsBusy.SValue = true;
        return this.props.serverConfirm(tempValue)
            .then(res => {
                this.IsBusy.SValue = false;
                if (res > -1) {
                    return tempValue;
                }
                throw new Error();
            })
            .catch(() => {
                this.IsBusy.SValue = false;
                console.error(`[Luff.EditableMini] failed to update`);
                return tempValue;
            })
    }

    Render() : Luff.Node {
        const children = this.props.children;
        const className = this.IsBusy.SubState(isBusy => {
            let classNameList = "l-edit-container " + this.props.className;

            if (isBusy) {
                classNameList += ' l-busy';
            }
            return classNameList;
        });

        return (
            <div className={className} onDoubleClick={(e) => this.GoToEdit(e)}>
                <div className="l-edit l-edit-value">
                    {children}
                </div>
                <div className="l-edit l-edit-controls">
                    <div className="l-edit l-edit-icon l-edit-proto l-edit-btn-edit" title="Изменить" onClick={(e) => this.GoToEdit(e)} />
                </div>
            </div>
        )
    }
}