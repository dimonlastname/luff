import Luff, {React, TContentCtor, Each, TPositionObject} from "luff";
import "./PopMenu.scss";

export type TCommonPopContextMenuItem = {
    Caption: string;
    OnClick?: () => void;
}

type TPopMenuProps = {
    className?: string;
    context?: any;
    offset?: TPositionObject;
}

export class ContextMenu extends Luff.Content<TPopMenuProps> {
    private Items = Luff.StateArr<TCommonPopContextMenuItem>([]);
    private HookElement : HTMLElement;
    private ClassDir = Luff.State("left-top");
    private Offset = {x: -30, y: 2};

    Render(): Luff.Node {
        if (this.props.offset)
            this.Offset = this.props.offset;

        return (
            <div className={this.ClassDir.SubState(direction => "l-pop-popMenu " + (this.props.className ? this.props.className : "") + " " + direction)}>
                <Each
                    source={this.Items}
                    render={menuItem => {
                        return (
                            <div className="l-pop-popMenu_li"
                                 classDict={{
                                     static: menuItem.SubState(m => !m.OnClick)
                                 }}
                                 onClick={() => {
                                     let onClick = menuItem.SValue?.OnClick;
                                     if (onClick) {
                                         onClick.call(this.props.context ? this.props.context: void 0);
                                         this.Hide();
                                     }

                                 }}

                            >{menuItem.Caption}</div>
                        )
                    }}
                />
            </div>
        )
    }

    private OnScroll;
    protected AfterShow(): void {
        super.AfterShow();
        const pos = Luff.DOM.GetGlobalElementPositionOverAnother(this.DOM, this.HookElement, {x: -30, y: 2});
        this.DOM.style.left = pos.x + "px";
        this.DOM.style.top = pos.y + "px";
        this.ClassDir.SValue = pos.direction;
        document.addEventListener('scroll', this.OnScroll, true);
    }
    protected BeforeHide(): void {
        super.BeforeHide();
        document.removeEventListener('scroll', this.OnScroll, true);
    }

    protected BeforeShow(): void {
        super.BeforeShow();

    }

    protected BeforeBuild(): void {
        this.OnScroll = e => {
            this.Hide();
        }
    }

    Run(items : TCommonPopContextMenuItem[], elem: HTMLElement) {
        this.Items.SValue = items;
        this.HookElement = elem;
        this.Show();

    }
    Ctor(): TContentCtor {
        return {
            Dialog: {
                IsGlobal: true,
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
        }
    }
}
