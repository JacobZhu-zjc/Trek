import {Combobox, Loader, TextInput, useCombobox} from "@mantine/core";
import {Feature} from 'geojson'
import {getCountryFlagEmoji} from "@utils/place";
import debounce from "lodash.debounce";
import {useState, useMemo, useEffect} from "react";
import {useLazyGetLocationsQuery} from "../../redux/services/photonApi";

export interface AreaSearchBoxProps {
    /* state setter */
    selectedFeature: Feature | null;
    setSelectedFeature: (location: Feature | null) => void;
    label: string | undefined;
    placeholder: string | undefined;
    description: string | undefined;
    errorMsg: string | null;
}

export const AreaSearchBox = ({
                                  selectedFeature,
                                  setSelectedFeature,
                                  label,
                                  placeholder,
                                  description,
                                  errorMsg
                              }: AreaSearchBoxProps) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });


    const [searchQuery, setSearchQuery] = useState('');
    const [value, setValue] = useState(selectedFeature?.properties?.name || '');
    const [trigger, {data, isLoading}] = useLazyGetLocationsQuery();
    const empty = !isLoading && !data?.features?.length;

    const debouncedTrigger = useMemo(() => debounce(
        (value) => setSearchQuery(value),
        500,
    ), []);

    useEffect(() => {
        if (searchQuery) {
            trigger(searchQuery);
        }
    }, [searchQuery, trigger]);


    const options = (data?.features || []).map((feature, index) => {

        const flag = getCountryFlagEmoji(feature.properties?.countrycode ?? "");
        const flagEmoji = flag ? (flag + " ") : "";
        const name = feature.properties?.name || "";
        const province = feature.properties?.province || "";
        const state = feature.properties?.state || "";

        return (
            <Combobox.Option value={String(feature.properties?.osm_id)} key={index}>
                {flagEmoji}{name}{(province || state) ? (`, ${(province || state)}`) : ""}
            </Combobox.Option>)
    });

    return (<>
        <Combobox
            onOptionSubmit={(optionValue) => {
                setSelectedFeature(data?.features.find((feature) => String(feature.properties?.osm_id) === optionValue) || null);
                setValue(data?.features.find((feature) => String(feature.properties?.osm_id) === optionValue)?.properties?.name || '');
                combobox.closeDropdown();
            }}
            withinPortal={false}
            store={combobox}
        >
            <Combobox.Target>
                <TextInput
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    description={description}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        if (event.currentTarget.value.length > 3) {
                            debouncedTrigger(event.currentTarget.value);
                            combobox.openDropdown();
                        } else {
                            combobox.closeDropdown();
                        }
                        combobox.resetSelectedOption();

                    }}
                    onClick={() => {
                        combobox.openDropdown();
                    }}
                    onFocus={() => {
                        combobox.openDropdown();
                        if (data === null) {
                            debouncedTrigger(value);
                        }
                    }}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={isLoading && <Loader size={18}/>}
                    error={errorMsg ? errorMsg : undefined}
                />
            </Combobox.Target>

            <Combobox.Dropdown hidden={data === null}>
                <Combobox.Options>
                    {options}
                    {empty && <Combobox.Empty>No results found</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    </>)

};
