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
        /** Существительные (им. п.), подходят как подлежащее или дополнение */
        private static readonly Nouns = [
            "система", "модуль", "проект", "сервис", "интерфейс", "пользователь", "документ",
            "данные", "таблица", "форма", "список", "окно", "панель", "отчёт", "задача",
            "версия", "файл", "запись", "параметр", "результат", "сообщение", "ошибка", "команда",
            "приложение", "библиотека", "компонент", "виджет", "контейнер", "ресурс", "процесс",
            "поток", "сессия", "транзакция", "метод", "класс", "объект", "структура", "модель",
            "элемент", "строка", "столбец", "ячейка", "значение", "ключ", "токен", "запрос",
            "ответ", "страница", "раздел", "разметка", "шаблон", "стиль", "тема", "стек",
            "очередь", "кластер", "узел", "сервер", "клиент", "шлюз", "канал", "пакет",
            "фреймворк", "архитектура", "слой", "схема", "политика", "роль", "профиль",
            "база данных", "индекс", "кеш", "буфер", "лог", "архив", "резервная копия",
            "сборка", "релиз", "патч", "коммит", "ветка", "фича", "багфикс", "тест-кейс",
            "ребёнок", "родитель", "наследник", "корень", "лист", "вершина", "граф",
            "секция", "вкладка", "меню", "кнопка", "иконка", "подсказка", "уведомление",
            "подписка", "права", "группа", "организация", "отдел", "процедура", "скрипт",
            "хук", "плагин", "расширение", "модификатор", "флаг", "бит", "байт", "хэш",
            "человек", "семья", "друг", "сосед", "гость", "коллега", "начальник", "учитель",
            "день", "ночь", "утро", "вечер", "время", "минута", "час", "неделя", "месяц", "год",
            "весна", "лето", "осень", "зима", "погода", "солнце", "дождь", "снег", "ветер", "небо",
            "море", "река", "озеро", "лес", "поле", "гора", "пляж", "парк", "сад", "улица",
            "город", "деревня", "дом", "квартира", "комната", "кухня", "двор", "лестница",
            "дорога", "мост", "остановка", "площадь", "рынок", "магазин", "кафе", "ресторан",
            "работа", "отдых", "каникулы", "праздник", "вечеринка", "свадьба", "родители",
            "детство", "мечта", "мысль", "чувство", "голос", "тишина", "музыка", "песня", "танец",
            "книга", "рассказ", "стих", "театр", "кино", "картина", "фото", "цветок", "дерево",
            "трава", "камень", "песок", "огонь", "вода", "еда", "хлеб", "суп", "чай", "кофе",
            "собака", "кошка", "птица", "рыба", "лошадь", "корова", "заяц", "медведь",
            "одежда", "платье", "пальто", "обувь", "шапка", "сумка", "кошелёк", "деньги",
            "игрушка", "мяч", "коньки", "лыжи", "велосипед", "машина", "автобус", "трамвай",
        ];
        /** Глаголы в 3 л. наст. — после подлежащего */
        private static readonly Verbs = [
            "работает", "создаёт", "отображает", "сохраняет", "обновляет", "получает",
            "отправляет", "проверяет", "фильтрует", "сортирует", "удаляет", "импортирует",
            "экспортирует", "настраивает", "загружает", "выгружает", "обрабатывает", "кэширует",
            "выполняет", "запускает", "останавливает", "перезапускает", "блокирует", "разблокирует",
            "соединяет", "разъединяет", "слушает", "ожидает", "повторяет", "пропускает", "отменяет",
            "подключается", "отключается", "авторизуется", "регистрируется", "логирует",
            "сериализует", "десериализует", "парсит", "валидирует", "инициализирует",
            "закрывает", "открывает", "расшифровывает", "шифрует", "подписывает", "верифицирует",
            "строит", "вычисляет", "пересчитывает", "копирует", "вырезает", "вставляет", "заменяет",
            "склеивает", "делит", "группирует", "распределяет", "балансирует", "масштабируется",
            "сжимается", "распаковывается", "архивирует", "восстанавливается", "мигрирует",
            "переименовывает", "перемещает", "назначает", "снимает", "повышает", "ограничивает",
            "агрегирует", "нормализует", "сопоставляет", "сводит", "разворачивает", "сворачивает",
            "мониторит", "профилирует", "сэмплирует", "трассирует", "отлаживается", "переключается",
            "живёт", "идёт", "бежит", "сидит", "лежит", "спит", "ест", "пьёт", "готовит", "моет",
            "видит", "слышит", "чувствует", "думает", "грезит", "верит", "сомневается", "надеется",
            "забывает", "помнит", "молчит", "говорит", "шепчет", "кричит", "смеётся", "плачет",
            "любит", "обижается", "прощает", "ждёт", "торопится", "опаздывает", "возвращается",
            "уезжает", "приезжает", "приходит", "уходит", "заходит", "выходит",
            "жарит", "варит", "печёт", "режет", "мешает", "помогает", "учит", "учится", "читает",
            "пишет", "рисует", "поёт", "танцует", "играет", "гуляет", "ловит", "бросает",
            "берёт", "дарит", "просит", "благодарит", "хвалит", "ругает", "спорит", "соглашается",
            "покупает", "продаёт", "торгуется", "платит", "считает", "мечтает", "будит", "засыпает",
            "зевает", "тянется", "заряжается", "разряжается",
        ];
        private static readonly Adjectives = [
            "новый", "быстрый", "удобный", "важный", "полный", "текущий", "выбранный",
            "доступный", "основной", "корректный", "стабильный", "гибкий", "простой",
            "надёжный", "актуальный", "внешний", "внутренний", "локальный", "общий",
            "урезанный", "расширенный", "унаследованный", "виртуальный", "эффективный",
            "безопасный", "уязвимый", "закрытый", "открытый", "пустой", "ненулевой",
            "единственный", "множественный", "параллельный", "последовательный",
            "синхронный", "асинхронный", "активный", "пассивный", "включённый", "выключенный",
            "явный", "неявный", "публичный", "приватный", "временный", "постоянный",
            "критический", "низкий", "высокий", "оптимальный", "минимальный", "максимальный",
            "средний", "ранний", "поздний", "угловой", "типовой", "кастомный", "совместимый",
            "обратимый", "необратимый", "повторный", "первый", "следующий", "прикладной",
            "служебный", "боевой", "тестовый", "заготовленный", "разрешённый", "запрещённый",
            "устаревший", "экспериментальный", "предварительный", "финальный",
            "тёплый", "холодный", "светлый", "тёмный", "мягкий", "жёсткий", "густой", "редкий",
            "большой", "маленький", "длинный", "короткий", "широкий", "узкий", "тонкий",
            "красивый", "милый", "забавный", "грустный", "весёлый", "злой", "добрый", "ласковый",
            "строгий", "спокойный", "нервный", "сонный", "бодрый", "голодный", "сытый", "жадный",
            "щедрый", "честный", "хитрый", "глупый", "умный", "смелый", "трусливый", "сильный",
            "слабый", "здоровый", "больной", "усталый", "свежий", "вялый", "молодой", "старый",
            "чистый", "грязный", "ровный", "кривой", "гладкий", "шероховатый", "мокрый", "сухой",
            "праздничный", "будничный", "домашний", "уличный", "звонкий", "глухой",
        ];
        private static readonly Adverbs = [
            "быстро", "корректно", "постепенно", "автоматически", "регулярно", "параллельно",
            "последовательно", "немедленно", "частично", "полностью", "визуально", "логически",
            "тихо", "громко", "строго", "мягко", "грубо", "аккуратно", "приблизительно",
            "точно", "грубо говоря", "по факту", "иногда", "часто", "редко", "всегда",
            "никогда", "вдруг", "вновь", "снова", "заранее", "затем", "далее", "впоследствии",
            "одновременно", "независимо", "явно", "неявно", "косвенно", "напрямую",
            "локально", "удалённо", "бесшовно", "прозрачно", "надёжно", "стабильно",
            "динамически", "статически", "оперативно", "раньше", "позже", "сразу", "вовремя",
            "вчера", "сегодня", "завтра", "теперь", "потом", "здесь", "там", "везде", "редко где",
            "очень", "чуть", "едва", "весьма",             "слишком", "вдосталь", "дома", "вполголоса",
            "охотно", "неохотно", "радостно", "горько", "мило", "вежливо", "нетерпеливо",
            "без умолку", "вслух", "про себя", "случайно", "нарочно", "еле", "ровно",
        ];
        /** Союзы, предлоги, частицы — «клей» между смысловыми группами */
        private static readonly Glue = [
            "и", "или", "в", "на", "для", "при", "с", "без", "к", "ко", "о", "об", "у", "из",
            "под", "над", "перед", "через", "вокруг", "внутри", "вне", "около", "после",
            "до", "вместо", "вопреки", "вследствие", "благодаря", "согласно",
            "между", "среди", "вроде", "как", "чем", "хотя", "пускай", "ежели",
            "также", "тоже", "уже", "ещё", "не", "ни", "только", "лишь", "даже", "всё же",
            "если", "когда", "пока", "раз", "чтобы", "дабы", "однако", "зато", "кстати",
            "поэтому", "иначе", "итак", "впрочем", "между тем", "тем не менее", "в частности",
            "будто", "словно", "например", "скажем", "типа", "дескать", "мол", "вестимо", "подобно",
        ];

        private static pick(pool: readonly string[], avoid: string | null): string {
            const n = pool.length;
            if (n === 0)
                return "";
            let w = pool[LibraryNumber.GetRandom(n - 1, 0)];
            let guard = 0;
            while (avoid !== null && w === avoid && guard++ < 24) {
                w = pool[LibraryNumber.GetRandom(n - 1, 0)];
            }
            return w;
        }

        /** Простое смещение по роли внутри предложения: подлежащее → группа → глагол → дополнение → обстоятельство → связка */
        private static pickWord(sentencePos: number, avoid: string | null): string {
            const r = sentencePos % 6;
            if (r === 0)
                return DummyTextGen.pick(
                    LibraryNumber.GetRandom(100) < 52 ? DummyTextGen.Adjectives : DummyTextGen.Nouns,
                    avoid
                );
            if (r === 1)
                return DummyTextGen.pick(
                    LibraryNumber.GetRandom(100) < 78 ? DummyTextGen.Nouns : DummyTextGen.Adjectives,
                    avoid
                );
            if (r === 2)
                return DummyTextGen.pick(DummyTextGen.Verbs, avoid);
            if (r === 3)
                return DummyTextGen.pick(DummyTextGen.Nouns, avoid);
            if (r === 4)
                return DummyTextGen.pick(
                    LibraryNumber.GetRandom(100) < 55 ? DummyTextGen.Adverbs : DummyTextGen.Nouns,
                    avoid
                );
            return DummyTextGen.pick(DummyTextGen.Glue, avoid);
        }

        public static Generate(length: number): string {
            if (length <= 0)
                return "";
            const minWords = 6;
            const maxWords = 14;
            const parts: string[] = [];
            let sentencePos = 0;
            let prev: string | null = null;

            for (let i = 0; i < length; i++) {
                let w = DummyTextGen.pickWord(sentencePos, prev);
                if (sentencePos === 0)
                    w = Capitalize(w);
                parts.push(w);
                prev = w;
                sentencePos++;

                const wordsLeft = length - i - 1;
                const canBreak = wordsLeft > 0 && sentencePos >= minWords;
                const mustBreak = sentencePos >= maxWords;
                const randomBreak = canBreak && !mustBreak && LibraryNumber.GetRandom(100) > 67;
                if (mustBreak || randomBreak) {
                    const last = parts[parts.length - 1];
                    parts[parts.length - 1] = last.replace(/[.,]$/, "") + ".";
                    sentencePos = 0;
                    prev = null;
                }
            }

            let text = parts.join(" ");
            if (!/\.\s*$/.test(text))
                text = text.replace(/[.,]$/, "") + ".";
            return text;
        }
    }
}