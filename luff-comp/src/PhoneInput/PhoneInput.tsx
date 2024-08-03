import Luff, {React, TContentCtor, IObservableStateSimple, IObservableState, Dict} from "luff"

import "./PhoneInput.scss";
import countries, {countrySet, TPhoneInputCountry} from "./Countries";
import ComboBox from "../Input/ComboBox/ComboBox";
import TextBox, {TInputMask} from "../Input/TextBox";


type TPhoneInputProps = {
    value: IObservableStateSimple<string>;
    onChange?: (phone: string, phoneMasked?: string) => void;

    className?: string;
    classDict?: Dict<IObservableStateSimple<boolean>>;

    isReadOnlyMode?: boolean;
    isShowCountryPicker?: boolean;
    defaultCountry?: string;
    allowedCountries?: string[];
    excludeCountries?: string[];

    onKeyEnter?: () => void;
}



export default class PhoneInput extends Luff.ComponentSimple<TPhoneInputProps> {
    static defaultProps = {
        isShowCountryPicker: true,
        isReadOnlyMode: false,
        defaultCountry: 'ru',
    };
    //private CountryData = Luff.State<TPhoneInputCountry>(countrySet[this.props.defaultCountry]);
    private CountryData : IObservableState<TPhoneInputCountry>= this.props.value.SubState(v => {
        if (v.trim().length == 0 && this.CountryData?.SValue)
            return this.CountryData.SValue;

        if (v.trim().length == 0)
            return countrySet[this.props.defaultCountry];

        for (let cd of countries) {
            if (v.includes("+" + cd.Code + " ")) // space afterwards needs for get exact picking "+ 7 (919...", and not: "+ 720 (402..."
                return cd;
        }
        return countrySet[this.props.defaultCountry];
    });

    Render(): Luff.Node {
        const mask : IObservableState<TInputMask> = this.CountryData.SubState(data => {
            return {
                Mask: `+${data.Code} ${data.Mask}`
            }
        });
        let mainClassCss = "l-phone-input";
        if (this.props.isReadOnlyMode)
            mainClassCss += " __readonly";
        if (this.props.className)
            mainClassCss += " " + this.props.className;

        return (
            <div
                className={mainClassCss}
                classDict={this.props.classDict}
            >
                {
                    this.props.isShowCountryPicker &&
                    <ComboBox
                        value={this.CountryData.Country}
                        dataStatic={countries}
                        dataDelegateValue={x => x.Country}
                        dataRender={x => {
                            return (
                                <div className="l-phone-input_country-item">
                                    <div className={x.Country.SubState(country => "l-phone-input_country-icon l-flag-icon__" + country )}/>
                                    <div className="l-phone-input_country-caption">{x.Caption}</div>
                                </div>
                            )
                        }}
                        onChange={c => {
                            this.CountryData.SValue = countrySet[c];
                        }}
                        listWidth="180px"
                    />
                }
                <TextBox
                    value={this.props.value}

                    mask={mask}
                    placeholder={mask.Mask}
                    onKeyEnter={this.props.onKeyEnter}

                    disabled={this.props.isReadOnlyMode}
                />
            </div>
        )
    }
}


