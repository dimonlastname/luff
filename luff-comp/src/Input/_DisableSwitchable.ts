import {IContent, IObservableStateSimple, IObservableStateSimpleOrValue, luffState} from "luff";

export interface IDisableSwitchable<TProps> {
    _IsDisabled: IObservableStateSimple<boolean>;
    props: TProps;
    ParentComponent: IContent;
}
export type TDisableSwitchableProps = {
    disabled?: IObservableStateSimpleOrValue<boolean>;
    isPermissionWriteRequired?: boolean;
}

export function initDisabled(context: IDisableSwitchable<TDisableSwitchableProps>) : void {
    let isWriteAllowed = true;
    if (context.props.isPermissionWriteRequired) {
        isWriteAllowed = context.ParentComponent.Permission.IsAllowWrite;
    }
    let disabledState = context.props.disabled as IObservableStateSimple<boolean>;
    let disabledBoolean = context.props.disabled as boolean;

    if (disabledState && disabledState.SubState) {
        context._IsDisabled = disabledState.SubState(isDisabled => isDisabled || !isWriteAllowed);
    } else {
        context._IsDisabled = luffState(disabledBoolean || !isWriteAllowed);
    }
}