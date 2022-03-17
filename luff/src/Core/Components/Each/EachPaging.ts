import {IObservableState} from "../../../interfaces";
import {luffState} from "../../State";
import {TPaging} from "./Each";


export default class EachPaging {
    _IsPagingRefreshLocked = false;

    Paging: IObservableState<TPaging>;

    public PrevPage() {
        if (this.Paging.Skip.SValue <= this.Paging.Take.SValue)
            return this.Paging.Skip.SValue = 0;
        this.Paging.Skip.SValue = this.Paging.Skip.SValue - this.Paging.Take.SValue;
    }
    public NextPage() {
        if (this.Paging.Skip.SValue + this.Paging.Take.SValue >= this.Paging.Count.SValue) {
            return;
        }
        this.Paging.Skip.SValue = this.Paging.Skip.SValue + this.Paging.Take.SValue;
    }
    public LastPage() {
        const take = this.Paging.Take.SValue;
        const lastPage = Math.ceil(this.Paging.Count.SValue / take) - 1;
        this.Paging.Skip.SValue = lastPage * take;
    }

    constructor(paging: TPaging) {
        this.Paging = luffState(paging);
        // this._TakePrevious = this.Paging.Take.SValue;
        // this.Paging.Take.AddOnChange(take => {
        //     this._TakePrevious = take;
        // })
    }
}