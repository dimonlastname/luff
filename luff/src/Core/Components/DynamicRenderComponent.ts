import {DictN, IObservableState, IObservableStateArray, IObservableStateSimple, IObservableStateAny} from "../../interfaces";
import {ElementBase} from "./ElementBase";
import {IElement, TRawComponent, TPropsDefault, JSXElement} from "./IElement";
import {ComponentFactory, IRenderElement} from "../Compiler/ComponentFactory";

type TProps = {
    render: () => JSXElement;
    deps?: (IObservableStateSimple<any> | IObservableState<any> | IObservableStateArray<any>)[];
} & TPropsDefault;

export class DynamicRenderComponent extends ElementBase<TProps>  {
    private _Child: IElement;

    private _HideItem(comp: IElement) : void {
        comp._HideTransitionFunction();
        comp._Disappear();
    }
    private _ShowItem(comp: IElement, isNew: boolean) : void {
        if (isNew && (comp as ElementBase)._IsHiddenByDefault)
            return;

        comp._ShowTransitionFunction();
        comp._Appear();
    }

    public _RenderUpdate(render): void {
        //console.log(`[DynamicRenderComponent] _RenderUpdate`);
        this._Child._RenderUpdate(render);
    }
    private Refresh(): void {
        this._RenderUpdate(this.props.render());
    }

    _GenerateDOM() {
        super._GenerateDOM();
        const rendered = this.props.render() as IRenderElement;

        this._Child = ComponentFactory.Build(rendered, this, this.ParentComponent);
        this._Child._GenerateDOM();
        this._ShowItem(this._Child, true);

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
