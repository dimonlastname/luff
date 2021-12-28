import ComboBox, {TComboBoxOfferItem} from "../ComboBox/ComboBox";
type TExtraProps<TDataItem> = {
    subKey: keyof TDataItem;
}
export class ComboBoxTree<TDataItem = any, TValue = number> extends ComboBox<TDataItem, TValue, TExtraProps<TDataItem>> {
    _GetPreparedData(data: TDataItem[], lvl : number = 0): TComboBoxOfferItem<TDataItem>[] {
        let prepared = [];
        //let data = dataState;
        const subKey = this.props.subKey;

        for (let i = 0; i < data.length; i++){
            let d = data[i];
            let val = this.props.dataDelegateValue(d, i);
            let view = this.props.dataDelegateView(d, i);

            let indent = '';
            if (lvl > 0) {
                indent =  '|— '.repeat(lvl) + ' ';
            }

            let item: TComboBoxOfferItem<TDataItem> = {
                Original: d,
                Value: val,
                View: indent + String(view),
                LineID: i,
                DOMRef: null,//React.createRef(),
            };
            prepared.push(item);
            const subItems = d[subKey] as any as TDataItem[];
            prepared = prepared.concat(this._GetPreparedData(subItems, lvl + 1));
        }
        return prepared;
    }
    _PrepareData(data: TDataItem[]): TComboBoxOfferItem<TDataItem>[] {
        return this._GetPreparedData(data, 0);
    }
}

export default ComboBoxTree;