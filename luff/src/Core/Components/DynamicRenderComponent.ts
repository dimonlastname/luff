import {DictN, IObservableState, IObservableStateArray, IObservableStateSimple, IObservableStateAny} from "../../interfaces";
import {ElementBase} from "./ElementBase";
import {IElement, TRawComponent, TPropsDefault, JSXElement} from "./IElement";
import { ComponentFactory } from "../Compiler/ComponentFactory";

type TProps = {
    render: () => JSXElement;
    deps?: (IObservableStateSimple<any> | IObservableState<any> | IObservableStateArray<any>)[];
} & TPropsDefault;

export class DynamicRenderComponent extends ElementBase<TProps>  {
    private readonly _ChildRender: () => ElementBase;
    private _MapElements = new Map<string, IElement>();

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


    private Refresh(): void {
        const rendered = this._ChildRender() as any;
        const renderedKey = JSON.stringify(rendered);

        let item = this._MapElements.get(renderedKey);

        const generatedKeys = this._MapElements.keys();
        for (let key of generatedKeys) {
            const generatedItem = this._MapElements.get(key);
            if (generatedItem != item) {
                this._HideItem(generatedItem);
            }
        }

        if (item) {
            this._ShowItem(item, true);
            return;
        }

        item = ComponentFactory.Build(rendered, this, this.ParentComponent);
        item._GenerateDOM();
        this._ShowItem(item, true);
        this._MapElements.set(renderedKey, item);
    }

    _GenerateDOM() {
        super._GenerateDOM();
        this.Refresh();
        return void 0;
    }
    constructor(rawComponent: TRawComponent) {
        super(rawComponent);
        if (!this.HasPermission) {
            return;
        }

        this._ChildRender = rawComponent.Attributes['render'];
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
