import {IRenderElement} from "./ComponentFactory";
import {JSXElement} from "../Components/IElement";
import {State} from "../State";

class React  {
    static createElement(tag: any, attrs: any, children: any) : JSXElement {
        // let tg = tag;
        // let attrsSafe = attrs;
        // let chs = children;
        // let args = arguments;
        let el : IRenderElement = {
            Tag: tag,
            Attributes: attrs,
            Children: [],
        };
        for (let i = 2; i < arguments.length; i++) {
            let child = arguments[i];
            if (child === void 0 || child === null)
                continue;

            if (typeof child === 'string' || typeof child === 'number' || child instanceof State) {
                child = {
                    Tag: 'textNode',
                    Attributes: {textNode: child},
                    //Children: []
                } as IRenderElement;
            }
            else if (Array.isArray(child)) { //fragment with jsx items ( arr.map(x => <item>) )
                child = {
                    Tag: void 0,
                    Children: child,
                }
            }
            el.Children.push(child);
        }
        return el as any;
    }
}
export default React;