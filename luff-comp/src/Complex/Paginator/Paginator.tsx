import Luff, {React, EachPaging} from "luff";
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


    Render(): any {
        const paging = this.props.paging;

        const pageCount = paging.Paging.Take.SubState(take => {
            if (take == 0)
                return 0;
            const count = paging.Paging.Count.SValue;
            return Math.ceil(count / take);
        }, [paging.Paging.Count]);
        const page = paging.Paging.SubState(p => {
            let pageIndex = 1 + Math.ceil(p.Skip / p.Take );
            if (!isFinite(pageIndex))
                pageIndex = 1;
            return pageIndex;
        });

        const shownFrom = paging.Paging.Skip.SubState(skip => skip + 1);
        const shownTo = paging.Paging.Skip.SubState(skip => skip + paging.Paging.Shown.SValue, [paging.Paging.Shown]);

        if (!this.props.pageSizeList.includes(paging.Paging.Take.SValue)){
            this.props.pageSizeList.push(paging.Paging.Take.SValue);
            this.props.pageSizeList.sort((a, b) => a - b);
        }

        return (
            <div className={"l-paginator " + this.props.className}>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => paging.Paging.Skip.SValue = 0}>&lt;&lt;</button>
                </div>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => paging.PrevPage()}>&lt;</button>
                </div>
                <div class="l-paginator-elem">Стр. {page} из {pageCount} </div>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => paging.NextPage()}>&gt;</button>
                </div>
                <div className="l-paginator-elem">
                    <button className="l-button button" onClick={() => paging.LastPage() }>&gt;&gt;</button>
                </div>
                <div className="l-paginator-elem l-paginator-item-take l-row l-flexa-center">
                    <div className="div">Показывать по </div>
                    <ComboBox
                        value={paging.Paging.Take}
                        dataStatic={this.props.pageSizeList}
                        notFoundValue=""
                    />
                </div>
                <div class="l-paginator-elem">Показано {shownFrom}-{shownTo} из {paging.Paging.Count}</div>
                {/*<div className="l-paginator-children">*/}
                    {/*{this.props.children}*/}
                {/*</div>*/}
                {this.props.children}
            </div>
        )
    }
}