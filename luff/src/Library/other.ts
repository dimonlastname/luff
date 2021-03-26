let _GetIDCounter = 0;
export function GetID() : number {
    _GetIDCounter++;
    return _GetIDCounter;
}
export function GetLastID() : number{
    return _GetIDCounter;
}


interface PromiseWrapCallbacks<T> {
    Then?: (res: T) => void;
    Catch?: (error?: string) => void;
    Finally?: (res?: T) => void;
    BeforeCall?: (request?: XMLHttpRequest) => void;
}

function PromiseWrap<T>(promise: Promise<T>, handlers: PromiseWrapCallbacks<T> = {} ) : Promise<T> {
    return promise
        .then(function(x){
            handlers.Then ? handlers.Then(x): null;
            handlers.Finally ?  handlers.Finally(x) : null;
            return promise;
        })
        .catch(function(x){
            handlers.Catch ? handlers.Catch(x): console.error('[api.call]', x);
            // eslint-disable-next-line no-unused-expressions
            handlers.Finally ?  handlers.Finally(x) : null;
            return promise;
        });
}

////////////////
type TFilePickerCtor = {
    Accept?: string;
    OnChange?: CallbackFileChange;
    IsMultiple?: boolean;
}
type CallbackFileChange = (files: File[]) => void; 

export class FilePicker {
    InputFile: HTMLInputElement;
    CtorOnChange: CallbackFileChange;
    ParamOnChange: CallbackFileChange;

    Run(onChange?: CallbackFileChange) {
        this.ParamOnChange = onChange;
        this.InputFile.click();
    }
    constructor(ctor: TFilePickerCtor = {}) { 
        this.InputFile = document.createElement('input');
        this.InputFile.setAttribute('type', 'file');
        if (ctor.Accept)
            this.InputFile.setAttribute('accept', ctor.Accept);
        if (ctor.IsMultiple){
            this.InputFile.setAttribute('multiple', 'multiple');
        }

        this.InputFile.addEventListener('change', () => {
            const files = Array.from(this.InputFile.files);
            this.InputFile.value = '';
            if (this.ParamOnChange)
            {
                this.ParamOnChange(files);
                return;
            }
            if (this.CtorOnChange)
                this.CtorOnChange(files);
        });
        this.CtorOnChange = ctor.OnChange
    }
}