export namespace LibraryBlob {
    function DoSave(fileName: string, href: string) : void {
        let a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        a.href = href;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(a.href);
        a.remove();
    }
    export function SaveAs(blob: Blob, fileName: string) : void {
        DoSave(fileName, window.URL.createObjectURL(blob));
    }
    export function SaveAsByBase64(base64Full: string, fileName: string) : void {
        DoSave(fileName, base64Full);
    }
    export function ToBase64(blob: Blob, isRawBase64: boolean = false) : Promise<string> {
        return new Promise( (res, rej)=>{
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                if (isRawBase64)
                    return res((<string>reader.result).split(',')[1]);
                res(<string>reader.result);
            };
            reader.onerror = rej;
        })
    }
    export function ToBase64FromArrayBuffer(bytes: number[], base64Prefix: string = '') : string {
        //base64Prefix: 'data:image/png;base64,'
        let binaryStr = '';
        let len = bytes.length;
        for (let i = 0; i < len; i++) {
            binaryStr += String.fromCharCode(bytes[i]);
        }
        return base64Prefix + window.btoa(binaryStr);
    }
    export function ToByteArrayBuffer(blob: Blob) : Promise<ArrayBuffer> {
        return new Promise( (res, rej) => {
            const reader = new FileReader();

            reader.onloadend = function() {
                res(<ArrayBuffer>reader.result);
            };
            reader.onerror = rej;

            reader.readAsArrayBuffer(blob);
        })
    }
    export function ToByteArrayUInt8(blob: Blob) : Promise<Uint8Array> {
        return ToByteArrayBuffer(blob)
            .then(x => {
                return new Uint8Array(x)
            })
    }
    export function ToBlobFromByteArray(byteArray: number[]) : Blob {
        let bytes = new Uint8Array(byteArray.length);

        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = byteArray[i];
        }

        return new Blob([bytes])
    }
}
