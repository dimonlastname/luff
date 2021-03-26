import {ContentTypes, IContent} from "../IContent";

import {LibraryString} from "../../../Library/String";
import {LibraryCSS} from "../../../Library/CSS";

import './Dialog.scss';

type TDialogToolsWrap = {
    HtmlElement: HTMLElement,
    BeforeShowDialog: () => void,
    HideDialog: () => void,
    AnimationDurationShow: number,
    AnimationDurationHide: number,
}
type TDialogWrap = {
    Element: HTMLElement;
    ElementAnimate: HTMLElement;
    WrapperBG: HTMLElement;
}

export class DialogTools {
    static Container : HTMLElement = document.body;
    static GetDialogParams(dialogParams: ContentTypes.Dialog, ctx: IContent) {
        dialogParams = {
            HasWrapper: true,
            HasWrapperBG: true,
            HasWrapperHandle: true,
            IsHideOnOutsideClick: false,
            IsGlobal: false,
            OnOutsideClick: null,
            OnWrapperClick: (e) => ctx.Hide(),
            ...dialogParams,
        };
        if (dialogParams.Animation !== null){
            dialogParams = {
                ...dialogParams,
                Animation: {
                    Show: 'l-animation_dialog-show',
                    Hide: 'l-animation_dialog-hide',
                    ...dialogParams.Animation,
                },
            }
        }
        return dialogParams;
    }
    static GetDialogWrap(dialogParams: ContentTypes.Dialog, ctx: IContent, /*htmlElement: HTMLElement*/) : TDialogWrap {
        let dialogWrap : TDialogWrap = {
            Element: ctx.DOM,
            ElementAnimate: ctx.DOM,
            WrapperBG: void 0,
        };
        if (!dialogParams.HasWrapper)
            return dialogWrap;

        let wrapped = document.createElement('div');

        wrapped.classList.add('l-dialog-wrapper');
        if (dialogParams.IsGlobal) {
            wrapped.classList.add('l-global');
        }
        if (dialogParams.HasWrapperBG) {
            let wrapperBG = document.createElement('div');
            wrapperBG.classList.add('l-dialog-wrapper-bg');
            let innerContent = document.createElement('div');
            innerContent.classList.add('l-dialog-wrapper-content');
            if (ctx.DOM instanceof Element) {
                innerContent.appendChild(ctx.DOM);
            }
            else {
                let childrenDOM = ctx.GetChildrenDomElements();
                for (let c of childrenDOM) {
                    innerContent.appendChild(c);
                }
                for (let c of ctx.Children) {
                    c._TargetDOM = innerContent;
                }
            }




            wrapped.appendChild(wrapperBG);
            wrapped.appendChild(innerContent);
            if (dialogParams.HasWrapperHandle) {
                wrapperBG.addEventListener('click', dialogParams.OnWrapperClick.bind(ctx) );
            }
            dialogWrap.WrapperBG = wrapperBG;
            dialogWrap.ElementAnimate = innerContent;
        }
        dialogWrap.Element = wrapped;
        return dialogWrap;
    }

    static WrapDialogOld(dialogParams: ContentTypes.Dialog, ctx: IContent, /*htmlElement: HTMLElement*/) : TDialogToolsWrap {
        let htmlElement = ctx.DOM;
        let wrapped = ctx.DOM;
        let w : TDialogToolsWrap = {
            HtmlElement: wrapped,
            BeforeShowDialog: void 0,
            HideDialog: void 0,
            AnimationDurationShow: 0,
            AnimationDurationHide: 0,
        };
        let timeoutShow: number;
        let timeoutHide: number;
        if (dialogParams.Animation !== null) {
            w.AnimationDurationShow = LibraryCSS.GetDurationAnimation(dialogParams.Animation.Show);
            w.AnimationDurationHide = LibraryCSS.GetDurationAnimation(dialogParams.Animation.Hide);
        }
        if (dialogParams.HasWrapper) {
            wrapped = document.createElement('div');
            wrapped.classList.add('l-dialog-wrapper');
            if (dialogParams.IsGlobal) {
                wrapped.classList.add('l-global');
            }
            if (dialogParams.HasWrapperBG) {
                let wrapperBG = document.createElement('div');
                wrapperBG.classList.add('l-dialog-wrapper-bg');
                //wrapperBG.addEventListener('click', (e) => dialogParams.OnWrapperClick(e));
                let innerContent = document.createElement('div');
                innerContent.classList.add('l-dialog-wrapper-content');
                innerContent.appendChild(htmlElement);
                // if (dialogParams.Animation && dialogParams.Animation.Show)
                //     innerContent.classList.add('l-animation_dialog-show');
                wrapped.appendChild(wrapperBG);
                wrapped.appendChild(innerContent);
                if (dialogParams.HasWrapperHandle) {
                    wrapperBG.addEventListener('click', dialogParams.OnWrapperClick );
                }
                w.HtmlElement = wrapped;


                //console.log('w.AnimationDurationShow', w.AnimationDurationShow, 'w.AnimationDurationHide', w.AnimationDurationHide);
                w.BeforeShowDialog = () => {
                    if (dialogParams && dialogParams.Animation){
                        innerContent.classList.remove(dialogParams.Animation.Hide);
                        wrapperBG.style.display = '';
                        if (dialogParams.Animation.Show){
                            innerContent.classList.add(dialogParams.Animation.Show);
                        }
                        //window.clearTimeout(timeoutShow);
                        // timeoutShow = window.setTimeout(() => {
                        //     wrapped.style.display = '';
                        // }, w.AnimationDurationShow)
                    }
                    wrapped.style.display = '';
                };
                w.HideDialog = () => {
                    if (dialogParams && dialogParams.Animation){
                        innerContent.classList.remove(dialogParams.Animation.Show);
                        wrapperBG.style.display = 'none';
                        if (dialogParams.Animation.Hide){
                            innerContent.classList.add(dialogParams.Animation.Hide);
                        }
                        window.clearTimeout(timeoutHide);
                        timeoutHide = window.setTimeout(() => {
                            wrapped.style.display = 'none';
                            ctx.DOM.remove();
                        }, w.AnimationDurationHide)
                    } else {
                        wrapped.style.display = 'none';
                    }
                };
            }
            return w;
        }
        w.BeforeShowDialog = () => {
            if (dialogParams && dialogParams.Animation){
                wrapped.classList.remove(dialogParams.Animation.Hide);

                if (dialogParams.Animation.Show){
                    htmlElement.classList.add(dialogParams.Animation.Show);
                }
                //window.clearTimeout(timeoutShow);
                // timeoutShow = window.setTimeout(() => {
                //     wrapped.style.display = '';
                // }, w.AnimationDurationShow)
            }
            wrapped.style.display = '';
        };
        w.HideDialog = () => {
            if (dialogParams && dialogParams.Animation){
                wrapped.classList.remove(dialogParams.Animation.Show);

                if (dialogParams.Animation.Hide){
                    wrapped.classList.add(dialogParams.Animation.Hide);
                }
                window.clearTimeout(timeoutHide);
                timeoutHide = window.setTimeout(() => {
                    wrapped.style.display = 'none';
                }, w.AnimationDurationHide)
            } else {
                wrapped.style.display = 'none';
            }
        };

        return w;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    //console.log('DialogTools DOMContentLoaded');
    DialogTools.Container = document.createElement('div');
    DialogTools.Container.id = 'l-dialogContainer-' + LibraryString.Random(10);

    document.body.appendChild(DialogTools.Container);
});