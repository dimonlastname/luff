import React from "../Compiler/FakeReact";
import {ComponentSimple} from "./ComponentSimple"
import {Route} from "../Application/Route";

import {IRouteLink} from "./IRouterLink";
import {AppSettings} from "../../Core/Application/Settings";
import {IObservableStateSimple} from "../../interfaces";
import {LibraryDOM} from "../../Library";

type TRouterProps = {
    route: Route;
    isUseToggle?: boolean;
    onChangeActive?(isActive: boolean, routeLink?: RouteLink) : void;
    onPermissionFailed?: (routeLink: RouteLink) => void;

    disabled?: IObservableStateSimple<boolean>;
    //name: string;
    //onNotPermittedRoute: () => void;
}

export class RouteLink extends ComponentSimple<TRouterProps> implements IRouteLink {
    public SetActive(isActive: boolean) : void {
        if (!this.DOM) {
            console.warn('removed link');
            return;
        }
        if (this.DOM) {
            if (isActive) {
                this.DOM.classList.add('active');
            }
            else {
                this.DOM.classList.remove('active');
            }
        }

        if (this.props.onChangeActive)
            this.props.onChangeActive(isActive, this);
        //console.log('[Luff.RouteLink] setActive: ', isActive);
    }
    public IsContainsElement(elem: HTMLElement) : boolean {
        return LibraryDOM.IsDescendant(elem, this.DOM);
    }

    protected AfterBuild(props?: TRouterProps): void {
        this.DOM = this.GetFirstDOMElement();
        this.DOM.addEventListener('click', () => {
            if (this.props.disabled && this.props.disabled.SValue) {
                return;
            }
            if (this.props.isUseToggle) {
                return this.props.route.Toggle();
            }
            this.props.route.Go();
        })
    }

    Render()  {
        const route = this.props.route;
        if (!route.Content) {
            route.RemoveRouteLink(this);
            if (AppSettings.Route.IsShowEmptyRouteLink) {
                return this.props.children;
            }
            else {
                //console.log('[Luff.RouterLink]', this.Name);
                return null;
            }
        }

        if (!route.Content || !route.Content.Permission.IsAllow) {
            route.RemoveRouteLink(this);
        }
        const permission = route.Content.Permission;
        if (!permission.IsAllow) {
            route.RemoveRouteLink(this);
            if (this.props.onPermissionFailed)
                this.props.onPermissionFailed(this);
            if (permission.IsHideControls) {
                return null;
            }
        }
        return this.props.children;
    }


    constructor(p) {
        super(p);
        this.props.route.AddRouteLink(this);
    }
}






