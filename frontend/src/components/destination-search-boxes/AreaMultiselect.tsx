import {Combobox, Group, Pill, PillsInput, PillsInputProps, useCombobox} from "@mantine/core";
import {Feature} from 'geojson';
import {getCountryFlagEmoji} from "@utils/place";
import debounce from "lodash.debounce";
import {useState, useMemo, useEffect} from "react";
import {useLazyGetLocationsQuery} from "../../redux/services/photonApi";
import {IconCheck} from "@tabler/icons-react";

export interface AreaMultiselectProps {
    /* state setter */
    selectedFeatures: Feature[];
    setSelectedFeatures: (locations: Feature[]) => void;
    pillsInputProps?: PillsInputProps
}

export const AreaMultiselect = ({selectedFeatures, setSelectedFeatures, pillsInputProps}: AreaMultiselectProps) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [value, setValue] = useState('');
    const [trigger, {data, isLoading}] = useLazyGetLocationsQuery();
    const empty = !isLoading && !data?.features?.length;


    useEffect(() => {
        console.log("Selected Features: " + JSON.stringify(selectedFeatures));
    }, [selectedFeatures]);

    const debouncedTrigger = useMemo(() => debounce(
        (value) => setSearchQuery(value),
        500,
    ), []);

    useEffect(() => {
        if (searchQuery) {
            trigger(searchQuery);
        }
    }, [searchQuery, trigger]);

    const handleValueSelect = (val: string) => {
        const selectedFeature = data?.features.find((feature) => String(feature.properties?.osm_id) === val) || null;
        if (selectedFeature && !selectedFeatures.some(feature => String(feature.properties?.osm_id) === String(selectedFeature.properties?.osm_id))) {
            console.log("Adding to selected features");
            setSelectedFeatures([...selectedFeatures, selectedFeature]);
            setValue('');
        }
        combobox.closeDropdown();
    };

    const handleValueRemove = (val: string) => {
        setSelectedFeatures(selectedFeatures.filter((feature) => String(feature.properties?.osm_id) !== val));
    };

    const values = selectedFeatures.map((feature, index) => (
        <Pill key={index} withRemoveButton onRemove={() => handleValueRemove(String(feature.properties?.osm_id))}>
            {getCountryFlagEmoji(feature.properties?.countrycode ?? "")} {feature.properties?.name}
        </Pill>
    ));

    const options = (data?.features || []).map((feature, index) => {
        const flag = getCountryFlagEmoji(feature.properties?.countrycode);
        const flagEmoji = flag ? (flag + " ") : "";
        const name = feature.properties?.name || "";
        const province = feature.properties?.province || "";
        const state = feature.properties?.state || "";

        return (
            <Combobox.Option value={String(feature.properties?.osm_id)} key={index}>
                <Group gap="sm">
                    {selectedFeatures.some(selected => selected.id === feature.id) ? <IconCheck size={12}/> : null}
                    <span>{flagEmoji}{name}{(province || state) ? (`, ${(province || state)}`) : ""}</span>
                </Group>
            </Combobox.Option>
        )
    });

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
            <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()} {...pillsInputProps} >
                    <Pill.Group>
                        {values}
                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                value={value}
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
                                onFocus={() => {
                                    if (value.length > 3) {
                                        combobox.openDropdown();
                                    }
                                    if (data === null) {
                                        debouncedTrigger(value);
                                    }
                                }}
                                onBlur={() => combobox.closeDropdown()}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && value.length === 0) {
                                        event.preventDefault();
                                        if (selectedFeatures.length > 0 && selectedFeatures[selectedFeatures.length - 1]?.properties?.osm_id) {
                                            handleValueRemove(String(selectedFeatures[selectedFeatures.length - 1]?.properties?.osm_id));
                                        }
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown hidden={data === null}>
                <Combobox.Options>
                    {options}
                    {empty && <Combobox.Empty>No results found</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};
