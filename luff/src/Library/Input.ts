interface ILibraryInput {
    GetCursorPosition(input: HTMLInputElement | Element):any;
}
type TPos = {
    Start: number;
    End: number
}

export namespace LibraryInput {
    export function GetCursorPosition(input: HTMLInputElement | Element) : TPos{
        let pos = {
            Start: -1,
            End: -1
        };
        let inputElement = <HTMLInputElement>input;
        let textElement = <HTMLInputElement>input;
        if (inputElement && document.activeElement === input) {
            pos.Start = inputElement.selectionStart;
            pos.End   = inputElement.selectionEnd;
        }
        else if (document.createRange) {
            //TODO
            // let Range = document.createRange();
            // Range.moveToBookmark(sel.getBookmark());
            // for (let len = 0; Range.compareEndPoints("EndToStart", Range) > 0; Range.moveEnd("character", -1))
            // {
            //     len++;
            // }
            // Range.setEndPoint("StartToStart", input.createTextRange());
            // while(Range.compareEndPoints("EndToStart", rng) > 0){
            //     Pos.Start++;
            //     Pos.End++;
            //     Range.moveEnd("character", -1)
            // }
        }
        return pos;
    }
}
