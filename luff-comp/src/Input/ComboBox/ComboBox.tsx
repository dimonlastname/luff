import Luff, {
    React,
    Each,
    Route,
    RouteLink,
    TContentCtor,
    IObservableStateArray,
    IObservableStateSimple,
    LibraryString,
    luffState, IObservableState, DynamicRenderComponent, IObservableOrValue
} from "luff";
import BusyLocker from "../../BusyLocker/BusyLocker";

import "./ComboBox.scss";
import {IDisableSwitchable, initDisabled, TDisableSwitchableProps} from "../_DisableSwitchable";

type TComboBoxProps<TDataItem, TValue> = {
    className?: IObservableOrValue<string>;
    value: IObservableStateSimple<TValue>;

    listEmptyText?: IObservableOrValue<string>;
    notFoundValue?: IObservableOrValue<string>;

    data?: IObservableStateArray<TDataItem>;
    dataStatic?: TDataItem[];

    dataDelegateValue?: (item: TDataItem, i?: number) => TValue;
    dataDelegateView?: (item: TDataItem, i?: number) => string;

    dataRender?: (item: IObservableState<TDataItem>, comboBox?: ComboBox<TDataItem, TValue, any>) => Luff.Node;

    onChange?: (val?: TValue, item?: TDataItem) => void;
    onChangeAsync?: (val?: TValue, item?: TDataItem) => Promise<any>;

    isInputMode?: boolean;
    listVisibleLinesCount?: number;
    listWidth?: string;
    listClassName?: IObservableOrValue<string>;
    isUseParentPositionForList?: boolean;

    isSearchEnabled?: boolean;
    //searchDelegate?: (itemView: string, searchText: string) => boolean;
    searchSuggestionDataAsync?: (val: string, offset: number, take: number) => Promise<TDataItem[]>;
    searchSuggestionDataAsyncDelay?: number;

    placeholder?: IObservableOrValue<string>;
    inputFilterRegex?: RegExp;
    isAlwaysShowAllList?: boolean;
}

const defaultProps = {
    dataDelegateValue: (d: any) => d,
    dataDelegateView: (d: any) => d.toString(),

    isInputMode: false,
    placeholder: '',
    notFoundValue: 'Не выбрано',
    listEmptyText: '(список пуст)',
    listClassName: '',

    isSearchEnabled: false,
    listVisibleLinesCount: 10,
    isPermissionWriteRequired: false,
    searchSuggestionDataAsyncDelay: 1000,
    isAlwaysShowAllList: false,
};

// const LIST_LINE_HEIGHT = 22;
// const LIST_PADDING = 4;


export default class ComboBox<TDataItem = any, TValue = number, TExtraProps = object> extends Luff.Content<TComboBoxProps<TDataItem, TValue> & TDisableSwitchableProps & TExtraProps> {
    static defaultProps = defaultProps;

    public get IsBusy() : boolean {
        return this._IsBusy.SValue;
    }
    public set IsBusy(isBusy: boolean) {
        this._IsBusy.SValue = isBusy;
    }
    protected _IsBusy = this.CreateState(false);

    protected get HasInput() : boolean {
        return this.props.isInputMode || this.props.isSearchEnabled;
    }
    _IsDisabled: IObservableStateSimple<boolean>;

    protected EachOfferList: Each<TDataItem>;
    protected Screen: HTMLElement;
    protected Placeholder: HTMLElement;
    protected OfferListWrapDom: HTMLElement;
    protected OfferListDom: HTMLElement;

    protected ListItems = this.props.data ? this.props.data : this.CreateState<TDataItem[]>(this.props.dataStatic);
    protected SearchText = this.CreateState("");
    protected TbxSearch: HTMLInputElement;
    protected SearchTimer: ReturnType<typeof setTimeout>;
    protected CursorIndex = this.CreateState<number>(-1);



    protected IsListOpen = this.CreateState(false);
    protected IsListClosed = this.IsListOpen.SubState(s => !s);
    protected IsListOpenUp = this.CreateState(false);

    private ViewportListenersAttached = false;


    protected BeforeBuild() : void {
        initDisabled(this);
    }
    protected AfterBuild() : void {
        super.AfterBuild();
        this.EachOfferList = this.GetComponentByName("each-l-offer-list");
        this.Screen = this.GetComponentByName("l-cb-screen").DOM;
        this.Placeholder = this.GetComponentByName("l-cb-placeholder").DOM;

        this.OfferListWrapDom = this.GetComponentByName("l-cb-offer-list_wrap").DOM;
        this.OfferListDom = this.GetComponentByName("l-cb-offer-list").DOM;
        this.TbxSearch = this.GetComponentByName("l-cb-textbox_search").DOM as HTMLInputElement;

        this.props.value.AddOnChange(() => this.MountCurrentView());
        this.props.data?.AddOnChange(() => this.MountCurrentView());
        this.SearchText.AddOnChange(() => this.CursorUpdate());
        this.MountCurrentView();

    }
    protected OnAppear() : void {
        super.OnAppear();
        this.MountCurrentView();
    }

    protected UpdateValue(value: TValue, item: TDataItem) : void {
        const { onChange, onChangeAsync} = this.props;
        if (onChange){
            onChange(value, item);
        }
        else if (onChangeAsync){
            this._IsBusy.SValue = true;
            onChangeAsync(value, item)
                .finally(() => this._IsBusy.SValue = false )
        }
        else {
            this.props.value.SValue = value;
        }
    }
    protected _OnOfferClick(item: TDataItem) : void {
        this._IsBusy.SValue = !!this.props.onChangeAsync;

        const newValue = this.props.dataDelegateValue(item);
        this.IsListOpen.SValue = false;
        if (this.props.value.SValue == newValue){
            this.MountCurrentView();
        }
        this.UpdateValue(newValue, item);
        this.DOM.appendChild(this.OfferListWrapDom);
    }
    protected ToggleList() : void {
        if (this._IsDisabled.SValue)
            return;

        if (this.IsListOpen.SValue) {
            this.OfferListClose();
        } else {
            this.OfferListOpen();
        }

    }
    protected OfferListOpen() {
        this.IsListOpen.SValue = true;
        this.EachOfferList.Refresh();
        document.body.appendChild(this.OfferListWrapDom);
        this.UpdateListPosition();
        this.CursorUpdate();

        // const currentValue = this.props.value.SValue;
        // if (this.props.isInputMode && currentValue != null && currentValue != void 0) {
        //     this.SearchText.SValue = currentValue.toString();
        // }
        // else {
        //     this.SearchText.SValue = "";
        // }
        this.SearchText.SValue = "";
        this.RunAsyncSearch("", true);
        this.TbxSearch.focus();
        //this.OfferListWrapDom.

        const selectedDom = this.OfferListDom.querySelector(".l-cb-selected");
        if (selectedDom){
            selectedDom.scrollIntoView()
        }
        this.AttachViewportListeners();
    }
    protected OfferListClose() : void {
        this.IsListOpen.SValue = false;
        this.DOM.appendChild(this.OfferListWrapDom);
        this.MountCurrentView();
        this.DetachViewportListeners();
    }

    protected RenderOfferItem(item: IObservableState<TDataItem>) : Luff.Node {
        const onClick = e => {
            if (Luff.DOM.IsDescendant(e.target, this.DOM)) {
                return;
            }
            this._OnOfferClick(item.SValue as TDataItem);
            e.stopPropagation();
        };
        const value = this.props.value;
        const dataDelegateValue = this.props.dataDelegateValue;

        const isSelected = item.SubState(x => dataDelegateValue(x) == value, [this.props.value]);
        const isCursored = item.SubState(x => {
            if (!this.EachOfferList) {// before render done
                return false;
            }
            const index = this.CursorIndex.SValue;
            if (index < 0)
                return false;

            const fo = this.EachOfferList.GetFilterPassedItems();
            if (fo.length == 0)
                return false;

            const xVal = dataDelegateValue(x);
            if (index >= fo.length) {
                console.warn(`[Cbx] index out of border. index=${index}, len=${fo.length}, xVal=${xVal}`, fo);
                return false;
            }


            return xVal == dataDelegateValue(fo[this.CursorIndex.SValue]);
        }, [this.CursorIndex]);

        const classDict: Record<string, IObservableStateSimple<boolean>> = {
            "l-cb-selected": isSelected,
            "l-cb-cursored": isCursored,
        };

        if (this.props.dataRender){
            const r = this.props.dataRender(item);
            if (!r["Attributes"])
                r["Attributes"] = {};
            let props = r["Attributes"];

            props.onClick = onClick;
            if (!props["classDict"]) {
                props["classDict"] = {};
            }
            props["classDict"] = {
                ...props["classDict"],
                ...classDict,
            };

            return r;
        }

        return this.RenderOfferItemDefault(item, classDict, onClick);

    }
    protected RenderOfferItemDefault(item: IObservableState<TDataItem>, classDict, onClick) : Luff.Node {
        return (
            <div
                className="l-cb-offer-item"
                classDict={classDict}
                onClick={onClick}

            >
                {item.SubState(it => this.props.dataDelegateView(it))}
            </div>
        )
    }

    protected RenderList(list: IObservableStateArray<TDataItem>) : Luff.Node {
        return (
            <div className="l-cb-offer-list" compName="l-cb-offer-list">
                <Each
                    compName="each-l-offer-list"
                    source={list}
                    render={item => this.RenderOfferItem(item as IObservableState<TDataItem>)}
                    renderOnEmpty={() => <div className="l-cb-offer-empty">{this.props.listEmptyText}</div>}
                    deps={[this.SearchText]}
                    filter={x => {
                        const text = this.SearchText.SValue;
                        const view = this.props.dataDelegateView(x);
                        try {
                            return Luff.String.Contains(view, text, true);
                        }
                        catch (e) {
                            console.error(this.GetComponentPath(false));
                            console.error(e);
                        }
                    }}
                />
            </div>
        )
    }

    protected MountCurrentView() {
        if (this.IsListOpen.SValue)
            return;

        if (!this.ListItems || !this.ListItems.SValue || this.ListItems.SValue.length == 0)
            return;

        const v = this.props.value.SValue;
        const valState = this.ListItems.FirstOrDefault(x => this.props.dataDelegateValue(x) == v);
        const children = Array.from(this.Screen.children);
        for (let child of children) {
            child.remove();
        }
        if (valState) {
            const dom = this.EachOfferList.GetDOMByItemState(valState);
            if (!dom) {
                //impossible for cobmobox, mb from tree
                return;
            }

            this.Screen.appendChild(this.HasInput ? dom : dom.cloneNode(true));
        } else {
            this.Screen.appendChild(this.Placeholder);
        }
    }

    protected CursorUpdate() : void {
        const items = this.EachOfferList.GetFilterPassedItems();
        if (items.length == 0) {
            //this.CursorValue.SValue = null;
            this.CursorIndex.SValue = -1;
            return;
        }
        let currentItemIndex = items.findIndex(x => this.props.dataDelegateValue(x) == this.props.value.SValue);
        if (currentItemIndex < 0)
            currentItemIndex = 0;
        this.CursorIndex.SValue = currentItemIndex;
    }
    protected CursorMove(direction: number) : void {
        const items = this.EachOfferList.GetFilterPassedItems();

        let newIndex = this.CursorIndex.SValue + direction;
        if (newIndex < 0) { //down
            newIndex = items.length - 1;
        }
        else if (newIndex >= items.length){
            newIndex = 0;
        }
        this.CursorIndex.SValue = newIndex;
    }


    private GetListAnchor(): HTMLElement {
        if (this.props.isUseParentPositionForList && this.DOM.parentElement) {
            return this.DOM.parentElement;
        }
        return this.DOM;
    }
    private UpdateListPosition(): void {
        const anchor = this.GetListAnchor();
        if (!anchor) {
            return;
        }

        const rect = anchor.getBoundingClientRect();
        const maxLines = this.props.listVisibleLinesCount ?? defaultProps.listVisibleLinesCount;

        const wrap = this.OfferListWrapDom;


        //const listItemCount = this.OfferListDom.children;
        const firstElement = this.OfferListDom.children.length > 0 ? this.OfferListDom.children[0] : null;
        if (firstElement) {
            const elementRect = firstElement.getBoundingClientRect();
            const lineHeight = elementRect.height;

            const preferredHeight = maxLines * lineHeight;

            const spaceBelow = window.innerHeight - rect.bottom - 8;
            const spaceAbove = rect.top - 8;

            const openUp = spaceBelow < preferredHeight && spaceAbove > spaceBelow;
            this.IsListOpenUp.SValue = openUp;

            const availableSpace = Math.max(openUp ? spaceAbove : spaceBelow, lineHeight);
            const visibleLines = Math.max(1, Math.min(maxLines, Math.floor((availableSpace) / lineHeight)));
            const listHeight = visibleLines * lineHeight ;

            wrap.style.setProperty("--l-combobox-lines", String(visibleLines));


            if (openUp) {
                wrap.style.top = "auto";
                wrap.style.bottom = `${window.innerHeight - rect.top}px`;
            } else {
                wrap.style.bottom = "auto";
                wrap.style.top = `${rect.bottom}px`;
            }

            this.OfferListDom.style.maxHeight = `${listHeight}px`;
        }



        let widthPx = rect.width;
        const listWidth = Luff.State.GetSValueOrValue(this.props.listWidth);
        if (listWidth) {
            wrap.style.width = listWidth;
            const parsedWidth = parseFloat(listWidth);
            if (!Number.isNaN(parsedWidth)) {
                widthPx = parsedWidth;
            }
        } else {
            wrap.style.width = `${rect.width}px`;
        }

        let left = rect.left;
        if (left + widthPx > window.innerWidth - 8) {
            left = Math.max(8, window.innerWidth - widthPx - 8);
        }

        wrap.style.position = "fixed";
        wrap.style.left = `${left}px`;
        wrap.style.zIndex = "10000";



        // const listElement = wrap.querySelector(".l-cb-offer-list") as HTMLElement;
        // if (listElement) {
        //     listElement.style.maxHeight = `${listHeight}px`;
        // }
    }
    private HandleKeyDown(e: KeyboardEvent): void {
        // if (this._IsDisabled.SValue) {
        //     return;
        // }

        switch (e.key) {
            case "ArrowDown":
                this.CursorMove(1);
                break;
            case "ArrowUp":
                this.CursorMove(-1);
                break;
            case "Enter":
                this.CommitCursorValue();
                this.OfferListClose();
                break;
            case "Escape":
                e.preventDefault();
                this.OfferListClose();
                break;
            case "Tab":

                break;
        }
    }
    private HandleTextInput(value: string): void {
        value = this.ApplyInputFilter(value.trim());
        this.SearchText.SValue = value;
        if (this.props.isInputMode){
            this.CommitInputValue();
        }
        if (this.props.searchSuggestionDataAsync) {
            this.RunAsyncSearch(value);
        }

        // const filtered = this.ApplyInputFilter(value);
        // this.TextBoxValue.SValue = filtered;
        // this.IsListVisible.SValue = true;
        // this.CursorIndex.SValue = -1;
        // this.RefreshDisplayItems();
        //
        // if (this.props.searchSuggestionDataAsync) {
        //     this.RunAsyncSearch(filtered.trim());
        // }
        //
        // requestAnimationFrame(() => this.UpdateListPosition());
    }
    private RunAsyncSearch(search: string, isInstant = false): void {
        const asyncSearch = this.props.searchSuggestionDataAsync;
        if (!asyncSearch) {
            return;
        }

        clearTimeout(this.SearchTimer);
        const delay = isInstant ? 0 : this.props.searchSuggestionDataAsyncDelay ?? defaultProps.searchSuggestionDataAsyncDelay;
        //const requestId = ++this.SearchRequestId;

        this.SearchTimer = setTimeout(() => {
            this._IsBusy.SValue = true;
            const take = this.props.listVisibleLinesCount ?? defaultProps.listVisibleLinesCount;
            asyncSearch(search, 0, take)
                .then(items => {
                    this.ListItems.SValue = items;
                    // if (requestId !== this.SearchRequestId) {
                    //     return;
                    // }
                    // this.AsyncData.SValue = items ?? [];
                    // this.RefreshDisplayItems();
                })
                .finally(() => {
                    this._IsBusy.SValue = false;
                    if (this.IsListClosed.SValue) {
                        this.MountCurrentView();
                    }
                });
        }, delay);
    }
    private ApplyInputFilter(value: string): string {
        const regex = this.props.inputFilterRegex;
        if (!regex) {
            return value;
        }
        const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
        const allowed = new RegExp(regex.source, flags);
        allowed.lastIndex = 0;
        return value.match(allowed)?.join("") ?? "";
    }
    private CommitInputValue(): void {
        const text = this.SearchText.SValue.trim();
        if (this.props.isInputMode) {
            const value = this.props.value.SValue;
            const type = typeof value;
            if (type == "string") {
                this.UpdateValue(text as TValue, null);
            }
            else if (type == "number") {
                this.UpdateValue(text.length > 0 ? parseFloat(text) as TValue : 0 as TValue, null);
            }
            else if (type == "boolean" && text.toLowerCase()) {
                this.UpdateValue(text.length > 0 ? (text.toLowerCase() != "false") as TValue : false as TValue, null);
            }
            return;
        }
    }
    private CommitCursorValue() : void {
        const cursorIndex = this.CursorIndex.SValue;
        if (cursorIndex > -1) {
            const item = this.EachOfferList.GetFilterPassedItems()[cursorIndex];
            this.UpdateValue(this.props.dataDelegateValue(item), item);
            return;
        }
    }

    private OnViewportChange = (): void => {
        if (this.IsListOpen.SValue) {
            this.UpdateListPosition();
        }
    };
    private AttachViewportListeners(): void {
        if (this.ViewportListenersAttached) {
            return;
        }
        window.addEventListener("resize", this.OnViewportChange);
        window.addEventListener("scroll", this.OnViewportChange, true);
        this.ViewportListenersAttached = true;
    }

    private DetachViewportListeners(): void {
        if (!this.ViewportListenersAttached) {
            return;
        }
        window.removeEventListener("resize", this.OnViewportChange);
        window.removeEventListener("scroll", this.OnViewportChange, true);
        this.ViewportListenersAttached = false;
    }
    Render(): Luff.Node {
        const { value, dataDelegateValue, dataDelegateView, isInputMode, isSearchEnabled, placeholder, notFoundValue} = this.props;

        const isShowScreen = this.IsListOpen.SubState(isOpen => {
            if (!isInputMode && !isSearchEnabled)
                return true;

            return !isOpen;
        });
        const isShowInput = this.IsListOpen.SubState(isOpen => {
            return (isInputMode || isSearchEnabled) && isOpen
        });

        let deps = [];
        if (Luff.State.IsState(placeholder)){
            deps.push(placeholder);
        }
        if (Luff.State.IsState(notFoundValue)){
            deps.push(notFoundValue);
        }
        const valueView = value.SubState(v => {
            const item = this.ListItems.SValue.find(x => dataDelegateValue(x) == v);
            if (item) {
                return dataDelegateView(item);
            }

            if (isInputMode) {
                return v;
            }


            return Luff.State.ValueOf(notFoundValue);

        }, deps);

        return (
            <div
                className={Luff.State.Concat("l-combo-box", this.props.className)}
                classDict={{
                    "l-busy": this._IsBusy,
                    "l-cb-disabled": this._IsDisabled,
                }}
            >
                <div
                    compName="l-cb-screen"
                    className="l-cb-screen l-textbox"
                    classDict={{
                        //active: this.IsListVisible,
                        "l-cb-disabled": this._IsDisabled,
                    }}
                    isVisible={isShowScreen}
                    //isVisible={!isUseTextBox}
                    onClick={() => this.ToggleList()}
                >

                    <div
                        className="l-cb-placeholder"
                        compName="l-cb-placeholder"
                    >
                        {valueView}
                    </div>
                </div>

                <input
                    className="l-cb-textbox l-textbox"
                    compName="l-cb-textbox_search"
                    type="text"
                    placeholder={this.props.placeholder}
                    autocomplete="off"
                    value={this.SearchText}
                    isVisible={isShowInput}
                    //disabled={this._IsDisabled}
                    onFocus={e => {
                        (e.currentTarget as HTMLInputElement).select();
                        //this.OpenList();
                    }}
                    onChange={e => {
                        this.HandleTextInput(e.currentTarget.value);

                    }}
                    //onChange={e => this.HandleTextInput((e.currentTarget as HTMLInputElement).value)}
                    onKeyDown={e => this.HandleKeyDown(e as unknown as KeyboardEvent)}
                />

                <div
                    className="l-cb-drop-icon"
                    classDict={{
                        active: this.IsListOpen,
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        this.ToggleList();
                    }}
                />

                <div
                    compName="l-cb-offer-list_wrap"
                    className={Luff.State.Concat("l-cb-offer-list_wrap", this.props.listClassName)}
                    classDict={{
                        "--open-up": this.IsListOpenUp,
                    }}
                >
                    {this.RenderList(this.ListItems)}
                </div>
            </div>
        );
    }

    Ctor(): TContentCtor {
        return {
            OnOutSideClick: e => {
                if (this.IsListClosed.SValue)
                    return;
                const target = e.target as HTMLElement;

                if (Luff.DOM.IsDescendant(target, this.DOM) || Luff.DOM.IsDescendant(target, this.OfferListWrapDom)) {
                    return;
                }

                this.OfferListClose();
            },
        };
    }
}
