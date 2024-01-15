import Luff, {
    Dict, Each,
    IObservableState,
    IObservableStateArray, IObservableStateSimple,
    IObservableStateSimpleOrValue,
    React,
    TContentCtor
} from "luff";

import './ImageViewer.scss';
import './img/no-image.svg';
import {LuffImageViewer} from "./ImageViewer";


type TImageSourceElement = {
    srcPathFull: string;
    srcPathThumbnail: string;
}

type TProps = {
    srcPathList?: IObservableStateArray<string>;
    srcPathListWithThumbnails?: IObservableStateArray<TImageSourceElement>;
    //srcPathList: IObservableStateArray<string>;
    maxImageHeight?: number;
    isShowPaging?: boolean;
    isOptimizeImageLoading?: boolean; //isUseIntersectionObserver
    isUseViewer?: boolean;

    extraRender?: () => Luff.Node;
    render?: (item: IObservableState<TImageSourceElement>, index?: IObservableStateSimple<number>, caroucel?: ImageCarousel, each?: Each<TImageSourceElement>) => Luff.Node;
};

export class ImageCarousel extends Luff.Content<TProps> {
    static defaultProps = {
        isShowPaging: false,
        maxImageHeight: 150,
        isOptimizeImageLoading: false,
        isUseViewer: false,
        render: src => <img src={src.srcPathThumbnail}/>,

    };
    private ImageSrcList: IObservableStateArray<TImageSourceElement>;


    private LuffImageViewer: LuffImageViewer;
    private ImageIndex = Luff.State<number>(0);


    ImageCarouselItems: HTMLElement;
    ImageCarouselEach: Each<string>;
    ImageCanvas: HTMLElement;

    protected BeforeBuild(): void {
        if (this.props.srcPathListWithThumbnails){
            this.ImageSrcList = this.props.srcPathListWithThumbnails;
        } else {
            this.ImageSrcList = this.props.srcPathList.SubStateArr(items => items.map(x => {
                return {
                    srcPathFull: x,
                    srcPathThumbnail: x,
                } as TImageSourceElement
            }))
        }
        this.ImageSrcList.AddOnChange(() => {
            this.ImageIndex.SValue = 0;
            this.ImageCarouselItems.style.left = "0px";
        })
    }

    protected AfterBuild(): void {
        this.LuffImageViewer = this.GetComponentByName("LuffImageViewer");
        this.ImageCarouselItems = this.GetComponentByName('l-iv-carousel_items').GetFirstDOM();
        this.ImageCarouselEach = this.GetComponentByName('l-iv-carousel_each');
        this.ImageCanvas = this.GetComponentByName('l-iv-body').GetFirstDOM();
    }


    public NextImage(direction: number) : void {
        this.ChangeIndex(direction);
        let dom = this.ImageCarouselEach.GetDOMByItemState(this.ImageSrcList[this.ImageIndex.SValue] as any);
        this.ImageCarouselItems.style.left = -dom.offsetLeft + "px";
    };
    private ChangeIndex(direction: number) : void {
        let nextIndex = this.ImageIndex.SValue + direction;
        if (nextIndex >= this.ImageSrcList.length){
            nextIndex = 0;
        }
        if (nextIndex < 0){
            nextIndex = this.ImageSrcList.length - 1;
        }
        this.ImageIndex.SValue = nextIndex;
    };

    public OpenImage(index: number) : void {
        this.LuffImageViewer.Run(this.ImageSrcList.SValue.map(x => x.srcPathFull), index);
    }



    Render() {
        const { isShowPaging, isUseViewer, extraRender, render } = this.props;
        const maxImageHeight = this.props.maxImageHeight ? `--max-image-height: ${this.props.maxImageHeight}px`:'';

        const issArrowsVisible = this.ImageSrcList.SubState(x => x.length > 1);

        return (
            <div className="l-image-viewer l-image-carousel" style={maxImageHeight}>
                {
                    isUseViewer
                    &&
                    <LuffImageViewer isShowPaging={isShowPaging} />
                }
                <div className="l-iv-inner">
                    <div className="l-iv-slider">
                        <div className="l-iv-control l" onClick={() => this.NextImage(-1)} isVisible={issArrowsVisible} >
                            <div className="l-iv-control-arrow l-iv-control-arrow-left"/>
                        </div>
                        <div className="l-iv-body l-iv-carousel" name="l-iv-body">
                            <div className="l-iv-carousel_items" name="l-iv-carousel_items">
                                <Each
                                    name="l-iv-carousel_each"
                                    source={this.ImageSrcList}
                                    render={(src, index, each) => {
                                        return (
                                            <div
                                                className={"l-iv-image-holder" + (isUseViewer ? " l-pointer" : "")}
                                                onClick={() => isUseViewer && this.OpenImage(index.SValue)}
                                            >
                                                { render(src, index, this, each) }
                                            </div>
                                        )
                                    }}
                                />
                                {
                                    extraRender
                                    &&
                                    <div className="l-iv-image-holder" name="l-iv-image-holder">
                                        {extraRender()}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="l-iv-control r" onClick={() => this.NextImage(1)} isVisible={issArrowsVisible} >
                            <div className="l-iv-control-arrow l-iv-control-arrow-right"/>
                        </div>
                    </div>
                    {
                        isShowPaging
                        &&
                        <div className="l-iv-paging">{this.ImageIndex.SubState(index => index + 1)} / {this.ImageSrcList.SubState(list => list.length)}</div>
                    }
                </div>
            </div>
        )
    }
    Ctor() : TContentCtor {
        return {
            LoadTarget: 'l-iv-body',
            // Dialog: this.props.isBuildIn ? void 0 : {
            //     IsGlobal: true,
            // }
        }
    }
}
