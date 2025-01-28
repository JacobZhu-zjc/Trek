import {Autocomplete, AutocompleteProps} from '@mantine/core';
import React, {useEffect} from 'react';
import {CURRENCY_MAP, CURRENCY_NAMES, getFormattedCurrencyName} from '@utils/currency';

export interface CurrencyAutocompleteProps {
    /** ISO Currency String */
    value: string;
    setValue: (value: string) => void;
    label?: string;
    props?: AutocompleteProps;
}

const CurrencyAutocomplete: React.FC<CurrencyAutocompleteProps> = ({label, value, setValue, props}) => {

    const [searchText, setSearchText] = React.useState('');

    useEffect(() => {
        setSearchText(getFormattedCurrencyName(value));
    }, [value]);

    return (
        <Autocomplete
            label={label}
            value={searchText}
            onOptionSubmit={(option) => {
                setSearchText(option);
                const isoCode = CURRENCY_MAP[option];
                console.log("on option submit")
                setValue(isoCode);
            }}
            onChange={setSearchText}
            data={CURRENCY_NAMES}
            defaultValue={getFormattedCurrencyName(value)}
            selectFirstOptionOnChange
            {...props}
        />
    );

}

export default CurrencyAutocomplete;
