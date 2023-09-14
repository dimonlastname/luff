import {Dict} from "../../interfaces";
import {CasualComponent} from "../Components/CasualComponent";
import {ElementBase} from "../Components/ElementBase";
import {IElement} from "../Components/IElement";
import {CasualFragmentComponent} from "../Components/CasualFragmentComponent";
import {IContent} from "../Content/IContent";
import {CasualTextComponent} from "../Components/CasualTextComponent";
import {StateSingle} from "../State";


export interface IRenderElement {
    Tag: any;
    Attributes: Dict<any>;
    Children?: IRenderElement[];
}



function isClass(func) {
    return typeof func === 'function'
        && /^class\s/.test(Function.prototype.toString.call(func));
}

export class ComponentFactory {
    static Build(renderElement: IRenderElement, parentElement: IElement = null, parentComponent: IContent) : IElement {
        let element : ElementBase;
        if (!renderElement)
            return void 0;

        if (renderElement.Tag === 'textNode') {
            element = new CasualTextComponent({
                Attributes: renderElement.Attributes,
                ParentElement: parentElement,
                ParentComponent: parentComponent
            });
        }
        else if (renderElement instanceof StateSingle) {
            element = new CasualTextComponent({
                Attributes: {textNode: renderElement},
                ParentElement: parentElement,
                ParentComponent: parentComponent
            });
        }
        else if (Array.isArray(renderElement)) { //return props.children
            element = new CasualFragmentComponent({
                ParentElement: parentElement,
                ParentComponent: parentComponent,
                Children: renderElement
            });
        }
        else if (typeof renderElement.Tag === 'string') {
            element = new CasualComponent({
                Tag: renderElement.Tag,
                Attributes: renderElement.Attributes,
                ParentElement: parentElement,
                ParentComponent: parentComponent,
                Children: renderElement.Children
            });
        }
        else if (renderElement instanceof ElementBase) {
            renderElement.ParentComponent = parentComponent;
            renderElement.ParentElement = parentElement;
            renderElement._InitializeComponent();
            return renderElement;
        }
        else if (renderElement.Tag === void 0) { //fragment
            element = new CasualFragmentComponent({
                ParentElement: parentElement,
                ParentComponent: parentComponent,
                Children: renderElement.Children
            });
        }
        else { //luff Content
            const luffComponent = renderElement.Tag as any as typeof ElementBase;

            if (isClass(luffComponent)) {
                element = new luffComponent({
                    Tag: renderElement.Tag,
                    Attributes: renderElement.Attributes,
                    ParentElement: parentElement,
                    ParentComponent: parentComponent,
                    Children: renderElement.Children
                });
                element._InitializeComponent();
                // if ((element as any).isReactComponent) {
                //     console.log(`[Luff.Compiler] Going to render real React Component`, renderElement);
                //     return new CasualReactComponent({
                //         Tag: renderElement.Tag,
                //         Attributes: renderElement.Attributes,
                //         Children: renderElement.Children,
                //         ParentComponent: parentComponent,
                //         ParentElement: parentElement,
                //     });
                // }
            } else {
                // console.log(`[Luff.Compiler] Going to render real React Component`, renderElement);
                // return new CasualReactComponent({
                //     Tag: renderElement.Tag,
                //     Attributes: renderElement.Attributes,
                //     Children: renderElement.Children,
                //     ParentComponent: parentComponent,
                //     ParentElement: parentElement,
                // });
            }

        }
        if (!element.HasPermission) {
            element._RemoveComponent('factory');
            return;
        }

        return element;
    }
    static ConvertReact(children: IRenderElement[]) : any[] {
        if (!children)
            return;

        return children.map(c => {
            if (!c)
                return c;

            if (c.Tag === 'textNode') {
                return c.Attributes.textNode;
            }
            return {
                type: c.Tag,
                props: {
                    children: ComponentFactory.ConvertReact(c.Children)
                },
            }
        })
    }
}
