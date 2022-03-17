import Luff, {React, EachPaging, IObservableState, IObservableStateSimple} from "luff";
import ComboBox from "../../Input/ComboBox/ComboBox";

import "./Paginator.scss";

type TProps = {
    className?: string;
    paging: EachPaging;
    pageSizeList?: number[];
    //count: IObservableState<number>;
}

export default class Paginator extends Luff.ComponentSimple<TProps> {
    static defaultProps = {
        className: '',
        pageSizeList: [20, 50, 100],
    };
    public PagesCount: IObservableStateSimple<number>;
    public CurrentPage: IObservableStateSimple<number>;
    public ShownFrom: IObservableStateSimple<number>;
    public ShownTo: IObservableStateSimple<number>;
    public get Paging() : EachPaging {
        return this.props.paging;
    }
    public NextPage() {
        this.Paging.NextPage();
    }
    public PrevPage() {
        this.Paging.PrevPage();
    }
    public FirstPage() {
        this.Paging.Paging.Skip.SValue = 0
    }
    public LastPage() {
        this.Paging.LastPage();
    }

    protected BeforeBuild(): void {
        super.BeforeBuild();
        const paging = this.props.paging;
        const p = paging.Paging;

        const pageCount = p.Take.SubState(take => {
            if (take == 0)
                return 0;
            const count = p.Count.SValue;
            return Math.ceil(count / take);
        }, [p.Count]);
        const page = p.SubState(p => {
            let pageIndex = 1 + Math.ceil(p.Skip / p.Take );
            if (!isFinite(pageIndex))
                pageIndex = 1;
            if (pageIndex > pageCount.SValue )
                pageIndex = pageCount.SValue;
            return pageIndex;
        });

        const shownFrom = p.Skip.SubState(skip => {
            let from = skip + 1;
            if (from > p.Count.SValue) {
                from = p.Count.SValue - p.Take.SValue;
            }
            if (from < 1)
                from = 1;
            return from

        }, [p.Take, p.Count]);
        //const shownTo = p.Skip.SubState(skip => skip + p.Shown.SValue, [p.Shown, p.Take]);
        const shownTo = p.Skip.SubState(skip => {
            let shown = skip + p.Take.SValue;
            if (shown > p.Count.SValue)
                shown = p.Count.SValue;
            return shown;
        }, [p.Take, p.Count]);

        if (!this.props.pageSizeList.includes(p.Take.SValue)){
            this.props.pageSizeList.push(p.Take.SValue);
            this.props.pageSizeList.sort((a, b) => a - b);
        }
        this.PagesCount = pageCount;
        this.CurrentPage = page;
        this.ShownFrom = shownFrom;
        this.ShownTo = shownTo;
    }

    protected AfterBuild(): void {
        //this.props.paging._IsPagingRefreshLocked
    }

    Render(): Luff.Node {
        const paging = this.Paging;
        const p = paging.Paging;

        return (
            <div className={"l-paginator " + this.props.className}>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => this.FirstPage() }>&lt;&lt;</button>
                </div>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => this.PrevPage() }>&lt;</button>
                </div>
                <div class="l-paginator-elem">Стр. {this.CurrentPage} из {this.PagesCount} </div>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => this.NextPage() }>&gt;</button>
                </div>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => this.LastPage() }>&gt;&gt;</button>
                </div>
                <div className="l-paginator-elem l-paginator-item-take l-row l-flexa-center">
                    <div className="div">Показывать по </div>
                    <ComboBox
                        value={p.Take}
                        dataStatic={this.props.pageSizeList}
                        notFoundValue=""
                    />
                </div>
                <div class="l-paginator-elem">Показано {this.ShownFrom}-{this.ShownTo} из {p.Count}</div>
                {this.props.children}
            </div>
        )
    }
}