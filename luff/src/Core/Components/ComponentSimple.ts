import {JSXElement, TRawComponent} from "./IElement";
import {ElementBase} from "./ElementBase";
import {ComponentFactory, IRenderElement} from "../Compiler/ComponentFactory";

export class ComponentSimple<TProps = {}> extends ElementBase<TProps> {
    Render(): JSXElement {
        return null;
    }
    protected BeforeBuild() : void {}
    protected AfterBuild() : void {}

    _GenerateDOM() {
        super._GenerateDOM();
        this._GenerateDOM = null;
        this.BeforeBuild();
        const renderElement = this.Render() as IRenderElement;
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