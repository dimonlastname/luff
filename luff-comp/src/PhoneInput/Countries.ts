import Luff, {Dict} from "luff";

export type TPhoneInputCountry = {
    Caption: string;
    Country: string;
    Code: number;
    Mask: string;
}
// const countryPhoneByCode : DictN<TPhoneInputCountry> = {
//     7: {
//         Country: 'ru',
//         Code: 7,
//         Mask: '(___) ___-__-__',
//     }
// };
const countries : TPhoneInputCountry[] = [
    {
        Caption: "Россия",
        Country: 'ru',
        Code: 7,
        Mask: '(___) ___-__-__',
    },
    {
        Caption: "Қазақстан",
        Country: 'kz',
        Code: 7,
        Mask: '(___) ___-__-__',
    },
    {
        Caption: "O'zbekiston",
        Country: 'uz',
        Code: 998,
        Mask: '(___) ___-__-__',
    },
];


export const countrySet : Dict<TPhoneInputCountry> = Luff.Linq(countries).ToDictionary(x => x.Country);


export default countries;