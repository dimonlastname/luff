import {IContent} from "../Content/IContent";
import {IRouteLink} from "../Components/IRouterLink";
import {Dict} from "../../interfaces";
import {PopLog} from "../../System/Pop/Pop";
import {LibraryArray, LibraryDOM} from "../../Library";
import Application from "./Application";

export class Router {
    static Settings = {
        Auto: true,        //if true: any grouped Luff.Content will be mapped, except which got Route=false/null/undefined parameter
    };
    static GetRoutePropsFromString(routeString: string) : [string, string] {
        const indexParam = routeString.lastIndexOf("/");
        const routeName = routeString.substring(0, indexParam);
        const routeParam = routeString.substring(indexParam + 1);
        return [routeName, routeParam];
    }
    static GetRoutePropsFromContent(ctx: IContent) : [string, string] {
        const routeName = ctx.RouteName;
        const routeParam = ctx._RouteParam !== void 0 ? ctx._RouteParam : '';
        return [routeName, routeParam]
    }
    //public IsShowEmptyRouteLink: boolean = true;

    private _Enabled: boolean = true;

    //private PreviousContent: IContent;
    private CurrentContent: IContent;
    private CurrentPath: string;
    private CurrentParams: string;

    // private ContentStack : IContent[] = [];
    // private get ContentStackLast() : IContent {
    //     return this.ContentStack[this.ContentStack.length - 1];
    // }
    // private get ContentStackPrev() : IContent {
    //     return this.ContentStack[this.ContentStack.length - 2];
    // }
    // private ContentStackLastRemove() : void {
    //     this.ContentStack.splice(this.ContentStack.length - 1);
    // }

    ContentsByGroupType: Dict<IContent[]> = {};
    ContentByRouteName: Dict<IContent> = {};
    ContentRoot: IContent[] = [];

    get Enabled() : boolean {
        return this._Enabled;
    };
    // set Enabled(isEnabled: boolean) {
    //     this._Enabled = isEnabled;
    //     if (isEnabled)
    //         window.addEventListener('popstate', this.OnPopState);
    //     else
    //         window.removeEventListener('popstate', this.OnPopState);
    //
    // };

    Register(ctx: IContent) : void {
        ctx.GroupType;
        if (ctx.GroupType) {
            if (!this.ContentsByGroupType[ctx.GroupType])
                this.ContentsByGroupType[ctx.GroupType] = [];
            this.ContentsByGroupType[ctx.GroupType].push(ctx);
        }
        if (!ctx.ParentComponent) {
            this.ContentRoot.push(ctx);
        }
        this.ContentByRouteName[ctx.RouteName] = ctx;
    }
    UnRegister(ctx: IContent) : void {
        ctx.GroupType;
        if (ctx.GroupType) {
            LibraryArray.Remove(this.ContentsByGroupType[ctx.GroupType], x => x === ctx);
        }
        if (!ctx.ParentComponent) {
            LibraryArray.Remove(this.ContentRoot, x => x === ctx);
        }
        LibraryArray.Remove(this.ContentRoot, x => x === ctx);
        delete this.ContentByRouteName[ctx.RouteName];
    }

    TryPush(ctxTo: IContent) : void {
        const [routeName, routeParam] = Router.GetRoutePropsFromContent(ctxTo);

        const path = `#${routeName}/${routeParam !== '' ? `${routeParam}`:''}`;

        if (this.CurrentPath === routeName && this.CurrentParams === routeParam) {
            return;
        }

        this.CurrentPath = routeName;
        this.CurrentParams = routeParam;
        this.CurrentContent = ctxTo;
        //this._Lock = true;
        if (ctxTo._IsShown) {
            window.history.replaceState({Param: routeParam, Content: routeName}, '', path);
        } else {
            window.history.pushState({Param: routeParam, Content: routeName}, '', path);
        }

        //console.log(`[App.Router] TryPush "${path}"`);
        //this._Lock = false;
    };


    Back(ctxFrom: IContent) : void {
         //const previousContent = this.ContentStackPrev;
         // const currentContent = this.ContentStackLast;

        if (ctxFrom._RawContent.Dialog) {
            this.CurrentPath = void 0;
            this.CurrentParams = void 0;
            window.history.back();
            // const [routeName, routeParam] = Router.GetRoutePropsFromContent(previousContent);
            // const path = `#${routeName}/${routeParam !== '' ? `${routeParam}`:''}`;
            // console.log(`[App.Router] Back "${path}"`);
            // this.ContentStackLastRemove();
            // this.CurrentPath = routeName;
            // this.CurrentParams = routeParam;
            // window.history.replaceState({Param: routeParam, Content: routeName}, '', path);
        }
    };
    OnPopState(e: PopStateEvent) : number {
        const routeString = location.hash.substring(1);
        if (!e || !e.state) {
            //new path

            if (Application.Debug) {
                console.log(`%c[Router]  Run new: ${routeString}`, "color: red;", e);
            }

            return this.GoTo(routeString);
        }
        //back button:
        if (Application.Debug) {
            console.log(`%c[Router]  Run back: ${routeString}`, "color: red;", e);
        }
        this.GoTo(routeString, true);

    };


    GoTo(routeString: string, isBack: boolean = false) : number {
        //return
        if (Application.Debug) {
            console.log(`%c[Router] GoTo:  ${routeString}`, "color: green;", /*'_Lock: ', this._Lock*/);
        }
        if (!routeString /*|| this._Lock || !Luff.Application.isRun*/)
            return this.GoToDefault();

        const [routeName, routeParam] = Router.GetRoutePropsFromString(routeString);
        let ctx = this.ContentByRouteName[routeName];

        if (!ctx) {
            // try root
            let routeParent = routeName.substring(0, routeName.lastIndexOf("/"));
            while (routeParent.length > 0 && !ctx) {
                ctx = this.ContentByRouteName[routeParent];
                routeParent = routeParent.substring(0, routeParent.lastIndexOf("/"));
            }

            if (!ctx)
                return this.GoToDefault();
            ctx._CheckLazy();
            this.GoTo(routeString, isBack);
        }
        const currentContent = this.CurrentContent;

        if (isBack && currentContent && currentContent._IsShown && currentContent._RawContent.Dialog && currentContent !== ctx)
            currentContent._DoHide();

        this.CurrentPath = routeString;
        const isNewOrEmptyRouteParam = ctx._RouteParam !== routeParam || routeParam.length === 0;
        if (ctx && ctx.Permission.IsAllow && (/*!ctx._IsShown ||*/ isNewOrEmptyRouteParam)) {

            ctx._RouteParam = routeParam;
            if (routeParam) {
                ctx.OnRoute(routeParam);
                return 1;
            }
            ctx.Show(!isBack);
            return 1;
        }

        return this.GoToDefault();
    };
    GoToDefault() : number {
        this.CurrentContent = null;
        let defaultContent = AppRouter.ContentRoot.find(x => x.Permission.IsAllow && (x.HasRoute || x.GroupType));
        if (!defaultContent)
            defaultContent = AppRouter.ContentRoot.find(x => !(x  as any)._IsDialog);
        if (!defaultContent)
            defaultContent = AppRouter.ContentRoot[0];
        defaultContent.Show();
        return 0;
    }

    //############################

    constructor() {
        //afted app run this.GoTo(document.location.hash);
        window.addEventListener('popstate', (event) => this.OnPopState(event));
    }

}

type RouterSettingsCtor<T = any> = {
    DoNotUseRouter?: boolean;
    IsShowControlOnEmptyContent?: boolean;
    ParamsEmpty?: T;
}

export class Route<T = any> {
    //OnInvalidRoute: () => void;
    OnNotPermittedRoute() : void {
        if (this.Content.Permission.OnDeny){
            this.Content.Permission.OnDeny();
            return;
        }
        PopLog.Warn('[Luff.Permission] You have no permission to the unit', {LogItem: this.Content});
    };


    private RouteLinks: IRouteLink[] = [];
    Content: IContent;

    PathParam: T;

    IsRoutingEnabled: boolean = true;
    
    IsContainsElement(elem: HTMLElement) : boolean {
        for (let routeLink of this.RouteLinks) {
            if (routeLink.IsContainsElement(elem))
                return true;
        }
        return false;
    }

    //private Entity: ILuffEntity;
    SetLinksActive(isActive: boolean) : void {
        for (let r of this.RouteLinks) {
            r.SetActive(isActive);
        }
    }
    public AddRouteLink(routeLink: IRouteLink) : void {
        this.RouteLinks.push(routeLink);
    }
    public RemoveRouteLink(routeLink: IRouteLink) : void {
        LibraryArray.Remove(this.RouteLinks, x => x === routeLink);
        //this.RouteLinks.push(routeLink);
    }

    SetContent(content: IContent) : void {
        this.Content = content;
    }

    Toggle() : void {
        this.Content.Toggle();
    }
    GoWithParams(params: T) : void {
        this.Content._RouteParam = params;
        this.Content.OnRoute(params);
    }
    Go() : void {
        if (!this.Content)  {
            throw new Error("[Luff.Route] Route has not bound to LuffContent");
        }
        if (!this.Content.Permission.IsAllow) {
            return this.OnNotPermittedRoute();
        }
        //console.log('[Luff.Route] Go', this.Content.RouteName);
        this.SetLinksActive(true);
        this.Content.Show();
    }


    public CheckRouteLink() : void {
        this.RouteLinks.map(rLink => rLink.CheckPermission() );
    }
    // Back() : void {
    //     //console.log('[Luff.Route] Back', this.Content.RouteName);
    //     //this.SetLinksActive(false);
    //     AppRouter.Back(this.Content);
    // }

    // Activate() : void {
    //     console.log(`[Route.Activate] `, this.Content.RouteName);
    //     this.SetLinksActive(true);
    //     AppRouter.TryPush(this.Content);
    // }
    // Deactivate() : void {
    //     console.log(`[Route.Deactivate] `, this.Content.RouteName);
    //     this.SetLinksActive(false);
    //     //AppRouter.Back(this.Content);
    // }

    constructor(settings?: RouterSettingsCtor<T>) {
        settings = {
            //IsShowControlOnEmptyContent: AppSettings.Route.IsShowEmptyRouteLink,
            DoNotUseRouter: false,
            ...settings,
        };
        this.IsRoutingEnabled = !settings.DoNotUseRouter;
    }
}


const AppRouter = new Router();
export default AppRouter;