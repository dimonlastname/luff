import {ContentTypes, IContent, TContentComponents, TContentCtor} from "./IContent";
import {IObservableState, IObservableStateArray, IObservableStateSimple, IShowHideable} from "../../interfaces";
import {DialogTools} from "./Dialog/DialogManager";
import {outsideClickManager, TListener} from "./Dialog/DOM.OutsideClick";
import AppRouter, {Route, Router} from "../Application/Route";
import {ElementBase} from "../Components/ElementBase";
import {IElement, TPropsDefault, TRawComponent, JSXElement} from "../Components/IElement";
import {ComponentFactory, IRenderElement} from "../Compiler/ComponentFactory";
import {luffState} from "../State";
import {LuffLoadNative} from "../../System/Load/LoadNative";
import {LuffContentUserPermission, appUserPermission, PermissionManager} from "./Permission";
import {LibraryCSS} from "../../Library/CSS";
import {CasualFragmentComponent} from "../Components/CasualFragmentComponent";



function getParentContent(ctx: IElement) : Content {
    let p : IElement = ctx.ParentElement;
    //let fullName = ctx.Name;
    while (p){
        //console.log('[getRouteName] ', ctx.Name, p);
        if (p instanceof Content) {
            return p;
        }
        p = p.ParentElement;
    }
    return null;
}

function getRouteName(ctx: Content) : string {
    let p = ctx.ParentComponent;
    let fullName = ctx.Name;
    while (p){
        if (p instanceof Content) {
            fullName = p.Name +'/'+fullName;
        }
        p = p.ParentComponent;
    }
    return fullName;
}




class Content<TProps = {}, TState = {}> extends ElementBase<TProps, TState> implements IContent<TProps, TState> {
    static AppRouter: Router = AppRouter;
    static Load = LuffLoadNative;
    static Permission: LuffContentUserPermission = appUserPermission;

    static OutsideChecks : TListener[] = [];

    static defaultProps : any;

    static AddStateSubscription(state: IObservableState<any>, content: IContent, callBack: () => void) : void {
        const ctx = content as any;

        const appear = ctx.OnAppear.bind(ctx);
        const disappear = ctx.OnDisappear.bind(ctx);

        ctx.OnAppear = function() {
            appear();
            //console.log(content.Name + ' appear');
            state.AddOnChange(callBack);
        }.bind(ctx);
        ctx.OnDisappear = function() {
            disappear();
            //console.log(content.Name + ' disappear');
            state.RemoveOnChange(callBack);
        }.bind(ctx);
    }
    private AddStateSubscription(state: IObservableState<any>, callBack: () => void) : void {
        Content.AddStateSubscription(state, this, callBack);
    }

    ParentComponent: Content;


    get IsVisible() : boolean {
        let p : IElement = this;
        while (p) {
            if (!p._IsShown)
                return false;
            p = p.ParentElement;
        }
        return true;
    }
    //static OutsideClickManager = outsideClickManager;
    ////
    _OutsideClickListener : TListener;
    _OutsideClickListenerID: number;
    ////

    _IsDialog: boolean = false;

    _ChildrenContent: Content[] = [];
    protected Ctor(): TContentCtor { return <TContentCtor>{};}


    Render() : JSXElement {return null};
    public RenderForce(): void {
        this._RenderUpdate(null);
    }
    public _RenderUpdate(render): void {
        console.log(`[Luff.Content] _RenderUpdate, `, this.Name);
        if (!render)
            render = this.RenderSafe();

        if (typeof render.Tag == "string") {
            this.Children[0]._RenderUpdate(render);
            return;
        }

        if (this instanceof render.Tag) {
            this.Children[0]._RenderUpdate(this.RenderSafe());
            return;
        }
        if (render.Tag == CasualFragmentComponent){
            this.Children[0]._RenderUpdate(render);
            return;
        }
        for (let i = 0; i < render.Children.length; i++) {
            let renderNewChild = render.Children[i];
            this.Children[i]._RenderUpdate(renderNewChild);
        }
        this.Children[0]._RenderUpdate(render);
        //this.Children[0]._RenderUpdate(render.Children[0]);
    }

    protected BeforeShow() : void {}
    protected BeforeHide() : void {}
    protected AfterShow() : void {}
    protected AfterHide() : void {}
    protected BeforeBuild() : void {}
    protected AfterBuild() : void {}


    /* #REGION #SHOW */
    public Show(isCalledDirectly: boolean = true) : void {
        //console.log('[Content.Show]', isCalledDirectly, this.RouteName, this);
        this._HideSameGroupTypeContents();
        const ctx = this._GetEndContentToShow(); //find last grouped child to show
        const isChildWillBeShown = this !== ctx;
        if (!isChildWillBeShown) {
            this._ShowCheckRoute(isCalledDirectly);
        }
        if (isChildWillBeShown) {
            ctx.Show();
        }
        this._DoShow();
    }
    _GetEndContentToShow() : IContent {
        let firstChild : Content = this._ChildrenContent.find(child => child._IsShown && child._Route && child._Route.IsRoutingEnabled);
        if (firstChild) {
            firstChild._DoShow();
            return firstChild._GetEndContentToShow();
        }

        for (let child of this._ChildrenContent) {
            if (/*child.GroupType && */child._Route && child._Route.IsRoutingEnabled /*&& !child._IsDialog*/ ) {
                if (!firstChild)
                    firstChild = child;
                if (child._IsShown)
                    return child._GetEndContentToShow();
            }
        }
        if (firstChild)
            return firstChild._GetEndContentToShow();
        return this;
    }
    _HideSameGroupTypeContents() : void {
        if (this.GroupType !== void 0) {
            const others = AppRouter.ContentsByGroupType[this.GroupType];
            for (let item of others) {
                if (item !== this /*&& item._isActive*/ && item.ParentComponent === this.ParentComponent) //do not hide itself or same groupType but different parent
                    item.Hide();
            }
        }
    }
    _ShowCheckRoute(isCalledDirectly: boolean) : void {
        if (this._Route) {
            //this._Route.SetLinksActive(true);
            if (this._Route.IsRoutingEnabled && isCalledDirectly) {
                AppRouter.TryPush(this);
            }
        }
    }
    _IsShowingParentRequired() : boolean {
        if (!this.ParentComponent)
            return false;
        return !(this._RawContent.Dialog && this._RawContent.Dialog.IsGlobal);

    }
    _GetFirstNotShownParent() : Content {
        let p = this.ParentComponent;
        while (p) {
            if (!p._IsShown)
                return p;
            p = p.ParentComponent;
        }
        return void 0;
    }
    _LazyCheck() {
        console.warn("[_LazyCheck] " + this.Name);

        if (!this._GenerateDOM) // done already
            return;

        this._InitializeComponent();
        if (!this.HasPermission)
            return;
        this._GenerateDOM();
        this._Mount(true);
    }
    _DoShow() {
        if (this._IsShowingParentRequired()) {
            const closestParentToShow = this._GetFirstNotShownParent();
            if (closestParentToShow) {
                closestParentToShow._HideSameGroupTypeContents();
                closestParentToShow._DoShow();
            }
            // if (!this.ParentComponent._IsShown) {
            //     this.ParentComponent._HideSameGroupTypeContents();
            //     this.ParentComponent._DoShow();
            // }

            if (!this.ParentComponent._IsMount) {
                this.ParentComponent._DoShowAsync();
            }
        }
        // if (this._IsShowingParentRequired() && (!this.ParentComponent._IsMount || !this.ParentComponent._IsShown)) {
        //     //this.Parent._BeforeShow();
        //     this.ParentComponent._HideSameGroupTypeContents();
        //     this.ParentComponent._DoShow();
        //     //this.Parent._MakeVisible();
        //     //this.Parent.AfterShow();
        // }
        if (this._Route)
            this._Route.SetLinksActive(true);
        if (this._IsShown && this._IsMount)
            return;
        this._IsShown = true;

        this.BeforeShow();
        this._DoShowAsync();
        this._Appear();
        //setTimeout(() => this._Appear(), 1);
        this.AfterShow();
    }
    _HideTransitionFunction() {
        super._HideTransitionFunction();
        // if (this._OutsideClickListener) {
        //     outsideClickManager.Remove(this._OutsideClickListenerID);
        // }
    }

    _ShowTransitionFunction() {
        super._ShowTransitionFunction();
        // if (this._OutsideClickListener) {
        //     this._OutsideClickListenerID = outsideClickManager.Add(this.DOM, this._OutsideClickListener);
        // }
    }

    _DoShowAsync() : void {
        this._ShowTransitionFunction();
        // ToggleTimer = Luff.AsyncToggle(
        //     this,
        //     event,
        //     this.Content,
        //     ()=>{
        //         if (!CalledByChild){
        //             this._BeforeShow.call(this, event);
        //         }
        //         this._Shower.call(this);
        //     },
        //     CalledByChild ? ()=>{this._isPending=false; this._isActive=true;} : (e)=>{this._isPending=false; this._isActive=true; Show.call(this, e)},
        //     this.Settings.Animation.Hide,
        //     this.Settings.Animation.Show,
        //     this.Settings.Animation._DurationShow,
        //     this.Settings.Animation._DurationShow,
        //     ToggleTimer
        // );
    }

    ShowByRoute() : void {
        this._Route.SetLinksActive(true);
        this._HideSameGroupTypeContents();
        this._DoShow();
    }
    /* #END REGION #SHOW */



    //##################################
    /* #REGION #HIDE */
    _HideCheckRoute() : void {
        if (this._Route) {
            this._Route.SetLinksActive(false);
            if (this._Route.IsRoutingEnabled && this._RawContent.Dialog) {
                AppRouter.Back(this);
            }
            // this._Route.SetLinksActive(true);
            // AppRouter.TryPush(this);
        }
    }
    Hide() {
        //console.log('[Content.Hide]', this);
        this._HideCheckRoute();
        this._DoHide();
    }
    _DoHide() : void {
        if (!this._IsShown)
            return;
        this.BeforeHide();
        this._Disappear();
        this._HideTransitionFunction();
        this.AfterHide();
    }
    // _HideTransitionFunction() {
    //     console.log(`_HideTransitionFunction`, this.Name);
    //     this._IsShown = false;
    //     for (let child of this.Children) {
    //         child._HideTransitionFunction();
    //     }
    //
    //     // if (this.DOM.style)
    //     //     this.DOM.style.display = 'none';
    // }
    /* #END REGION #HIDE */

    Toggle() : void {
        if (this._IsShown)
            return this.Hide();
        return this.Show();
    }
    _SubscribeOutsideClickListener() {
        if (this._OutsideClickListener && !this._IsDialog) {
            // if (!(this.DOM instanceof DocumentFragment)) {
            //     this._OutsideClickListenerID = outsideClickManager.Add(this.DOM, this._OutsideClickListener);
            // }
            // else {
            //
            // }
            this._OutsideClickListenerID = outsideClickManager.Add(this.DOM, this._OutsideClickListener);

        }
    }
    _UnsubscribeOutsideClickListener() {
        if (this._OutsideClickListener && !this._IsDialog) {
            outsideClickManager.Remove(this._OutsideClickListenerID);
        }
    }

    _Appear() : void {
        this._SubscribeOutsideClickListener();


        //
        //TODO: use IntersectionObserver
        // if (this._IsShown)
        this.OnAppear();
        for (let ch of this._ChildrenContent) {
            if (ch._IsShown)
                ch._Appear();
        }
    }
    _Disappear() : void {
        this._UnsubscribeOutsideClickListener();

        // if (this._IsShown)
        this.OnDisappear();
        for (let ch of this._ChildrenContent) {
            ch._Disappear();
        }
    }
    protected OnAppear() : void {
        //console.log('[Content] Appear', this.Name);
    }
    protected OnDisappear() : void {
        //console.log('[Content] Disappear', this.Name);
    }

    _Route: Route;
    _RouteParam: any;
    _RawContent: TContentCtor;
    get HasRoute() {
        return this._Route !== void 0 && this._Route !== null;
    }



    RouteName: string;
    GroupType: string;

    State: IObservableState<TState>;

    get Permission() {
        return this._Permission;
    }
    _Permission : PermissionManager = null;



    Components: TContentComponents = {
        //ComboBox: {},
        Each: {},

        Element: {},
        AllByName: {},
    };
    GetComponentByName<T extends IElement>(name: string) : T {
        let comp = this.Components.AllByName[name];
        if (comp)
            return comp as T;

        for (let child of this._ChildrenContent) {
            comp = child.GetComponentByName(name);
            if (comp) {
                return comp as T;
            }
            // if (child instanceof Content){
            //     comp = child.GetComponentByName(name);
            //     if (comp) {
            //         return comp as T;
            //     }
            // }
        }
    }

    public ResetDialogAnimationShow(animationClassName: string) : void {
        if (this._IsShown) {
            this.DOM.classList.remove(this._RawContent.Dialog.Animation.Show);
            this.DOM.classList.add(animationClassName);
        }
        this._RawContent.Dialog.Animation.Show = animationClassName;
    }

    Load: LuffLoadNative;

    // _MakeNoWrap(dialogParams: ContentTypes.Dialog) {
    //     let mount = this.Mount.bind(this);
    //     let dismount = this.Dismount.bind(this);
    //     const dom = this.DOM;
    //     if (dialogParams.IsGlobal) {
    //         mount = () => {
    //             this._IsMount = true;
    //             DialogTools.Container.appendChild(dom);
    //         };
    //     }
    //     let isLocked = false;
    //     this.Mount = (isFirstMount) => {
    //         if (isLocked)
    //             return;
    //         if (isAnimateHide)
    //             dom.classList.remove(dialogParams.Animation.Hide);
    //         if (isAnimateShow)
    //             dom.classList.add(dialogParams.Animation.Show);
    //         mount(isFirstMount);
    //         if (dialogParams.OnOutsideClick) //FIXME crutch
    //             setTimeout(() => this._OutsideClickListenerID = outsideClickManager.Add(dom, this._OutsideClickListener), 0);
    //     };
    //     this.Dismount = () => {
    //         if (isLocked)
    //             return;
    //
    //         if (isAnimateShow)
    //             dom.classList.remove(dialogParams.Animation.Show);
    //         if (isAnimateHide) {
    //             dom.classList.add(dialogParams.Animation.Hide);
    //             window.clearTimeout(timeoutHide);
    //             isLocked = true;
    //             timeoutHide = window.setTimeout(() => {
    //                 dismount();
    //                 isLocked = false;
    //                 //wrapped.style.display = 'none';
    //             }, animationDurationHide);
    //         }
    //         else {
    //             dismount();
    //         }
    //         if (dialogParams.OnOutsideClick) {
    //             outsideClickManager.Remove(this._OutsideClickListenerID);
    //         }
    //     };
    //     return this.DOM;
    // }
    _MakeContentDialog() : HTMLElement {
        this._IsDialog = true;
        this._IsShown = false;

        this._RawContent.Dialog = DialogTools.GetDialogParams(this._RawContent.Dialog, this);
        let dialogParams = this._RawContent.Dialog;

        let timeoutHide: number;
        const isAnimateShow = dialogParams.Animation !== null && dialogParams.Animation && dialogParams.Animation.Show;
        const isAnimateHide = dialogParams.Animation !== null && dialogParams.Animation && dialogParams.Animation.Hide;
        let animationDurationShow = 0;
        let animationDurationHide = 0;

        if (isAnimateShow)
            animationDurationShow = LibraryCSS.GetDurationAnimation(dialogParams.Animation.Show);
        if (isAnimateHide)
            animationDurationHide = LibraryCSS.GetDurationAnimation(dialogParams.Animation.Hide);

        if (dialogParams.IsHideOnOutsideClick && !dialogParams.OnOutsideClick) {
            this._OutsideClickListener = () => this.Hide();
        }
        if (dialogParams.OnOutsideClick) {
            this._OutsideClickListener = dialogParams.OnOutsideClick.bind(this);
        }
        if (dialogParams.IsGlobal) {
            this._SpecialTargetToRender = DialogTools.Container;
        }

        let isLocked = false;

        const dialogWrap = DialogTools.GetDialogWrap(dialogParams, this);
        const wrapper = dialogWrap.Element;



        let doMount = () => {
            this._IsMount = true;
            this.GetTargetRenderDOM().appendChild(wrapper);
        };
        let doDismount = () => {
            this._IsMount = false;
            wrapper.remove();
        };

        if (dialogParams.IsGlobal) {
            doMount = () => {
                DialogTools.Container.appendChild(wrapper);
            };
        }
        this._Mount = () => {




            if (!this._IsShown)
                return;

            //cancel hiding
            if (isAnimateHide) {
                dialogWrap.ElementAnimate.classList.remove(dialogParams.Animation.Hide);
                window.clearTimeout(timeoutHide);
                isLocked = false;
            }



            this._IsMount = true;
            if (isLocked)
                return;
            if (dialogWrap.WrapperBG)
                wrapper.appendChild(dialogWrap.WrapperBG);

            if (isAnimateHide)
                dialogWrap.ElementAnimate.classList.remove(dialogParams.Animation.Hide);
            if (isAnimateShow)
                dialogWrap.ElementAnimate.classList.add(dialogParams.Animation.Show);
            doMount();
            if (this._OutsideClickListener) { //FIXME crutch
                setTimeout(() => this._OutsideClickListenerID = outsideClickManager.Add(wrapper, this._OutsideClickListener), 0);
                //this._OutsideClickListenerID = outsideClickManager.Add(wrapper, this._OutsideClickListener);
            }

        };
        this._Dismount = () => {
            if (isLocked)
                return;
            if (dialogWrap.WrapperBG)
                dialogWrap.WrapperBG.remove();

            if (isAnimateShow)
                dialogWrap.ElementAnimate.classList.remove(dialogParams.Animation.Show);
            if (isAnimateHide) {
                dialogWrap.ElementAnimate.classList.add(dialogParams.Animation.Hide);
                window.clearTimeout(timeoutHide);
                isLocked = true;
                timeoutHide = window.setTimeout(() => {
                    doDismount();
                    isLocked = false;
                    //wrapped.style.display = 'none';
                }, animationDurationHide);
            }
            else {
                doDismount();
            }
            if (this._OutsideClickListener) {
                outsideClickManager.Remove(this._OutsideClickListenerID);
            }
        };
        return this.DOM;
        //***************************************************************
        //***************************************************************
        //***************************************************************
        //***************************************************************

        // if (dialogParams.IsHideOnOutsideClick && !dialogParams.OnOutsideClick){
        //     if (!dialogParams.OnOutsideClick) {
        //         dialogParams.OnOutsideClick = () => this.Hide();
        //     }
        //
        // }
        // if (dialogParams.IsGlobal) {
        //     this._SpecialTargetToRender = DialogTools.Container;
        // }
        //
        // const dialogWrapped = DialogTools.WrapDialog(dialogParams, this);
        //
        // //console.log('dialogParams of ' + this.Name, dialogParams, dialogWrapped);
        //
        // this._BeforeShowDialog = dialogWrapped.BeforeShowDialog;
        // this._BeforeHideDialog = dialogWrapped.HideDialog;
        // if (dialogParams.OnOutsideClick){
        //     this._OutsideClickListener = dialogParams.OnOutsideClick.bind(this);
        // }
        // this._IsShown = false;
        // this._ShowTransitionFunction = () => {
        //     this._IsShown = true;
        //     // if (this._SpecialTargetToRender)
        //     //     this._SpecialTargetToRender.appendChild(this.DOM); //move to upper layer
        //     if (dialogParams.IsGlobal) {
        //         this._SpecialTargetToRender.appendChild(this.DOM); //move to upper layer
        //     } else {
        //         this.GetTargetRenderDOM().appendChild(this.DOM);
        //     }
        //     this._IsMount = true;
        //     //DialogTools.Container.appendChild(this.DOM);
        //     dialogWrapped.BeforeShowDialog();
        //     if (dialogParams.OnOutsideClick) //FIXME crutch
        //         setTimeout(() => this._OutsideClickListenerID = outsideClickManager.Add(this.DOM, this._OutsideClickListener), 0);
        // };
        // this._HideTransitionFunction = () => {
        //     this._IsShown = false;
        //     this._IsMount = false;
        //     dialogWrapped.HideDialog();
        //     if (dialogParams.OnOutsideClick) {
        //         outsideClickManager.Remove(this._OutsideClickListenerID);
        //     }
        //
        //     //this.DOM.remove();
        // };
        // return dialogWrapped.HtmlElement;
    }
    // _MakeContentDialog2() : void {
    //     const dialogParams = this._RawContent.Dialog;
    //     const dialogWrap : IRenderElement = {
    //         Tag: 'div',
    //         Attributes: {
    //             className: 'l-dialog-wrapper',
    //         },
    //         Children: [
    //             {
    //                 Tag: 'div',
    //                 Attributes:{
    //                     className: 'l-dialog-wrapper-bg',
    //                     onClick: dialogParams.OnWrapperClick
    //                 },
    //                 Children: []
    //             },
    //             {
    //                 Tag: 'div',
    //                 Attributes: {
    //                     className: 'l-dialog-wrapper-content'
    //                 },
    //                 Children: this.props.children,
    //             }
    //         ]
    //
    //     };
    //     if (dialogParams.HasWrapperBG) {
    //         dialogWrap.Children.push({Tag: 'div', Attributes: {className: 'l-dialog-wrapper-bg'}})
    //     }
    //
    //
    // }
    _BeforeShowDialog: () => void;
    _BeforeHideDialog: () => void;



    // get _IsRoutable() : boolean {
    //     return this._Route && this._Route.IsRoutingEnabled;
    // }

    _TempRender: IRenderElement;
    _GenerateDOM() : HTMLElement {
        super._GenerateDOM();
        if (!this.Render) {
            //no permission, component deleted;
            console.error('[Content] GenerateDOM', this);
            return;
        }


        this.BeforeBuild();
        this._TempRender = this.RenderSafe() as any as IRenderElement;
        this._BeforeGenerateDOM();

        let built = ComponentFactory.Build(this._TempRender, this, this);
        delete this._TempRender;

        if (!built)
            return;

        if (this._RawContent.GroupType && (!this._RawContent.Visible || !this.ParentComponent) /*&& AppRouter.ContentsByGroupType[this._RawContent.GroupType][0] !== this*/) {
            this._IsShown = false;
        }
        else if (this._RawContent.GroupType && this._Route && AppRouter.ContentsByGroupType[this._RawContent.GroupType][0] === this) {
            this._Route.SetLinksActive(true);
        }
        if (this._IsHiddenByDefault)
            this._IsShown = false;

        this.Children = [built];
        this.DOM = built._GenerateDOM();
        this._AfterGenerateDOM();

        //let dom = this.DOM;
        if (this._RawContent.Dialog) {
            this.DOM = this._MakeContentDialog();
            this.AfterBuild();
            return this.DOM;
        }

        this.AfterBuild();
        // if (this._IsShown)
        //     built._Mount(true);
        return this.DOM;
    }




    OnRoutePath(params: any) : void {
        //slkv';sdkv';s
        this.Show();
    }


    OnRoute(params: any) : void {
        this.Show();
    }
    SetRouteParam(params: any) : void {
        this._RouteParam = params;
    }


    _Refresh(){

    }

    private _BeforeGenerateDOM() : void {

    }
    private _AfterGenerateDOM() : void {
        const ctor = this._RawContent;
        if (ctor.LoadTarget !== void 0) {
            if (ctor.LoadTarget === '') {
                //render to main element
                let target = this.DOM;
                if (!target || target instanceof DocumentFragment) {
                    target = this.GetFirstParentDOMElement();
                }
                this.Load = new LuffLoadNative({
                    Target: target,
                });
            }
            else {
                //render to named component
                this.Load = new LuffLoadNative({
                    Target: this.GetComponentByName(ctor.LoadTarget).GetFirstDOM(),
                });
            }
        }
    }
    private _InitCtor() : void {
        let ctor = this.Ctor();
        this._RawContent = ctor;
        this.Name = ctor.Name ? ctor.Name : this.Name;
        this.RouteName = getRouteName(this);
        this.GroupType = ctor.GroupType;

        if (ctor.Route) {
            this._Route = ctor.Route;
            ctor.Route.SetContent(this);
        }
        if (ctor.Target) {
            console.warn('[Luff.Content] "ctor.Target" is experimental property');
        }

        AppRouter.Register(this);
        this._InitCtor = null;
    }
    _RemoveComponent(c: string) : void {
        super._RemoveComponent(c);
        this._GenerateDOM = null;
        this.Render = null;
        AppRouter.UnRegister(this);
        this._InitializeComponent = void 0;
        //this.Dispose();
        if (this.RouteName)
            console.log(`%c[Luff.Permission] Not allowed ${this.RouteName}`, 'color: darkorange',  this);
    }
    _InitializeComponent(props?: TProps) {
        const ctor = this._RawContent;
        if (!this.HasPermission) { //dropped by permission attribute (ElementBase)
            return;
        }
        this._Permission = new PermissionManager(ctor.Permission, this);
        this.HasPermission = this._Permission.IsAllow;
        if (this._Route)
            this._Route.CheckRouteLink();

        if (!this.HasPermission) {
            return;
        }

        let contentState = ctor.State;
        if (this.props.state) {
            contentState = this.props.state;
        }
        if (contentState) {
            this.State = (luffState(contentState, {
                OnChange: (newValue, changedState) => {

                },
            }) as any);
        }
        if (ctor.Target) {
            this._TargetRenderComp = ctor.Target;
        }

        if (ctor.OnOutSideClick) {
            this._OutsideClickListener = ctor.OnOutSideClick.bind(this);

        }

        if (this.ParentComponent) {
            (this.ParentComponent as Content)._ChildrenContent.push(this);
            const isNameFree = !this.ParentComponent.Components.AllByName[this.Name];
            if (isNameFree) {
                this.ParentComponent.Components.AllByName[this.Name] = this;
            }
            else {
                this.ParentComponent.Components.AllByName[this.Name + this._ID] = this;
            }
        }


        this._InitializeComponent = () => void 0;
    };



    // AddStateSubscribe<T>(state: IObservableState<T> | IObservableStateSimple<T> | IObservableStateArray<T>, onChange?: TLuffStateOnChange<T>) : void {
    //     state.AddOnChange((newVal, changedState) => {
    //         if (onChange)
    //             onChange(newVal, changedState);
    //         else
    //             this.Refresh();
    //
    //     });
    // }





    constructor(rawComponent?: TRawComponent) {
        super(rawComponent);
        this._InitCtor();
    }
}



export default Content;