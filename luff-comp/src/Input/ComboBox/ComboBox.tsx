import Luff, {
    React,
    Each,
    Route,
    RouteLink,
    TContentCtor,
    IObservableStateArray,
    IObservableStateSimple,
    LibraryString,
    luffState, IObservableState
} from "luff";
import BusyLocker from "../../BusyLocker/BusyLocker";

import "./ComboBox.scss";
import {IDisableSwitchable, initDisabled, TDisableSwitchableProps} from "../_DisableSwitchable";

type TComboBoxProps<TDataItem, TValue> = {
    value: IObservableStateSimple<TValue>;
    notFoundValue?: string;
    listEmptyText?: string;
    className?: string | IObservableStateSimple<string>;

    data?: IObservableStateArray<TDataItem>;
    dataStatic?: TDataItem[];

    dataDelegateValue?: (val: TDataItem, i?: number) => TValue;
    dataDelegateView?: (val: TDataItem, i?: number) => string;

    dataRender?: (val: TDataItem, comboBox?: ComboBox) => Luff.Node;

    onChange?: (val?: TValue, item?: TDataItem, valView?: string) => void;
    onChangeAsync?: (val?: TValue, item?: TDataItem, valView?: string) => Promise<any>;

    isInputMode?: boolean;
    listVisibleLinesCount?: number;
    listWidth?: string;
    listClassName?: string | IObservableStateSimple<string>;
    isUseParentPositionForList?: boolean;

    isSearchEnabled?: boolean;                       //default: true.
    searchDelegate?: (val: string) => boolean;
    //IsInputMode?: boolean;                           //default: false.  if enabled works like <input>
    //IsAllowEmpty?: boolean;                          //default: true. If true - sets null or ValueOnNull when IsSearchEnabled and value item is not found
    //IsDirectInput?: boolean;                         ///default: false. if IsInputMode and IsDirectInput, owher state will be updated on keyUp
    //ValueOnEmpty?: any;                               //default: null. sets this value when IsSearchEnabled and current value item is not found in data

    //IsShowFullHintListOnFocus?: boolean;             //default: false. reset hint list filter on focus
    //IsHideFullHintListOnEmpty?: boolean;             //default: false. reset hint list filter on emty

    placeholder?: string;                            //default: ''. works when IsSearhEnabled or IsInputMode

    //OfferData?: any[];                                    //default: []. offer list
    //OfferDataGetter?: (value: any) => Promise<any[]>;     //default: null. get offer list from server on input
    //OfferDataGetterDelay?: number;                        //default: 100. time in ms until call DataGetter
    //OfferDelegateSearch?: (text: string, originalItem: any) => boolean;
    //OfferDelegateValue?: (item: any) => any;                 //default: x => x. select property what will be set. originalItem value as default
    //OfferDelegateView?: (item: any) => any;                  //default: x => x. select property what will be shown in textbox. originalItem value as default



    //Disabled?: boolean;                              //default: false. if true, this component will be disabled on start
    //EmptyText?: string;                              //default: null. will be shown when hint-list is empty. Set null if you want hide EmptyText by the way

    //OnSelect?(value: any, text: string, originalItem: any) : void;     //callback function when !IsInputMode
    //OnInput?(value: string) : void;                  //callback keyup when IsInputMode
    //OnSetValue?: (value: any, text: string, originalItem: any) => void;   //callback function when set .Value
}
type TComboBoxState = {
    textBoxValue: string;
    offerData: TComboBoxOfferItem[];
    //offerDataInList: TComboBoxOfferItem[];
    isOfferListVisible: boolean;
}
type TComboBoxOfferItem<T = any> = {
    Original: T;
    View: string;
    Value: any;
    LineID: number;
    DOMRef: any;
    //IsCursored: boolean;
    //IsSelected: boolean;
    //DOM: HTMLElement;
}
type TOfferItem<T = any> = {
    Item: TComboBoxOfferItem<T>;
    View: string;
}
type TState<T> = {
    SelectedItem: TComboBoxOfferItem<T>;
    //CurrentItem: TComboBoxOfferItem;
    CursorItem: TComboBoxOfferItem<T>;
    //CurrentText: '';
    //IsDisabled: props.Disabled;
    //IsListOpen: false;

    //IsOfferListVisible: boolean;
    IsBusy: boolean;
    IsOpen: boolean;
    TextBoxValue: string;
    TextBoxValueSearch: string;
    //offerData: TComboBoxOfferItem[];
    OfferDataFiltered: TComboBoxOfferItem[];

}


const defaultProps = {
    //data: null,
    dataDelegateValue: d => d,
    dataDelegateView: d => d.toString(),
    //onChange: () => Promise.resolve(1),

    isInputMode: false,
    placeholder: '',
    notFoundValue: 'Не выбрано',
    listEmptyText: '(список пуст)',
    listClassName: '',

    isSearchEnabled: false,
    listVisibleLinesCount: 5,
    isPermissionWriteRequired: false,
    //searchDelegate: (item: TComboBoxOfferItem, search: string) => false,


    //listVisibleLinesCount: 5, // in .css 5 as default

    //
    // DataDependsOn: null,
    // IsHideFullHintListOnEmpty: false,
    // IsShowFullHintListOnFocus: false,
    // IsInputMode: false,
    // IsDirectInput: false,
    // IsSearchEnabled: false,
    // IsAllowEmpty: true,
    // ValueOnEmpty: '',
    // EmptyText: null,
    // Disabled: false,
    // Placeholder: '',
    // OfferData: [],
    // OfferDataGetter: null,
    // OfferDataGetterDelay: 100,
    // OfferDelegateSearch: (item: any) => item,
    // OfferDelegateValue: (item: any) => item,
    // OfferDelegateView: (item: any) => item,
    //
    // OnSelect: null,
    // OnInput: null,
};


class ComboBox<TDataItem = any, TValue = number> extends Luff.Content<TComboBoxProps<TDataItem, TValue> & TDisableSwitchableProps, TState<TDataItem>> implements IDisableSwitchable<TDisableSwitchableProps> {
    static defaultProps = defaultProps;
    _offerData: TComboBoxOfferItem[];

    _ListComponent : ComboBoxOfferList;
    _TextBox: HTMLInputElement;
    RouteComboBoxOfferList = new Route({DoNotUseRouter: true});

    //private _IsOpen = Luff.State(false);

    protected AfterBuild(): void {
        this._TextBox = this.GetComponentByName('l-cbx-textbox').DOM as HTMLInputElement;
        this._ListComponent = this.GetComponentByName<ComboBoxOfferList>('ComboBoxOfferList');
        if (this.props.data) {
            this.props.data.AddOnChange(() => {
               // console.log('[ComboBox] data changed', newVal);
                this.Refresh();
            });
        }

        this.props.value.AddOnChange(() => {
            //console.log('[ComboBox] Value changed', v);
            this.RefreshValue();
        });
        if (this.props.isSearchEnabled) {
            this.State.TextBoxValueSearch.AddOnChange(v => {
                if (v.length > 0) {
                    this._CursorItem(this.State.OfferDataFiltered.FirstOrDefault(item => LibraryString.IsTextIncludes(v, item.View)))
                }
            })
        }
        this.Refresh();
    }


    RefreshValue() {
        //const selected = this.State.SelectedItem.SValue;
        const item = this.getOfferItem(this.props.value.SValue);
        //console.log('cbx refresh');
        this.State.SValue = {
            ...this.State.SValue,
            OfferDataFiltered: this._offerData,
            TextBoxValue: item.View,
            SelectedItem: item.Item,
            CursorItem: item.Item,
        };
    }
    Refresh() {
        if (this.props.data) {
            this._offerData = this._PrepareData(this.props.data.SValue);
            this.Refresh = () => {
                this._offerData = this._PrepareData(this.props.data.SValue);
                this.RefreshValue();
            }
        }
        if (this.props.dataStatic) {
            this._offerData = this._PrepareData(this.props.dataStatic);
            this.Refresh = () => {
                this.RefreshValue();
            }
        }
        //state.offerDataFiltered.SValue = offerData.SValue;
        this.RefreshValue();
    }
    getOfferItem(value: TValue) : TOfferItem {
        if (this.props.isInputMode)
            return {
                Item: null,
                //View: tbxValue.SValue,
                View: 'tbxValue.SValue',
            };
        let item = this._offerData.find(x => x.Value === value);
        if (!item) {
            return {
                Item: null,
                View: this.props.notFoundValue,
            };
        }
        return {
            Item: item,
            View: item.View,
        }
    }

    _PrepareData(data: TDataItem[]): TComboBoxOfferItem[] {
        let prepared = [];
        //let data = dataState;
        for (let i = 0; i < data.length; i++){
            let d = data[i];
            let val = this.props.dataDelegateValue(d, i);
            let view = this.props.dataDelegateView(d, i);
            let item: TComboBoxOfferItem = {
                Original: d,
                Value: val,
                View:  String(view),
                LineID: i,
                DOMRef: null,//React.createRef(),
                //DOM: LibraryDOM.CreateElementFromString(`<div class="l-cb-offer-item" data-value="${val}">${view}</div>`),
            };
            prepared.push(item);
        }
        return prepared;
    }
    _DefaultSearch(item: TComboBoxOfferItem<TDataItem>, search: string = this.State.TextBoxValue.SValue) : boolean {

        let searchText = search.toLowerCase();
        let searchTextAlt = LibraryString.KeyboardSwitch(searchText);

        //let isStraightText = true;

        let viewText = item.View;
        let sourceToSearchText = viewText.toLowerCase();

        let foundIndex = sourceToSearchText.indexOf(searchText);
        if (foundIndex < 0)
        {
            //isStraightText = false;
            foundIndex = sourceToSearchText.indexOf(searchTextAlt);
        }
        return foundIndex > -1;
    }

    _OnOfferClick(offerItem: TComboBoxOfferItem){

        this.State.SValue = {
            ...this.State.SValue,
            SelectedItem: offerItem,
            IsOfferListVisible: false,
            IsBusy: !!this.props.onChangeAsync,
        } as TState<TDataItem>;
        this._ListComponent.Hide();
        if (this.props.onChange) {
            this.props.onChange(offerItem.Value, offerItem.Original, offerItem.View);
        }
        else if (this.props.onChangeAsync) {
            this.props.onChangeAsync(offerItem.Value, offerItem.Original, offerItem.View)
                .finally(() => {
                    this.State.IsBusy.SValue = false;
                });
        }
        else {
            if (offerItem) {
                this.props.value.SValue = offerItem.Value;
            }
            else {
                this.RefreshValue();
            }
            this.State.IsBusy.SValue = false;
        }

    }
    _CursorItem(item: IObservableState<TComboBoxOfferItem>) : void {
        if (!item) {
            this.State.CursorItem.SValue = null;
            return;
        }
        //console.log('_CursorItem', item);
        this.State.CursorItem.SValue = item.SValue;

        //scroll
        const offerList = this._ListComponent;
        const offerListContainer = this._ListComponent.ListContainer;

        let scrollList = offerListContainer.scrollTop;
        let heightList = offerListContainer.clientHeight;
        const domItem = offerList.GetDOMOfItem(item);

        let heightItem = domItem.clientHeight;
        let itemTop = domItem.offsetTop;

        if (scrollList + heightList < itemTop + heightItem){
            offerListContainer.scrollTop = itemTop + heightItem - heightList;//scrollList + heightItem;
        }
        else if (scrollList > itemTop){
            //TODO
            offerListContainer.scrollTop = itemTop;
        }
    }
    _CursorMove(delta: number) : void{
        if (this.State.OfferDataFiltered.length === 0)
            return;
        if (!this._ListComponent._IsShown) {
            //this.State.IsOpen.SValue = true;
            this._ListComponent.Show();
            return;
        }
        let index = this.State.OfferDataFiltered.SValue.indexOf(this.State.CursorItem.SValue);
        //console.log('index',index , _DataItemsCurrent);

        if (index < 0 && delta > 0){
            return this._CursorItem(this.State.OfferDataFiltered[0]);
        }
        if (index < 0 && delta < 0){
            return this._CursorItem(this.State.OfferDataFiltered[this.State.OfferDataFiltered.SValue.length - 1]);
        }

        if (delta < 0 && index === 0){
            return this._CursorItem(this.State.OfferDataFiltered[this.State.OfferDataFiltered.SValue.length - 1]);
        }
        if (delta > 0 && index > this.State.OfferDataFiltered.SValue.length - 2){
            return this._CursorItem(this.State.OfferDataFiltered[0]);
        }
        if ( (delta < 0 && index > 0) || (delta > 0 && index <  this.State.OfferDataFiltered.SValue.length - 1) ) {
            if (this.State.CursorItem.SValue === null)
                delta = 0;
            this._CursorItem(this.State.OfferDataFiltered[index + delta]);
        }
    }
    _onKeyDown(e: Luff.KeyboardEvent<HTMLInputElement>) {
        if (e.key == 'ArrowUp') {
            e.preventDefault();
        }
        if (e.key == 'ArrowDown') {
            e.preventDefault();
        }
    }
    _TryCommit() : void {
        // let OwnerValue = this.Owner ? this.Owner.GetProperty(this.Config.Bind) : void 0;
        if (this.State.CursorItem.SValue != null && this.State.CursorItem.SValue !== this.State.SelectedItem.SValue ){
            const offerItem = this.State.CursorItem.SValue;
            // .setState({
            //     textBoxValue: offerItem.View,
            // });
            this.State.SValue = {
                ...this.State.SValue,
                SelectedItem: offerItem,
                //IsOfferListVisible: false,
                IsBusy: !!this.props.onChangeAsync,
            } as TState<TDataItem>;
            if (this.props.onChange) {
                this.props.onChange(offerItem.Value, offerItem.Original);
            }
            else if (this.props.onChangeAsync) {
                this.props.onChangeAsync(offerItem.Value, offerItem.Original)
                    .finally(() => {
                        this.State.IsBusy.SValue = false;
                    });
            } else {
                this.props.value = offerItem.Value;
            }

            return;
        }
        if (this.State.CursorItem.SValue === this.State.SelectedItem.SValue && this.State.SelectedItem.View.SValue !== this.State.TextBoxValue.SValue) {
            this.State.TextBoxValue.SValue = this.State.SelectedItem.View.SValue;
        }
    }
    _onKeyUp(e: Luff.KeyboardEvent<HTMLInputElement>) : void {

        if ( ['ArrowLeft', 'ArrowRight'].includes(e.key))
            return;
        if (e.key == 'ArrowUp') {
            return this._CursorMove(-1);
        }
        if (e.key == 'ArrowDown') {
            return this._CursorMove(1);
        }
        if (e.key == 'Tab')
            return;

        if (this.props.isSearchEnabled) {
            if (!this._ListComponent._IsShown) {
                this._ListComponent.Show();
                //this.State.IsOfferListVisible.SValue = true;
            }
            const items = this._offerData;
            if (
                (!this.props.isSearchEnabled)
                || (this.State.SelectedItem.SValue && this.State.SelectedItem.View.SValue === this.State.TextBoxValue.SValue)
                || (this.State.TextBoxValue.SValue === this.props.notFoundValue)
            ) {
                this.State.OfferDataFiltered.SValue = items;
            }
            else {
                this.State.OfferDataFiltered.SValue = items
                    .filter(x => {
                        //return x.Value.includes(this.State.textBoxValue.SValue);
                        return this._DefaultSearch(x);
                    })
            }
        }


        if (e.which === 13 || e.key === 'Enter'){
            //_Textbox.value = _Textbox.value.trim();


            // setState({
            //     ...state,
            //     textBoxValue: _Textbox.current.value.trim(),
            // });
            if (this.props.isInputMode) {
                return this._TryCommit();
            }
            return this._OnOfferClick(this.State.CursorItem.SValue);
        }
        // thi1s._CursorClear();
        // thi1s._ShowList();
        // const text = thi1s._Textbox.value;
        // t1his._State.CurrentText = text;
        // thi1s._State.CursorItem = null;
        // if (th1is.props.DataGetter == null) {
        //     th1is._BuildListOnKeyUp();
        // } else {
        //     clearTimeout(thi1s._DataGetTimeout);
        //     th1is._DataGetTimeout = setTimeout(() => {
        //         th1s.Config.DataGetter(text)
        //             .then(data => {
        //                 thi1s.Data = data;
        //
        //                 th1is._BuildListOnKeyUp();
        //             })
        //     }, th1is.props.DataGetterDelay);
        // }
        //
        // if (thi1s.props.IsInputMode /*&& th1is.Config.IsDirectInput*/){
        //     if (this1.props.OnInput)
        //         thi1s.props.OnInput(text);
        //     // thi1s._UpdateOwner({
        //     //     View: text,
        //     //     Value: text,
        //     //     DOM: null,
        //     //     LineID: null,
        //     //     Original: null
        //     // });
        // }
    }

    private GetClassName() : any {
        const classNameDefault = 'l-combo-box';

        let className : string | IObservableStateSimple<string>;
        if (!this.props.className || typeof this.props.className === 'string') {
            className = classNameDefault + (this.props.className ? ' ' + this.props.className : '');
        }
        else {
            className = this.props.className.SubState(c => classNameDefault + ' ' + c);
        }
        return className;
    }

    Render() : Luff.Node {
        const state = this.State;

        const placeholder = this.props.placeholder;
        const isInputMode = this.props.isInputMode;
        const isSearchEnabled = this.props.isSearchEnabled;
        const onChange = this.props.onChange;

        //const isShowList = state.IsOfferListVisible.SValue && !state.IsBusy.SValue;


        return (
            <div className={this.GetClassName()}
                 classDict={{
                     'l-combo-box_open': this.State.IsOpen,
                 }}
                 onClick={() => {
                     if (this.IsDisabled)
                         return;
                     if (/*!state.IsOfferListVisible.SValue && */!state.IsBusy.SValue)
                         this._ListComponent.Show();
                 }}

            >
                <BusyLocker isBusy={state.IsBusy}/>
                <input className="l-cb-textbox l-textbox"
                       name="l-cbx-textbox"
                       type="text"
                       placeholder={placeholder}
                       autocomplete="off"
                       value={state.TextBoxValue as any}
                       onFocus={e => e.target.select()}
                       onChange={e => {
                           let value = e.currentTarget.value;
                           if (isInputMode){
                               if (this.props.onChange)
                                   this.props.onChange(value as any);
                               else
                                   this.props.value.SValue = value as any;
                           }
                           state.TextBoxValue.SValue = value;
                           if (isSearchEnabled) {
                               state.TextBoxValueSearch.SValue = value;
                           }
                       }}
                       ////onDoubleClick={() => state.IsBusy.SValue = !state.IsBusy.SValue}
                       onKeyUp={(e) => this._onKeyUp(e)}
                       // onKeyDown={(e) => this._onKeyDown(e)}
                       //ref={_Textbox}
                       disabled={this._IsDisabled.SubState(isDisabled => isDisabled || ((!isInputMode && !isSearchEnabled) || state.IsBusy.SValue) , [state.IsBusy])}
                />
                <RouteLink route={this.RouteComboBoxOfferList} disabled={this._IsDisabled}>
                    <div className="l-cb-drop-icon"/>
                </RouteLink>
                <ComboBoxOfferList comboBox={this}/>
            </div>
        )
    }



    get IsBusy() : boolean {
        return this.State.IsBusy.SValue;
    }
    set IsBusy(isBusy: boolean) {
        this.State.IsBusy.SValue = isBusy;
    }
    get IsDisabled() : boolean {
        return this._IsDisabled.SValue;
    }
    set IsDisabled(val: boolean) {
        this._IsDisabled.SValue = val || !this.props.isPermissionWriteRequired;
    }
    _IsDisabled: IObservableStateSimple<boolean>;
    protected BeforeBuild() : void {
        initDisabled(this);
    }




    Ctor() : TContentCtor<TState<TDataItem>> {
        return {
            State: {
                SelectedItem: null,
                CursorItem: null,

                //IsOfferListVisible: false,
                IsBusy: false,
                IsOpen: false,
                TextBoxValue: '',
                TextBoxValueSearch: '',
                OfferDataFiltered: [],
            }
        }
    }
}


////////////////////////////////////////////
///////////////////////////////////////////
type TComboBoxOfferListProps = {
    comboBox: ComboBox<any, any>;

}

class ComboBoxOfferList extends Luff.Content<TComboBoxOfferListProps, TState<any>> {
    Top: number;
    EachItems: Each;
    public ListContainer: HTMLElement;

    private GetHookElementRect() : DOMRect {
        const cbxProps = this.props.comboBox.props;
        if (!cbxProps.isUseParentPositionForList)
            return this.props.comboBox.DOM.getBoundingClientRect();
        else
            return this.props.comboBox.GetFirstParentDOMElement().getBoundingClientRect();
    }
    protected AfterBuild(): void {
        this.EachItems = this.GetComponentByName('EachCBOfferItems');
        this.ListContainer = this.GetComponentByName('offerListContainer').DOM;
    }

    public GetDOMOfItem(itemState: IObservableState<TComboBoxOfferItem>) : HTMLElement {
        return this.EachItems.GetDOMByItemState(itemState as any)
    }
    private OnScroll: any;

    protected AfterShow(): void {
        const cbx = this.props.comboBox;
        cbx.State.IsOpen.SValue = true;
        if (cbx.props.isSearchEnabled) {
            cbx._TextBox.select();
        }
        const container = this.ListContainer;
        const rect = container.getBoundingClientRect();
        if (window.innerHeight < rect.top + rect.height + window.scrollY + 1) {
            //container.style.bottom = '100%';
            container.style.top = this.Top - rect.height - 1 + 'px';
        }
        //this.AfterShow = () => {};

        if (this.State.SelectedItem.SValue && document.body.scrollIntoView) {
            const lineDOM = this.EachItems.GetDOMByItemState(this.State.OfferDataFiltered[this.State.SelectedItem.SValue.LineID]);
            lineDOM.scrollIntoView();
        }
        document.addEventListener('scroll', this.OnScroll, true);
    }

    protected BeforeHide(): void {
        document.removeEventListener('scroll', this.OnScroll, true);

        const cbx = this.props.comboBox;

        const selected = cbx.State.SelectedItem.SValue;
        if (selected) {
            cbx.State.TextBoxValue.SValue = selected.View;
        }
        this.props.comboBox.State.IsOpen.SValue = false;
    }

    protected BeforeShow(): void {
        const cbxProps = this.props.comboBox.props;
        let boxRect = this.GetHookElementRect();
        this.DOM.style.left = boxRect.left + 'px';
        this.DOM.style.top = boxRect.top + boxRect.height + window.scrollY + 'px';
        const widthByProps = cbxProps.listWidth;
        this.DOM.style.width = !widthByProps ? boxRect.width + 'px' : widthByProps;
        this.Top = boxRect.y +  + window.scrollY;

        const cbx = this.props.comboBox;
        cbx.State.TextBoxValueSearch.SValue = '';
    }
    protected BeforeBuild(): void {
        this.OnScroll = e => {
            if (e.target !== this.ListContainer) {
                //this.props.comboBox.State.IsOpen.SValue = false;
                this.Hide();
            }
        }
    }

    Render(): Luff.Node {
        const state = this.State;//this.props.comboBox.State;
        const cbx = this.props.comboBox;


        return (
            <div className={"l-cb-offer-list_wrap " + cbx.props.listClassName}>
                <div className="l-cb-offer-list" name="offerListContainer" style={`--l-combobox-lines: ${this.props.comboBox.props.listVisibleLinesCount}`}>
                    <Each
                        name="EachCBOfferItems"
                        source={state.OfferDataFiltered}
                        filter={x => {
                            return LibraryString.IsTextIncludes(cbx.State.TextBoxValueSearch.SValue, x.View);
                        }}
                        deps={[cbx.State.TextBoxValueSearch]}
                        renderOnEmpty={() => <div className="l-cb-offer-empty">{cbx.props.listEmptyText}</div>}
                        render={(x, i) => {

                            const styleState = state.SelectedItem.SubState(selectedItem => {
                                const isSelected = selectedItem === x.SValue;
                                const isCursored = state.CursorItem.SValue === x.SValue;
                                return "l-cb-offer-item" + (isSelected ? ' l-cb-selected':'') + (isCursored ? ' l-cb-cursored':'');

                            }, [state.CursorItem, x]);

                            const render = this.props.comboBox.props.dataRender;

                            return (
                                <div className={styleState}
                                     onClick={e => {
                                         this.props.comboBox._OnOfferClick(x.SValue);
                                         e.stopPropagation();
                                     }}
                                >
                                    {
                                        render
                                        &&
                                        render(x.Original, this.props.comboBox)
                                    }
                                    {
                                        !render
                                        &&
                                        x.View
                                    }
                                </div>
                            )
                        }
                        }
                    />
                </div>
            </div>
        )
    }
    Ctor(): TContentCtor {
        return {
            Dialog: {
                IsGlobal: true,
                HasWrapper: false,
                //IsHideOnOutsideClick: true,
                OnOutsideClick: (e: Luff.MouseEvent) => {
                    if (!Luff.DOM.IsDescendant(e.target, this.ParentElement.DOM))
                        this.Hide();
                },
                Animation: null,
            },
            Route: this.props.comboBox.RouteComboBoxOfferList,
            State: this.props.comboBox.State,
        }
    }
}







export default ComboBox;