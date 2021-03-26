import {IContent} from "../Content/IContent";
import {LibraryNumber} from "../../Library/Number";
import {JSXElement, IElement, TRawComponent} from "./IElement";
import {Dict, IObservableStateSimple} from "../../interfaces";
import {TPropsDefault} from "./IElement";
import {State} from "../State";
import {LibraryArray} from "../../Library";
import Application from "../Application/Application";


export interface IElementBase<TProps = any> {

}
const PERMISSION_NAME_WRITE = 'Write';

export class ElementBase<TProps = any, TState = any> implements IElementBase<TProps>, IElement<TProps> {
    props: TProps & TPropsDefault<TState>;
    //real react:
    render() {return null};
    context: any;
    setState() {}
    forceUpdate(){}
    state: any;
    refs: any;
    //---react-end---

    Tag: string; // for Element component (casual html element)
    Name: string;

    DOM: HTMLElement = null;
    _SpecialTargetToRender: HTMLElement;

    _ID: number;
    _RawComponent: TRawComponent;

    ParentElement : IElement = null;
    ParentComponent : IContent = null;
    Children : IElement[] = [];
    _IsShown: boolean = true;
    _IsMount: boolean = false;
    get _IsVisible() : boolean {
        return this._IsShown && this._IsMount;
    }

    HasPermission: boolean = true;

    private _SetProps(props: Dict<any>) : void {
        if (!props)
            props = {};

        const defaultProps = (this.constructor as any).defaultProps;
        if (defaultProps) {
            const keys = Object.getOwnPropertyNames(defaultProps);
            for (let k of keys) {
                if (props[k] === void 0) {
                    props[k] = defaultProps[k];
                }
            }
        }
        this.props = props as (TProps & TPropsDefault);
    }

    _InitializeComponent(props?: TProps): void {};

    Render() : JSXElement {return null};

    Hide(): void {
        this._HideTransitionFunction();
    }
    Show(): void {
        this._ShowTransitionFunction();
    }

    _TargetDOM: Element; //GetTargetDOM cache;
    _TargetRenderComp: IElement;

    GetTargetRenderDOM(): Element {
        //normal comp returns this.DOM
        //fragment returns GetFirstParentDOMElement();

        let papa: IElement = this.ParentElement;
        if (papa._TargetRenderComp) {
            papa = papa._TargetRenderComp;
        }
        if (papa.DOM === this.DOM) {
            //Luff.Content without Fragment
            papa = papa.ParentElement;
        }
        while (papa){
            if (typeof (papa.Tag) !== 'string' && !papa._IsShown) { //if textNode renders to casualElement no return null
                return null;
            }
            if (papa.DOM && papa.DOM instanceof Element && papa.DOM !== this.DOM) {
                this._TargetDOM = papa.DOM;
                this.GetTargetRenderDOM = () => this._TargetDOM;
                return this._TargetDOM;
            }
            papa = papa.ParentElement;
        }
        return Application.RootElement;
    }
    GetClosestNonFragment(): {Children: IElement[], CurrentIndex: number} {
        let c : IElement = this;
        let p = this.ParentElement;
        while (p) {
            if (p.DOM instanceof Element && this.DOM !== p.DOM)
                return {
                    Children: p.Children,
                    CurrentIndex: p.Children.indexOf(c)
                };
            c = p;
            p = p.ParentElement;
        }
        //root component
        return {
            Children: Application.RootComps,
            CurrentIndex: Application.RootComps.indexOf(c)
        }
    }
    FindFirstMount(startIndex: number, children: IElement[]) : IElement {
        if (startIndex >= children.length)
            return void 0;
        for (let i = startIndex; i < children.length; i++){
            let sibling = children[i];
            if (sibling._IsMount && !sibling._SpecialTargetToRender && sibling.DOM !== this.DOM) {

                if (!(sibling.DOM instanceof Element)) {
                    let subSibling = this.FindFirstMount(0, sibling.Children);
                    if (subSibling)
                        return subSibling;
                    continue;
                }
                return sibling;
            }
        }
    }
    GetNextSibling() : Element {
        let c : IElement = this;
        let p = this.ParentElement;

        while (p) {
            if (this.DOM !== p.DOM) { //in case this=CasualComponent, p=Content with Render() { <CasualComponent/> }
                let index = p.Children.indexOf(c);
                let firstMount = this.FindFirstMount(index + 1, p.Children);
                if (firstMount)
                    return firstMount.DOM;
                if (typeof(p.Tag) == 'string') { //CasualComponent (div, span, etc.)//TODO: FIX CRUTCH
                    //if this.DOM actually last child of dom tree;
                    return;
                }
            }
            c = p;
            p = p.ParentElement;
        }
        return;
    }
    GetFirstMountedDOM() : HTMLElement {
        let childElement : IElement = this;
        while (childElement && !(childElement.DOM instanceof Element)) {
            childElement = childElement.Children.find(c => c._IsMount);
        }
        if (childElement)
            return childElement.DOM;
        return void 0;
    }

    _Mount(isFirstMount: boolean = false): void {
        if (!this._IsShown)
            return;
        this._IsMount = true;

        // const parent = this.ParentElement;
        // if (!parent) {
        //     Application.RootElement.appendChild(this.DOM);
        //     return;
        // }
        for (let ch of this.Children) {
            if (ch._IsShown)
                ch._Mount(isFirstMount);
        }

    }

    _Dismount() : void {
        this._IsMount = false;
        for (let ch of this.Children) {
            ch._Dismount();
        }
    }

    _HideTransitionFunction() {
        this._IsShown = false;
        this._Dismount();
        //
        // for (let child of this.Children) {
        //     if ((child as any)._IsDialog)
        //         continue;
        //     // if ((child as any).GroupType)
        //     //     continue;
        //     child._HideTransitionFunction();
        // }
    }
    _ShowTransitionFunction() {
        this._IsShown = true;
        this._Mount();
        // //let groups = [];
        // for (let child of this.Children) {
        //     if (child instanceof Content) {
        //         let content = child as any as Content;
        //         if (content._IsDialog)
        //             continue;
        //         if (content.GroupType/* && !groups.includes(content.GroupType)*/) {
        //             //groups.push(content.GroupType);
        //             //content._ShowTransitionFunction();
        //             // if (this.ParentComponent.Components.AllByName[content.Name]) {
        //             //     content._ShowTransitionFunction();
        //             // }
        //             continue;
        //         }
        //         content._ShowTransitionFunction();
        //     }
        //
        //     child._ShowTransitionFunction();
        // }
    }

    GetFirstParentDOM() : HTMLElement {
        let parentElement : IElement = this.ParentElement;
        while (!parentElement.DOM) {
            parentElement = parentElement.ParentElement;
        }
        return parentElement.DOM;
    }
    GetFirstParentDOMElement() : HTMLElement {
        let parentElement : IElement = this.ParentElement;
        if (!parentElement)
            return Application.RootElement;

        while (!(parentElement.DOM instanceof HTMLElement)) {
            if (!parentElement.ParentElement) {
                //debugger;
                return Application.RootElement;
            }
            parentElement = parentElement.ParentElement;
        }
        return parentElement.DOM;
    }
    GetFirstDOM() : HTMLElement {
        let childElement : IElement = this;
        while (!childElement.DOM) {
            childElement = childElement.Children.find(c => !(c as any)._IsDialog && !(c as any)._CompileNodeValue); //neither dialog nor textNode
        }
        return childElement.DOM;
    }
    GetFirstDOMElement() : HTMLElement {
        let childElement : IElement = this;
        while (!(childElement.DOM instanceof HTMLElement)) {
            childElement = childElement.Children.find(c => !(c as any)._IsDialog && !(c as any)._CompileNodeValue); //neither dialog nor textNode
        }
        return childElement.DOM;
    }

    GetChildrenDomElements() : HTMLElement[] {
        // if (this.DOM instanceof Element)
        //     return [this.DOM];
        let elements : HTMLElement[] = [];
        for (let c of this.Children) {
            if (c.DOM instanceof Element) {
                elements.push(c.DOM);
            }
            else {
                elements.push.apply(elements, c.GetChildrenDomElements());
            }
        }
        return elements;
    }

    _GenerateDOM(): HTMLElement {
        this._GenerateDOM = void 0;
        return null;
    }
    protected OnAppear(){}
    protected OnDisappear(){}

    _Appear() : void {
        //console.info('ElementBase _Appear');
        //todo: optimize onAppear
        this.OnAppear();
        for (let ch of this.Children) {
            if (ch._IsShown)
                ch._Appear();
        }
    }
    _Disappear(): void {
        //todo: optimize OnDisappear
        this.OnDisappear();
        for (let ch of this.Children) {
            if (ch._IsShown)
                ch._Disappear();
        }
    }

    //Refresh():void { }


    protected _IsHiddenByDefault: boolean = false;

    _CompileIsVisible(isVisible: boolean | IObservableStateSimple<boolean>) {
        if (isVisible === void 0 || isVisible === null || !this.HasPermission)
            return;

        if (isVisible instanceof State) {
            let state: State = isVisible as State;
            this._IsHiddenByDefault = !state.SValue;
            this._IsShown = state.SValue;
            state.AddOnChange(isVisible => {
                if (isVisible)
                    this.Show();
                else
                    this.Hide();
            })
        } else {
            this._IsHiddenByDefault = !(isVisible as boolean);
            this._IsShown = isVisible as boolean;
            //this._HideTransitionFunction();
        }
    }
    _RemoveComponent(from?: string) : void {
        this.Render = null;
        this._GenerateDOM = null;
        console.warn('[RemoveComponent] from: ', from, this.Name, this);


        if (this.ParentElement) {
            LibraryArray.Remove(this.ParentElement.Children, x => x === this);
        }
        if (this.ParentComponent) {
            LibraryArray.Remove(this.ParentElement.Children, x => x === this);
        }
        // let keys = Object.keys(this);
        // for (let k of keys) {
        //     delete this[k];
        // }
    }
    constructor(rawComponent?: TRawComponent) {
        this._ID = LibraryNumber.GetID();
        this._RawComponent = rawComponent;
        this.Name = this.constructor.name;

        if (rawComponent) {
            this.ParentElement = rawComponent.ParentElement;
            this.ParentComponent = rawComponent.ParentComponent;
            this.Tag = rawComponent.Tag;

            if (rawComponent.Attributes) {
                const name = rawComponent.Attributes['name'];
                if (name)
                    this.Name = name;
                //register component
                if (this.Name && rawComponent.ParentComponent) {
                    rawComponent.ParentComponent.Components.AllByName[this.Name] = this;
                }

                //PERMISSION
                const permissionName = rawComponent.Attributes['permission'];
                if (permissionName) {
                    const permission = rawComponent.ParentComponent.Permission;
                    this.HasPermission =  permissionName !== PERMISSION_NAME_WRITE ? permission.IsAllowByRule(permissionName) : permission.IsAllowWrite;
                    if (!this.HasPermission)
                        return;
                    //console.log('permissionName', permissionName, hasRule, rawComponent);
                    delete rawComponent.Attributes['permission'];
                }

                this._CompileIsVisible(rawComponent.Attributes['isVisible']);
                delete rawComponent.Attributes['isVisible'];
            }


            this._SetProps(rawComponent.Attributes);
            this.props.children = rawComponent.Children;

        } else {
            this._SetProps( {});
        }
    }
}