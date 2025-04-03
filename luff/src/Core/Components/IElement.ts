import {IContent} from "../Content/IContent";
import {Dict, IObservableState, IObservableStateSimple} from "../../interfaces";
import {IRenderElement} from "../Compiler/ComponentFactory";

export type TPropsAttributesDefault<TState = {}> = {
    name?: string;
    isVisible?: IObservableStateSimple<boolean> | boolean;
    state?: IObservableStateSimple<TState> | IObservableState<TState>;
    //children?: any; //IRenderElement
    permission?: string;
}
type TPropsChildren = {
    children?: any; //IRenderElement
}
export type TPropsDefault<TState = {}> = TPropsAttributesDefault<TState> & TPropsChildren


export interface JSXElement<P = any> /*extends React.ReactElement<any, any>*/ {
    type?: any;
    props?: P;
    key?: any | null;
}

export interface IElement<P = any> extends JSXElement<P> {
    _ID: number;
    _InnerIndex: number;
    _RawComponent: TRawComponent;

    Tag: string; // for Element component (casual html element)
    Name: string;
    DOM: HTMLElement;

    ParentElement: IElement;
    ParentComponent: IContent;
    Children: IElement[];

    _TargetDOM: Element; //GetTargetDOM cache;
    _TargetRenderComp: IElement;

    HasPermission: boolean;
    _IsShown: boolean;
    _IsMount: boolean;
    readonly _IsVisible: boolean;

    _RenderUpdate(renderNew: IRenderElement): void;
    Render() : any;
    _InitializeComponent(props?: any): void;

    GetTargetRenderDOM() : Element;

    GetFirstDOM() : HTMLElement;
    GetFirstDOMElement() : HTMLElement;
    GetChildrenDomElements() : HTMLElement[];
    GetFirstParentDOM() : HTMLElement;
    GetFirstParentDOMElement() : HTMLElement;
    GetFirstMountedDOM() : HTMLElement;
    _GenerateDOM() : HTMLElement;
    _RemoveComponent(c?:string) : void;
    _Mount(isFirstMount: boolean): void;
    _Dismount(): void;

    GetComponentByName<T extends IElement>(name: string) : T;

    Show(): void;
    Hide(): void;
    _HideTransitionFunction(): void;
    _ShowTransitionFunction(): void;
    _Appear(): void;
    _Disappear(): void;

    _SpecialTargetToRender?: HTMLElement;
}

export type TRawComponent =  {
    InnerIndex?: number;
    Tag?: string;
    Attributes?: Dict<any>;

    Children?: IRenderElement[];
    ParentElement?: IElement;
    ParentComponent?: IContent;
}
