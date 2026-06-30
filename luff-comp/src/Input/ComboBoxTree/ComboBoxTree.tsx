import Luff, { React, IObservableState, IObservableStateSimple, IObservableStateArray, Each } from "luff";
import ComboBox from "../ComboBox/ComboBox";

import "./ComboBoxTree.scss";

type TExtraProps<TDataItem> = {
    subKey: keyof TDataItem;
}

function getList<TDataItem>(key: string) : IObservableStateArray<TDataItem> {
    const list = this.props.data ? this.props.data : Luff.State<TDataItem[]>(this.props.dataStatic);
    list.SubState(xx => Luff.Tree.Flatten(xx, key));
    return ;
}
const branchLast = "└─ ";
const branchIntermediate  = "├─ ";
const branchAncestor = "│ ";
const branchHorizontal = "── ";
const indentWidth = branchIntermediate.length;

function getAncestorSegment(hasMoreSiblings: boolean): string {
    return hasMoreSiblings
        ? branchAncestor.padEnd(indentWidth, " ")
        : " ".repeat(indentWidth);
}

function getTreeChildren<T>(item: T, subKey: keyof T): T[] {
    const raw = Luff.State.GetSValueOrValue(item[subKey] as any);
    return Array.isArray(raw) ? raw : [];
}

function flattenTreeWithIndent<T>(tree: T[], subKey: keyof T, indentMap: Map<T, string>, ancestorNotLast: boolean[] = []): T[] {
    const res: T[] = [];
    for (let i = 0; i < tree.length; i++) {
        const item = tree[i];
        const isLast = i === tree.length - 1;
        let prefix = "";

        if (ancestorNotLast.length > 0) {
            for (let j = 0; j < ancestorNotLast.length - 1; j++)
                prefix += getAncestorSegment(ancestorNotLast[j + 1]);
            prefix += isLast ? branchLast : branchIntermediate;
        }

        indentMap.set(item, prefix);
        res.push(item);

        const children = getTreeChildren(item, subKey);
        if (children.length)
            res.push(...flattenTreeWithIndent(children, subKey, indentMap, [...ancestorNotLast, !isLast]));
    }
    return res;
}

export class ComboBoxTree<TDataItem = any, TValue = number> extends ComboBox<TDataItem, TValue, TExtraProps<TDataItem>> {
    private IndentMap = new Map<TDataItem, string>();

    protected ListItems = (this.props.data ? this.props.data : Luff.State<TDataItem[]>(this.props.dataStatic)).SubState(list => {
        this.IndentMap.clear();
        return flattenTreeWithIndent(list, this.props.subKey, this.IndentMap);
    });

    protected RenderOfferItemDefault(item: IObservableState<TDataItem>, classDict, onClick) : Luff.Node {
        const indent = item.SubState(it => this.IndentMap.get(it) ?? "");

        return (
            <div
                className="l-cb-offer-item l-cbt-offer-item"
                classDict={classDict}
                onClick={onClick}
            >
                <span className="l-cbt-prefix">{indent}</span>
                <span className="l-cbt-label">{item.SubState(it => this.props.dataDelegateView(it))}</span>
            </div>
        )
    }
}
