export type TPhoneInputCountry = {
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
        Country: 'ru',
        Code: 7,
        Mask: '(___) ___-__-__',
    },
    {
        Country: 'kz',
        Code: 7,
        Mask: '(___) ___-__-__',
    },
    {
        Country: 'uz',
        Code: 998,
        Mask: '(___) ___-__-__',
    },
];

export default countries;