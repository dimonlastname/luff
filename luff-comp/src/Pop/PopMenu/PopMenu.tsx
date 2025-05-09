import Luff, {React, Route, TContentCtor, JSXElement, IObservableStateSimple} from "luff";
import "./PopMenu.scss";

export type TCommonPopPopMenuItem = {
    Caption?: string;
    Render?: (context?: PopMenu) => JSXElement,
    OnClick?: (e?: Luff.MouseEvent, menuCtx?: PopMenu) => void;
    IsVisible?: IObservableStateSimple<boolean>;
    IsCustomClick?: boolean;
}

type TPopMenuProps = {
    items: TCommonPopPopMenuItem[];
    context?: Luff.Content;
    route?: Route;
}


export class PopMenu<TPropsExtra = {}> extends Luff.Content<TPopMenuProps & TPropsExtra> {
    Render(): Luff.Node {
        return (
            <div className="l-pop-popMenu">
                {
                    this.props.items.map(menuItem => {
                        let content : JSXElement = menuItem.Caption as any;
                        if (menuItem.Render) {
                            content = menuItem.Render(this);
                        }
                        return (
                            <div className="l-pop-popMenu_li"
                                 onClick={e => {
                                     if (menuItem.IsCustomClick)
                                         return;

                                     menuItem?.OnClick.call(this.props.context ? this.props.context: void 0, e, this);
                                     this.Hide();
                                 }}
                                 isVisible={menuItem.IsVisible}
                            >{content}</div>
                        )
                    })
                }
            </div>
        )
    }
    Ctor(): TContentCtor {
        return {
            Dialog: {
                IsGlobal: false,
                HasWrapper: false,
                Animation: {
                    Show: 'l-animation_slideUp-show',
                    Hide: 'l-animation_slideUp-hide',
                },
                OnOutsideClick: () => {
                    // if (!this.props.route.IsContainsElement(e.target as HTMLElement)) {
                    //     this.Hide(); //todo auto route.IsContainsElement
                    // }
                    this.Hide()
                }
            },
            Route: this.props.route
        }
    }
}
