import {Dict, IObservableState} from "../../interfaces";
import {Each} from "../Components/Each/Each";
import {Route} from "../Application/Route";
import {IElement} from "../Components/IElement";
import {PermissionManager} from "./Permission";
import {ElementBase} from "../Components/ElementBase";

interface IContent<TProps = {}, TState = {}> extends IElement {

    //new (props: TProps): any;
    State: IObservableState<TState>;

    //Ctor(): TContentCtor;

    Render(): any; //TODO Content.Renter return type (IRenderComponent?)

    Toggle(): void;
    Show(isCalledDirectly?: boolean): void;
    Hide(): void;
    _DoShow(): void;
    _DoHide(): void;


    readonly Permission: PermissionManager;

    readonly Components: TContentComponents;
    //ParentElement: IElement;
    //ParentComponent: IContent;

    readonly RouteName: string; //route path like /Main/Orders/Item/Details
    readonly GroupType: string; //content group type, which never show in same time


    _RouteParam: any;
    OnRoute(params: any) : void;
    ShowByRoute() : void;

    readonly HasRoute: boolean;

    _IsShown: boolean;
    _RawContent: TContentCtor;
}
export type TContentComponents = {
    //ComboBox: Dict<ComboBoxComponent>;
    Each: Dict<Each<any>>;

    Element: Dict<IElement>;
    AllByName?: Dict<IElement|IContent>;
}






namespace ContentTypes {
    export type Ctor<T = any> = {
        //Animation?: TContentCtorAnimation;
        Content?: string;
        //Control?: CtorContentControl | CtorContentControl[];

        //ComboBoxConfig?: Dict<ComboBoxConfigType>;
        //ControllerConfig?: Dict<LControllerConfig<any>>;
        //EditableConfig?: Dict<EditableConfigType>;
        CustomConfig?: Dict<any>;
        //EachConfig?: Dict<EachConfigType>;

        Dialog?: Dialog;
        //IsLazyBuild?: boolean;
        IsGlobal?: boolean;
        LoadTarget?: string;
        Name?: string;
        Permission?: Permission;
        //PropTypes?: Dict<PropTypeType>;
        //PropFormat?: CtorContentParamPropFormat;
        State?: T;
        Target?: ElementBase;
        GroupType?: string;
        OnRoute?: Function;
        Route?: Route;



        Visible?: boolean;

        BeforeShow?(): void;
        BeforeHide?(): void;

        Show?(): void;
        Hide?(): void;

        //BeforeBuild?(): void;
        //AfterBuild?(): void;
        Props?(): void;

        //EventListenerDict?: Dict<CBEventListener>

        Children?: any[];

        Debug?: boolean;
        OnOutSideClick?: (e: MouseEvent) => void;
    }

    export type Animation = {
        Show?: string;
        Hide?: string;
    }

    export type Dialog = {
        HasWrapper?: boolean;
        HasWrapperBG?: boolean;
        HasWrapperHandle?: boolean;
        IsHideOnOutsideClick?: boolean,
        WrapperClassCSS?: string;
        //IsInsideParent?: boolean;
        IsGlobal?: boolean;
        OnWrapperClick?: (e: MouseEvent) => void; //TODO: Luff.MouseEvent
        OnOutsideClick?: (e: MouseEvent) => void;
        Animation?: Animation;
    }
    export type Permission = {
        //Attribute?: string;
        Roles?: number[];
        Write?: number[];
        Rules?: Dict<PermissionRule>;
        //Users?: number[];
        Action?: PermissionAction;
        ActionType?: number;
        OnDeny?: () => void;
        IsHideControls?: boolean;
    }
    export type PermissionRule = {
        Roles: number[];
        Write?: number[];
        //Users?: number[];
    }
    // export type PermissionRuleObject ={
    //     [Key: string]: PermissionRule;
    // }
    type PermissionAction = {
        Show?: (Element: HTMLElement) => void;
        Hide?: (Element: HTMLElement) => void;
        Remove?: (Element: HTMLElement) => void;

    }
}
type TContentCtor<T = any> = ContentTypes.Ctor<T>;

export {IContent, ContentTypes, TContentCtor}