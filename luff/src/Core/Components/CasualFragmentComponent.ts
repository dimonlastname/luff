import {TRawComponent} from "./IElement";
import {ElementBase} from "./ElementBase";
import {ComponentFactory} from "../Compiler/ComponentFactory";


export class CasualFragmentComponent extends ElementBase {
    public _RenderUpdate(render): void {
        console.log(`[Luff.CasualFragmentComponent] _RenderUpdate, `, this.Name);
        if (render.Children) {
            for (let i = 0; i < render.Children.length; i++) {
                let renderNewChild = render.Children[i];
                this.Children[i]._RenderUpdate(renderNewChild);
            }
        }
    }

    private _CompileChildren() {
        const children = this._RawComponent.Children;
        if (!children)
            return;

        let i = 0;
        for (let child of children) {
            let elem = ComponentFactory.Build(child, this, this.ParentComponent, i);
            if (elem) {
                this.Children.push(elem);
            }
            i++;
        }
    }

    private _GenerateChildren(){
        for (let ch of this.Children){
            ch._GenerateDOM();
            ch._Mount(true);
        }
    }
    _Mount(isFirstMount: boolean = false): void {
        if (!this._IsShown)
            return;
        this._IsMount = true;

        if (isFirstMount) {
            const container = this.GetTargetRenderDOM();
            if (!container) {
                this._IsMount = false;
                return;
            }

            container.appendChild(this.DOM);
            return;
        }

        super._Mount(isFirstMount);
    }

    _GenerateDOM() {
        super._GenerateDOM();
        this.DOM = document.createDocumentFragment() as any;
        this._GenerateChildren();
        if (this._IsHiddenByDefault)
            this._HideTransitionFunction();
        return this.DOM;
    }


    constructor(rawComponent: TRawComponent) {
        super(rawComponent);
        if (!this.HasPermission) {
            return;
        }
        this._CompileChildren();
    }
}

