import {DictN, IObservableState, IObservableStateArray, IObservableStateSimple, IObservableStateAny} from "../../interfaces";
import {ElementBase} from "./ElementBase";
import {IElement, TRawComponent, TPropsDefault, JSXElement} from "./IElement";
import {ComponentFactory, IRenderElement} from "../Compiler/ComponentFactory";

type TProps = {
    render: () => JSXElement;
    deps?: (IObservableStateSimple<any> | IObservableState<any> | IObservableStateArray<any>)[];
} & TPropsDefault;

export class DynamicRenderComponent extends ElementBase<TProps>  {
    //private _Child: IElement;


    // private _HideItem(comp: IElement) : void {
    //     comp._HideTransitionFunction();
    //     comp._Disappear();
    // }
    // private _ShowItem(comp: IElement, isNew: boolean) : void {
    //     if (isNew && (comp as ElementBase)._IsHiddenByDefault)
    //         return;
    //
    //     comp._ShowTransitionFunction();
    //     comp._Appear();
    // }

    public _RenderUpdate(render): void {
        //console.log(`[DynamicRenderComponent] _RenderUpdate`);
        //this._Child._RenderUpdate(render);
        const chs = [...this.Children];
        for (const ch of chs) {
            ch.Dispose();
        }
        this._RenderChildren();
    }
    private Refresh(): void {
        this._RenderUpdate(this.props.render());
    }
    private _RenderChildren() : void {
        const rendered = this.props.render() as IRenderElement;
        if (Array.isArray(rendered)) {
            for (let sub of rendered) {
                this.AppendChild(sub);
            }
            return;
        }
        this.AppendChild(rendered);
    }

    _GenerateDOM() {
        super._GenerateDOM();
        this._RenderChildren();
        return void 0;
    }
    constructor(rawComponent: TRawComponent) {
        super(rawComponent);
        if (!this.HasPermission) {
            return;
        }

        const deps = rawComponent.Attributes['deps'] as IObservableState<any>[];
        if (deps) {
            for (let dep of deps) {
                dep.AddOnChange((c) => {
                    this.Refresh();
                })
            }
        }
    }
}
