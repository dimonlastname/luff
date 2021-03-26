import Luff, {IObservableStateArray, IObservableState, IObservableStateSimple, IRenderElement } from "luff";

import React from 'react';
import ReactDOM from "react-dom";


type ReactComponentProps = {
    deps?: (IObservableState<any> | IObservableStateSimple<any> | IObservableStateArray<any>)[];
    render: () => any;
}

export class ReactComponent extends Luff.Content<ReactComponentProps> {
    private _ReactDOM: Element[];
    private ConvertChildrenToReact(children: IRenderElement[]) {
        if (!children)
            return [];

        return children.map(x => {
            let args;
            if (x.Tag !== 'textNode') {
                args = [
                    x.Tag,
                    x.Attributes,
                    ...this.ConvertChildrenToReact(x.Children)
                ];
                return React.createElement.apply(null, args);
            } else {
                return  [
                    x.Attributes.textNode,
                ];
            }

        })
    }
    private GetReactRenderElement() {
        const luffRenderElement = this.props.render();
        return [
            luffRenderElement.Tag,
            luffRenderElement.Attributes,
            ...this.ConvertChildrenToReact(luffRenderElement.Children)
        ];
    }
    private CreateReact(isFirstMount: boolean = false) {
        const args = this.GetReactRenderElement();
        let container = this.GetTargetRenderDOM();
        if (!this._ReactDOM) { //first mount
            const oldChildren = Array.from(container.children);
            ReactDOM.render(React.createElement.apply(null, args), container , (p) => {
                console.log('ReactDOM.render callback', p);
                this._ReactDOM = Array.from(container.children).filter(ch => !oldChildren.includes(ch));
                for (const oldCh of oldChildren) {
                    container.appendChild(oldCh);
                }
            });

            return;
        }
        ReactDOM.render(React.createElement.apply(null, args), container, () => {
            const nextDomTreeSibling = this.GetNextSibling();
            if (nextDomTreeSibling) {
                for (let reactDom of this._ReactDOM) {
                    container.insertBefore(reactDom, nextDomTreeSibling);
                }
            } else {
                for (let reactDom of this._ReactDOM) {
                    container.appendChild(reactDom)
                }
            }
        });
    }
    _Refresh() {
        if (this._IsMount) {
            this.CreateReact();
        }
    }
    _Mount(isFirstMount: boolean = false) {
        if (!this._IsShown)
            return;
        this._IsMount = true;
        return this.CreateReact(isFirstMount);
    }
    _Dismount(): void {
        this._IsMount = false;
        //ReactDOM.unmountComponentAtNode(this.GetTargetRenderDOM())
        for (let reactDom of this._ReactDOM) {
            reactDom.remove();
        }
    }

    _Appear(): void {
        this.CreateReact();
    }

    _GenerateDOM() {
        super._GenerateDOM();
        if (this.props.deps) {
            for (let state of this.props.deps) {
                state.AddOnChange(() => {
                    this._Refresh();
                })
            }
        }
        //console.info('[ReactComponent] Component has react ', this.ParentComponent);
        return void 0;
    }
}