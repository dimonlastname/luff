import {Dict} from "../../interfaces";

type CultureType = {
    Dict: Dict<CultureInfoType>
    Current: CultureInfoType;
}
type CultureInfoType = {
    Lang: CultureInfoLangType;
    DateFormat: string;
    DateFormatTime: string;
    DateFormatFull: string;
    MonthNames: string[];
    MonthNamesInclined: string[];
    MonthNamesShort: string[];
    WeekDays: string[];
    WeekDaysShort: string[];
    MonthDict: Dict<number>;
}
type CultureInfoLangType = {
    Change: string;
    Remove: string;
    GetMore: string;
    GetAll: string;
    Refresh: string;
    YouHaveNoPermission: string;
    Ok: string;
    Cancel: string;
    ListEmpty: string;
    SelectEmpty: string;
    ChoosePeriod: string;
}
let CultureInfo: Dict<CultureInfoType> = {
    'ru-Ru': {
        Lang: {
            Change: 'Изменить',
            Remove: 'Удалить',
            GetMore: 'Загрузить еще',
            GetAll: 'Загрузить все',
            Refresh: 'Обновить',
            YouHaveNoPermission: 'Недостаточно прав',
            Ok: 'Ок',
            Cancel: 'Отмена',
            ListEmpty: 'нет элементов для отображения',
            SelectEmpty: 'Не выбрано',
            ChoosePeriod: 'Выберите период'
        },
        DateFormat: 'DD.MM.YYYY',
        DateFormatTime: 'HH:mm:ss',
        DateFormatFull: 'DD.MM.YYYY HH:mm:ss',
        MonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        MonthNamesInclined: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
        MonthNamesShort: ["янв.", "фев.", "мар.", "апр.", "май", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек."],
        WeekDays: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
        WeekDaysShort: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
        MonthDict: {
            ["январь"]: 0,
            ["февраль"]: 1,
            ["март"]: 2,
            ["апрель"]: 3,
            ["май"]: 4,
            ["июнь"]: 5,
            ["июль"]: 6,
            ["август"]: 7,
            ["сентябрь"]: 8,
            ["октябрь"]: 9,
            ["ноябрь"]: 10,
            ["декабрь"]: 11,
            ["января"]: 0,
            ["февраля"]: 1,
            ["марта"]: 2,
            ["апреля"]: 3,
            ["мая"]: 4,
            ["июня"]: 5,
            ["июля"]: 6,
            ["августа"]: 7,
            ["сентября"]: 8,
            ["октября"]: 9,
            ["ноября"]: 10,
            ["декабря"]: 11,
            ["янв"]: 0,
            ["фев"]: 1,
            ["мар"]: 2,
            ["апр"]: 3,
            //["май"]: 4,
            ["июн"]: 5,
            ["июл"]: 6,
            ["авг"]: 7,
            ["сен"]: 8,
            ["окт"]: 9,
            ["ноя"]: 10,
            ["дек"]: 11
        }
    },
    'en-Us':{
        Lang: {
            Change: 'Change',
            Remove: 'Remove',
            GetMore: 'Get more',
            GetAll: 'Get all',
            Refresh: 'Refresh',
            YouHaveNoPermission: 'You have no permission',
            Ok: 'Ok',
            Cancel: 'Cancel',
            ListEmpty: 'list empty',
            SelectEmpty: 'Not chosen',
            ChoosePeriod: 'Choose period'
        },
        DateFormat: 'MM.DD.YYYY',
        DateFormatTime: 'HH:mm:ss',
        DateFormatFull: 'MM.DD.YYYY HH:mm:ss',
        MonthNames: ["January", "February", "March", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"],
        MonthNamesInclined: ["January", "February", "March", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"],
        MonthNamesShort: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
        WeekDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        WeekDaysShort: ["mo", "tu", "we", "th", "fr", "sa", "su"],
        MonthDict: {
            "january":0,
            "february":1,
            "march":2,
            "april":3,
            "may":4,
            "june":5,
            "jule":6,
            "august":7,
            "september":8,
            "october":9,
            "november":10,
            "december":11,
            "jan":0,
            "feb":1,
            "mar":2,
            "apr":3,
            //"may":4,
            "jun":5,
            "jul":6,
            "aug":7,
            "sep":8,
            "oct":9,
            "nov":10,
            "dec":11
        }
    }
};


let Culture: CultureType = {
    Dict: CultureInfo,
    Current: CultureInfo['ru-Ru'],
};

export {Culture}