import {IElement, TRawComponent} from "./IElement";
import {ElementBase} from "./ElementBase";
import {ComponentFactory, IRenderElement} from "../Compiler/ComponentFactory";


export class CasualFragmentComponent extends ElementBase {
    public _RenderUpdate(render): void {
        this._RenderUpdateChildren(render.Children);
    }
    protected _RenderUpdateChildren(children: IRenderElement[]) : void {
        if (children) {
            let used: IElement[] = [];


            for (let index = 0; index < children.length; index++) {
                let renderNewChild = children[index];
                if (!renderNewChild)
                    continue;

                let current = this.Children.find(c => c._InnerIndex == index);
                if (!current || current.Tag != renderNewChild.Tag) {
                    console.log(`[_RenderUpdateChildren]`, this.GetComponentPath(false), index);
                    let newChild = ComponentFactory.Build(renderNewChild, this, this.ParentComponent, index);
                    this.Children.splice(index, 0, newChild);
                    if (newChild.HasPermission){
                        newChild._GenerateDOM();
                        newChild._ShowTransitionFunction();
                        newChild._Appear();
                        used.push(newChild);
                    }
                    continue;
                }
                current._RenderUpdate(renderNewChild);
                let c : any = current;
                if (!c._IsHiddenByDefault && !c._IsDialog) {
                    current._ShowTransitionFunction();
                    current._Appear();
                }

                used.push(current);
            }
            //hide unused items:
            for (let c of this.Children) {
                // if (used.includes(c._InnerIndex)){
                //     continue;
                // }
                if (used.includes(c)){
                    continue;
                }
                c._HideTransitionFunction();
                c._Disappear();
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

