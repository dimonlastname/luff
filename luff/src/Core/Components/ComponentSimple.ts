import {JSXElement, TRawComponent} from "./IElement";
import {ElementBase} from "./ElementBase";
import {ComponentFactory, IRenderElement} from "../Compiler/ComponentFactory";
import {CasualFragmentComponent} from "./CasualFragmentComponent";

export class ComponentSimple<TProps = {}> extends ElementBase<TProps> {
    public _RenderUpdate(render): void {
        //console.log(`[Luff.Content] _RenderUpdate, `, this.Name);
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

    Render(): JSXElement {
        return null;
    }
    protected BeforeBuild() : void {}
    protected AfterBuild() : void {}

    _GenerateDOM() {
        super._GenerateDOM();
        this._GenerateDOM = null;
        this.BeforeBuild();
        let renderElement = this.RenderSafe() as IRenderElement;
        if (!renderElement) {
            return void 0;
        } 
        const build = ComponentFactory.Build(renderElement, this, this.ParentComponent);
        if (!build) {
            this._RemoveComponent();
            return;
        }

        this.Children.push(build);
        const dom = build._GenerateDOM();
        this.DOM = build.GetFirstDOM();
        this.AfterBuild();
        return dom;
    }
    constructor(rawComponent?: TRawComponent) {
        super(rawComponent);
    }
}