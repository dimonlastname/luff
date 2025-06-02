import {LibraryNumber} from "./Number";
export namespace LibraryString {
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    const _KeyBD = {
        En:[
            'q','w','e','r','t','y','u','i','o','p','[',']',
            'a','s','d','f','g','h','j','k','l',';','\'',
            'z','x','c','v','b','n','m',',','.','/',

            'Q','W','E','R','T','Y','U','I','O','P','{','}',
            'A','S','D','F','G','H','J','K','L',':','"','|',
            'Z','X','C','V','B','N','M','<','>','?'
        ],
            Ru:[
            'й','ц','у','к','е','н','г','ш','щ','з','х','ъ',
            'ф','ы','в','а','п','р','о','л','д','ж','э',
            'я','ч','с','м','и','т','ь','б','ю','.',

            'Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ',
            'Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э', '/',
            'Я','Ч','С','М','И','Т','Ь','Б','Ю',','
        ]
    };
    export function Capitalize(string: string) : string{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /** isIgnoreCase default = false */
    export function Contains(string: string, part: string, isIgnoreCase: boolean = false) : boolean {
        return (isIgnoreCase && string.toLowerCase().indexOf(part.toLowerCase()) > -1) || (string.indexOf(part) > -1)
    }
    export function QuoteScreen(string: string, isHTML: boolean = false) : string {
        if (typeof string !== 'string')
            return string;
        if (isHTML)
            return string.replace(/"/g, '&quot;');
        else
            return string.replace(/"/g, '\"');
    }
    export function ReplaceAsync(string: string, searchValue: RegExp | string, callback: (regex: string, i: number, match: string) => string ) : Promise<string> {
        string = String(string);
        let parts = [],
            i = 0;
        if (Object.prototype.toString.call(searchValue) === "[object RegExp]") {
            const regex: RegExp = searchValue as RegExp;
            if (regex.global)
                regex.lastIndex = i;
            let m;
            while (m = regex.exec(string)) {
                let args = m.concat([m.index, m.input]);
                parts.push(string.slice(i, m.index), callback.apply(null, args));
                i = regex.lastIndex;
                if (!regex.global)
                    break; // for non-global regexes only take the first match
                if (m[0].length === 0)
                    regex.lastIndex++;
            }
        } else {
            searchValue = String(searchValue);
            i = string.indexOf(searchValue);
            parts.push(string.slice(0, i), callback.apply(null, [searchValue, i, string]));
            i += searchValue.length;
        }
        parts.push(string.slice(i));
        return Promise.all(parts).then(function(strings) {
            return strings.join("");
        });
    }
    export function KeyboardSwitch(string: string, langFrom: string ='En', langTo: string ='Ru', isReverseSwitch: boolean = true) : string {
        langFrom = Capitalize(langFrom);
        langTo   = Capitalize(langTo);

        if (!string)
            return '';

        let x = '';
        for (let i = 0; i < string.length; i++){
            let Index = _KeyBD[langFrom].indexOf(string[i]);
            if (Index > -1) {
                x += _KeyBD[langTo][Index];
            }
            else if (Index < 0 && isReverseSwitch) {
                Index = _KeyBD[langTo].indexOf(string[i]);
                x += Index > -1 ? _KeyBD[langFrom][Index] : string[i];
            }
            else if (Index < 0 && !isReverseSwitch){
                x += string[i];
            }
        }
        return x;
    }

    export function Random(strLength: number, isRandomCase: boolean = false) : string {
        let randomString = '';
        for (let i = 0; i < strLength; i++){
            let number = LibraryNumber.GetRandom(35, 0);
            let l = number.toString(36);
            if (isRandomCase && number > 23){
                l = l.toUpperCase()
            }
            randomString += l;
        }
        return randomString;
    }
    export function GetTextWidth(text: string, fontname: string = '', fontsize: string = '') : number {
        if(this.canvas === undefined){
            this.canvas = document.createElement('canvas');
            this.canvasCtx = this.canvas.getContext('2d');
        }
        this.canvasCtx.font = fontsize + ' ' + fontname;
        return this.canvasCtx.measureText(text).width;
    }

    export function IsTextIncludes(searchText: string, searchWhereText: string, isKeyBoardSwitch : boolean = true) : boolean {
        const text = searchText.toLowerCase();
        if (isKeyBoardSwitch) {
            const textAlt = KeyboardSwitch(text);
            return text.length === 0 || searchWhereText.toLowerCase().includes(text) || searchWhereText.toLowerCase().includes(textAlt);
        }
        return text.length === 0 || searchWhereText.toLowerCase().includes(text);
    }

    export function SortPredicate(valueA: string, valueB: string) : number {
        if (valueA && valueA.localeCompare) { //if string and ok browser
            return collator.compare(valueA, valueB);
        }
        if (valueA > valueB)
            return 1;
        else if (valueA < valueB)
            return -1;
        return 0;
    }

    export class DummyTextGen {
        private static Words = [
            "давным", "данные", "приехал", "товариши", "немыслимые", "привет",
            "в", "в", "над", "под", "вместе", "как-то", "никогда",
            "десять", "два", "однако", "яблок", "квинтессенция", "зачем",
            "крышка", "конструктивно", "один", "шерсти", "не", "никак",
            "каких-то", "марафон", "красивый", "весёлый", "потрясающего", "разумно",
            "придумывающий", "смотрящий", "рисующего", "рассматриваемый", "поликарбонатный", "библиотечная",
            "рынка", "свободная", "искать", "ищет", "делает", "пользуется",
            "пишет", "звонит", "собирает", "чтобы", "по этому", "кстати", "чайников",
            "информационный", "письменный", "действует", "чтения", "среди", "удаляет",
            //"", "", "", "", "", "",
        ];
        private static GetWord() {
            const words = DummyTextGen.Words;
            return words[Math.floor(Math.random() * words.length)];
        }
        public static Generate(length: number) : string {
            const words = DummyTextGen.Words;

            let sentenceLength = 0;


            let text = "";
            for (let i = 0; i < length; i++) {
                sentenceLength++;
                let nextWord = DummyTextGen.GetWord();
                if (i == 0) {
                    nextWord = Capitalize(nextWord);
                }
                if (sentenceLength > 7 && LibraryNumber.GetRandom(100) > 50 && (i + 7 < length)) {
                    let sentenceEnd = ".";
                    let lastWord = nextWord;
                    if (lastWord.length < 3) {
                        lastWord = DummyTextGen.GetWord();
                        while (lastWord.length < 3){
                            lastWord = `${lastWord} ${DummyTextGen.GetWord()}`;
                            i++;
                        }
                        nextWord = Capitalize(nextWord);
                    }
                    text += ` ${lastWord}.`;
                    nextWord = Capitalize(nextWord);
                    sentenceLength = 0;
                }

                text += (i != 0 ? " ": "") + nextWord;
            }

            return text;
        }
    }
}