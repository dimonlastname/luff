import Luff, {Dict, React, TContentCtor} from "luff";

import './ImageViewer.scss';
import './img/no-image.svg';

type TState = {
    ImageSrcList: string[],
    ImageIndex: number,

    // ImagePrevent: {
    //     Src: '',
    //     Promise: void 0,
    // },
}

type TProps = {
    isBuildIn?: boolean;
    isShowPaging?: boolean;
    maxImageHeight?: number;
}

type TImageSource = {
    Src: string;
    Promise: Promise<HTMLImageElement>;
}
const ImgNoImage = new Image();
ImgNoImage.src = 'img/no-image.svg';



export default class LuffImageViewer extends Luff.Content<TProps> {
    static defaultProps = {
        isBuildIn: false,
        isShowPaging: true,
    };
    ImageSrcList = Luff.StateArr<string>([]);
    ImageIndex = Luff.State<number>(0);
    _IsArrowsVisible = this.ImageSrcList.SubState(x => x.length > 1);

    ImageHolder: HTMLElement;
    ImageCanvas: HTMLElement;
    ImageCache: Dict<HTMLImageElement> = {};
    ImagePrevent = {
        Src: '',
        Promise: void 0,
    };

    AfterBuild(): void {
        this.ImageHolder = this.GetComponentByName('l-iv-image-holder').GetFirstDOM();
        this.ImageCanvas = this.GetComponentByName('l-iv-body').GetFirstDOM();
    }

    Run(ImageSrcList: string[]) : void {
        if (!ImageSrcList || ImageSrcList.length < 1) {
            //console.log('[Luff.ImageViewer] Images source is empty');
            ImageSrcList = ['img/no-image.svg'];
        }
        this.ImageSrcList.SValue = ImageSrcList;
        this.ImageIndex.SValue = 0;
        this.NextImage(0);
        this.Show();
    }

    NextImage(direction: number) : void {
        if (this.Load.IsActive)
            return;
        this.ChangeIndex(direction);
        this.GetImage(this.ImageSrcList[this.ImageIndex.SValue].SValue)
            .then(image => {
                this.ImageHolder.innerHTML = '';
                this.ImageHolder.appendChild(image);
                //this.Proto.Refresh();
            });
        this.PreventingImage(direction);
    };
    ChangeIndex(direction: number) : void {
        let nextIndex = this.ImageIndex.SValue + direction;
        if (nextIndex >= this.ImageSrcList.length){
            nextIndex = 0;
        }
        if (nextIndex < 0){
            nextIndex = this.ImageSrcList.length - 1;
        }
        this.ImageIndex.SValue = nextIndex;
    };
    PreventingImage(direction: number) : TImageSource {
        let indexPrevent = this.ImageIndex + direction;
        if (indexPrevent >= this.ImageSrcList.length){
            indexPrevent = 0;
        }
        if (indexPrevent < 0){
            indexPrevent = this.ImageSrcList.length - 1;
        }
        const src = this.ImageSrcList[indexPrevent].SValue;
        if (this.ImageCache[src])
            return this.ImagePrevent = {
                Src: src,
                Promise: Promise.resolve(this.ImageCache[src]),
            };
        this.ImagePrevent = {
            Src: src,
            Promise: new Promise((resolve) => {
                let img = new Image();
                img.onload = () => {
                    this.ImageCache[src] = img;
                    resolve(img);
                };
                img.onerror = ()=>{
                    this.ImageCache[src] = ImgNoImage;
                    resolve(ImgNoImage);
                };
                img.src = src;
            })
        };

    };
    GetImage(src: string) : Promise<HTMLImageElement> {
        if (this.ImageCache[src])
            return Promise.resolve(this.ImageCache[src]);
        if (src.indexOf("data:") == 0) {
            let img = new Image();
            img.src = src;
            return Promise.resolve(img);
        }


        this.Load.Show();
        if (this.ImagePrevent.Src === src) {
            this.ImagePrevent.Promise
                .then(() => {
                    this.Load.Hide();
                    return this.ImagePrevent.Promise
                })
            //return Luff.Call(this.ImagePrevent.Promise, {Then: () => this.Load.Hide()});
        }

        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                this.ImageCache[src] = img;
                resolve(img);
                this.Load.Hide();
            };
            img.onerror = ()=>{
                this.ImageCache[src] = ImgNoImage;
                resolve(ImgNoImage);
                this.Load.Hide();
            };
            img.src = src;
        });
    };



    Render() {
        const maxImageHeight = this.props.maxImageHeight ? `--max-image-height: ${this.props.maxImageHeight}px`:'';

        return (
            <div className="l-image-viewer">
                {
                    !this.props.isBuildIn
                    &&
                    <div className="l-close" onClick={() => this.Hide() }/>
                }
                <div className="l-iv-inner">
                    <div className="l-iv-slider">
                        <div className="l-iv-control" onClick={() => this.NextImage(-1)} isVisible={this._IsArrowsVisible} >
                            <div className="l-iv-control-arrow l-iv-control-arrow-left"/>
                        </div>
                        <div className="l-iv-body" name="l-iv-body">
                            <div className="l-iv-image-holder" name="l-iv-image-holder" style={maxImageHeight}/>
                        </div>
                        <div className="l-iv-control" onClick={() => this.NextImage(1)} isVisible={this._IsArrowsVisible} >
                            <div className="l-iv-control-arrow l-iv-control-arrow-right"/>
                        </div>
                    </div>
                    {
                        this.props.isShowPaging
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
            Dialog: this.props.isBuildIn ? void 0 : {
                IsGlobal: true,
            }
        }
    }
}
