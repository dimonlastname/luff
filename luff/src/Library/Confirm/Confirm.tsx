
import "./Confirm.scss";
import {Culture} from "../Culture/Culture";

class TConfirmOptions {
    Error?: boolean;
    CaptionColor?: string;
    CaptionBackground?: string;
    ButtonAgreeText?: string;
    ButtonCancelText?: string;
    OnAgree?: () => void;
    OnCancel?: () => void;
    Wrapper?: boolean;
    constructor(){
        this.Error =  false;
        this.CaptionColor =  '';
        this.CaptionBackground =  '';
        this.ButtonAgreeText =  Culture.Current.Lang.Ok;
        this.ButtonCancelText =  Culture.Current.Lang.Cancel;
        this.OnAgree = () => {};
        this.OnCancel = void 0;
        this.Wrapper = true;
    }
}
class TConfirmOptionsPromise extends TConfirmOptions {
    OnAgree?: () => Promise<any>;
    OnCancel?: () => Promise<any>;
}
export function luffConfirm(Caption: string  = "Achtung", Message: string = '', options?: TConfirmOptions)  {
    if (!options)
        options = new TConfirmOptions();
    else
        options = {
            ...new TConfirmOptions(),
            ...options,
        };
    (document.activeElement as HTMLElement).blur();
    //let zIndex = DialogManager.GetZIndex();

    let dialog = document.createElement('div');
    dialog.classList.add('l-confirm-dialog');

    // if (Luff.Settings.DialogAnimation)
    //     dialog.classList.add(Luff.Settings.DialogAnimation);

    //# title
    let title = document.createElement("div");
    title.classList.add('cd-caption');
    title.innerHTML = Caption;
    title.style.color = options.CaptionColor;
    title.style.background = options.CaptionBackground;
    dialog.appendChild(title);

    //# message field
    let msg = document.createElement("div");
    msg.classList.add('cd-text');
    msg.innerHTML = Message;
    dialog.appendChild(msg);

    //# buttonfield
    let buttons = document.createElement("div");
    buttons.classList.add("cd-buttons");
    dialog.appendChild(buttons);

    //# button confirm
    let btnOk = document.createElement("div");
    btnOk.classList.add("l-button", "button", "cd-button", "btn-diag-confirm");
    btnOk.innerHTML = options.ButtonAgreeText;
    btnOk.onclick = function(){
        if (options.OnAgree !== null && options.OnAgree !== void 0)
            options.OnAgree();
        //DialogManager.Remove(dialog);
        wrap.remove();
        dialog.remove();

    };
    dialog.getElementsByClassName("cd-buttons")[0].appendChild(btnOk);

    //# button cancel
    if (options.OnCancel)
    {
        let btnCancel = document.createElement("div");
        btnCancel.classList.add("l-button", "button", "cd-button", "btn-diag-cancel");
        btnCancel.innerHTML = options.ButtonCancelText;
        btnCancel.onclick = function(){
            if (options.OnCancel)
                options.OnCancel();
            //DialogManager.Remove(dialog);
            wrap.remove();
            dialog.remove();
        };
        dialog.getElementsByClassName("cd-buttons")[0].appendChild(btnCancel);
    }
    //### Dialog-Wrapper
    let wrap = document.createElement("div");
    wrap.classList.add('l-confirm-dialog-wrapper');

    //wrap.style.zIndex = zIndex.toString();
    //dialog.style.zIndex = zIndex.toString();
    //DialogManager.Add(dialog);
    if (options.Wrapper)
        document.body.appendChild(wrap);
    document.body.appendChild(dialog);
}


export function luffConfirmPromise(caption: string, message: string, options: TConfirmOptions) : Promise<any> {
    return new Promise( (resolve, reject) => {
        luffConfirm(caption, message, {
            ...options,
            OnAgree(){
                resolve(options.OnAgree())
            },
            OnCancel: () => resolve(options.OnCancel ? options.OnCancel(): ''),
        })
    })
}
