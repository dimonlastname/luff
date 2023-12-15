import Luff, {React, TContentCtor, IObservableStateSimple} from "luff"

import "./PhoneInput.scss";
import countries, {TPhoneInputCountry} from "./Countries";


type TPhoneInputProps = {
    value: IObservableStateSimple<string>;
    onChange?: (phone: string, phoneMasked?: string) => void;

    isReadOnlyMode?: boolean;
    isShowCountryPicker?: boolean;
    defaultCountry?: string;
    allowedCountries?: string[];
    excludeCountries?: string[];
}

const maskRegex = new RegExp("[ \\(\\)\\-\\D]", 'g');

type TPhonePack = {
    PhoneClean: string;
    PhoneMasked: string;
}

function getPhone(value: string, countryProps: TPhoneInputCountry) : TPhonePack {
    value = value.replace(`+${countryProps.Code}`, '').replace(maskRegex, '');
    let phoneMasked = countryProps.Mask;
    for (let i = 0; i < value.length; i++) {
        phoneMasked = phoneMasked.replace('_', value[i]);
    }
    return {
        PhoneClean: value,
        PhoneMasked: phoneMasked
    };
}
type TState = {
    CountryProps: TPhoneInputCountry;
    Value: string;
}
export default class PhoneInput extends Luff.Content<TPhoneInputProps, TState> {
    static defaultProps = {
        isShowCountryPicker: true,
        isReadOnlyMode: false,
        defaultCountry: 'ru',

    };

    _onKeyDown(e: KeyboardEvent) {
        let textbox = e.target as HTMLInputElement;
        if (e.keyCode == 8) {//backspace
            let index = textbox.selectionStart;
            let text = textbox.value;
            if (text[index-1] === '-' || text[index-1] === ')') {
                textbox.setSelectionRange(index - 1, index - 1);
            }
            else if (text[index-1] === ' ') {
                textbox.setSelectionRange(index - 2, index - 2);
            }
        }
    }
    _onChange(e: KeyboardEvent) {
        const input = e.target as HTMLInputElement;

        const countryPrefix = '+' + this.State.CountryProps.SValue.Code + ' ';

        let phone = getPhone(input.value, this.State.CountryProps.SValue);
        let phoneMasked = countryPrefix + phone.PhoneMasked;
        let cursorPos = phoneMasked.indexOf('_');
        if (cursorPos < 0)
            cursorPos = phoneMasked.length;

        input.value = phoneMasked;
        input.focus();
        input.setSelectionRange(cursorPos, cursorPos);

        if (this.props.onChange) {
            this.props.onChange(countryPrefix + phone.PhoneClean, phoneMasked);
        }
        else {
            this.props.value.SValue = countryPrefix + phone.PhoneClean;
        }

    }
    Render(): Luff.Node {
        const valueMasked = this.State.Value.SubState(value => '+' + this.State.CountryProps.SValue.Code + ' ' + getPhone(value, this.State.CountryProps.SValue).PhoneMasked , [this.State.CountryProps]);
        const placeholder = this.State.CountryProps.SubState(countryProps => `+${countryProps.Code} ${countryProps.Mask}`);
        const countryIconClass = this.State.CountryProps.SubState(countryProps => "l-phone-input_country-icon l-flag-icon__"+ countryProps.Country);
        return (
            <div className={"l-phone-input" + (this.props.isReadOnlyMode ? ' l-phone-input__readonly':'')}>
                {
                    this.props.isShowCountryPicker &&
                    <div className="l-phone-input_country-picker">
                        <div className={countryIconClass}/>
                    </div>
                }
                <input className="l-phone-input_input"
                       type="text"
                       placeholder={placeholder}
                       value={valueMasked}
                       onKeyDown={e => this._onKeyDown(e as any)}
                       onInput={e => this._onChange(e as any)}
                       disabled={this.props.isReadOnlyMode}
                />
            </div>
        )
    }
    Ctor(): TContentCtor<TState> {
        return {
            State: {
                CountryProps: countries.find(x => x.Country == this.props.defaultCountry),
                Value: this.props.value as any,
            }
        }
    }
}


