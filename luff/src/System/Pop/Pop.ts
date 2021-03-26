import './Pop.scss';

type TPopDefaults = {
    AnimationDuration: number;
    Duration: number;
}
type TPopCtor = {
    Target?: HTMLElement;
    AnimationDuration?: number;
    Duration?: number;
    Style?: any;
    isNewInstance?: boolean;
}
type TShowMessageOptions = {
    Duration?: number;
    LogItem?: any;
}
let popLogInstanceCounter = 0;
function createElementFromString(string: string, ownerTagName: string = "div"): HTMLElement {
    let documentFragment = document.createDocumentFragment();
    let containerElement = document.createElement(ownerTagName);
    containerElement.innerHTML = string;
    while (containerElement.childNodes[0]) {
        documentFragment.appendChild(containerElement.childNodes[0]);
    }
    return <HTMLElement>Array.from(documentFragment.childNodes).find(x => x.nodeName.indexOf('text') < 0);
}

export class PopLog {
    static DefaultSettings : TPopDefaults = {
        AnimationDuration: 200,
        Duration: 5000,
    };
    static RegexLink = new RegExp(`\\[link=([\\s\\S]*?);?(title=([\\s\\S]*?))?\\]`, 'g');
    static ParseLink(text){
        if (!text.replace)
            return text;
        return text.replace(PopLog.RegexLink, (m, link, c, capt)=>{
            //return text.replace(m, `<a class="a" href="${link}">${capt?capt:link}</a>`);
            return `<a class="a" href="${link}">${capt?capt:link}</a>`

        })
    }
    private readonly _AnimationDuration: number;
    private readonly _Duration: number;
    private readonly _Block: HTMLElement;

    private _AddLine(text: string, type: string = '', opt : TShowMessageOptions = {}) : void {
        text = PopLog.ParseLink(text);
        text = text.replace(/\n/g, '<br>');
        const animationDuration = this._AnimationDuration;
        const duration = opt.Duration === void 0 ? this._Duration : opt.Duration;

        // noinspection CssInvalidPropertyValue
        const templateDefault = `<div class="l-pop-log ${type}" style="transition-duration: ${animationDuration}ms;">
                                    <div class="l-pop-log__close"></div>
                                    <div class="l-pop-log__text">${text}</div>  
                                    <div class="l-pop-log__life" style="transition-duration: ${duration}ms;"></div>
                                 </div>`;
        const div = createElementFromString(templateDefault);
        const lifeLine    = <HTMLElement>div.querySelector('.l-pop-log__life');
        const buttonClose = <HTMLElement>div.querySelector('.l-pop-log__close');
        buttonClose.addEventListener('click', () => {
            clearTimeout(destroyTimeout);
            div.style.opacity = '0';
            setTimeout(() => {
                div.remove();
            }, Math.round(animationDuration))
        });

        let destroyTimeout = setTimeout(()=>{
            div.style.opacity = '0';
            setTimeout(()=>{
                div.remove();
            }, animationDuration)
        }, duration);
        div.addEventListener('mouseover', ()=>{
            lifeLine.style.width = lifeLine.clientWidth + 'px';
            clearTimeout(destroyTimeout);
        });
        div.addEventListener('mouseleave', ()=>{
            const wp = div.clientWidth;
            const w = lifeLine.clientWidth;
            const TimeToDestroy = Math.round(w/wp * duration);
            lifeLine.style.width = '0';
            lifeLine.style.transitionDuration = TimeToDestroy + 'ms';
            destroyTimeout = setTimeout(()=>{
                div.style.opacity = '0';
                setTimeout(()=>{
                    div.remove();
                }, Math.round(animationDuration))
            }, TimeToDestroy)
        });
        ///
        this._Block.appendChild(div);
        div.style.opacity = '1';
        setTimeout(function () {
            lifeLine.style.width = '0';
        }, 50);
    };
    constructor({
                    Target            = document.body,
                    AnimationDuration = PopLog.DefaultSettings.AnimationDuration,
                    Duration          = PopLog.DefaultSettings.Duration,
                    Style             = {},
                    isNewInstance = false,
                } : TPopCtor = {}){
        popLogInstanceCounter++;
        this._AnimationDuration = AnimationDuration;
        this._Duration = Duration;
        if (!isNewInstance){
            this._Block = document.querySelector('#l-pop-log-hook-1');
        }
        if (isNewInstance || this._Block === null){
            this._Block = createElementFromString(`<div class="l-pop-log-hook" id="l-pop-log-hook-${popLogInstanceCounter}"></div>`);
        }
        Target.appendChild(this._Block);
    }
    Success(text: string, opt : TShowMessageOptions = {}){
        this._AddLine(text, 'success', opt);
        if (opt.LogItem) {
            console.log(opt.LogItem);
        }
    }
    // Success2(message: React.ReactNode) {
    //     console.log('yeah');
    // }
    Error(text: string, opt: TShowMessageOptions = {}){
        this._AddLine(text, 'error', opt);
        console.error(opt.LogItem? opt.LogItem : text);
    }
    Warn(text: string, opt: TShowMessageOptions = {}){
        this._AddLine(text, 'warning', opt);
        console.warn(opt.LogItem? opt.LogItem : text);
    }
    Notice(text: string, opt: TShowMessageOptions = {}){
        this._AddLine(text, 'notice', opt);
        if (opt.LogItem)
            console.log(opt.LogItem)
    }
    // ShowSuccess(text: string){
    //     this._AddLine(text, 'success');
    // }
    // ShowError(text: string){
    //     this._AddLine(text, 'error');
    // }
    // ShowWarn(text: string){
    //     this._AddLine(text, 'warning');
    // }
    // ShowNotice(text: string){
    //     this._AddLine(text, 'notice');
    // }
}

let luffPop = new PopLog();
export {luffPop};