import {useState} from 'react';
import {DatePickerInput} from '@mantine/dates';
import {IconCalendar} from '@tabler/icons-react';
import {Indicator, rem} from '@mantine/core';

export function TimelineDatePicker() {
    /** User Selected Date */
    const [value, setValue] = useState<Date | null>(null);

    /** Dates with Events (trip dates) */
    const [tripDates, setTripDates] = useState<Date[]>([]);

    /** function to render trip dates on DatePicker */
    const renderTripDates = (date: Date) => {
        const isTripDate = tripDates.some(
            (tripDate) => tripDate.toDateString() === date.toDateString()
        );

        return (
            /** indicator on if day is not in tripDates */
            <Indicator size={6} color="green" offset={-2} disabled={!isTripDate}>
                <div>{date.getDate()}</div>
            </Indicator>
        );
    }

    /** Icon for DatePickerInput */
    const icon = <IconCalendar style={{width: rem(18), height: rem(18)}} stroke={1.5}/>;

    /** Props or API request would populate value (default), now its set to populate just once */
    if (value === null) {
        setValue(new Date("2024-06-12T00:00:00"));
    }

    /** Props or API request would populate tripDates, now its set to populate just once */
    if (tripDates.length === 0) {
        setTripDates([
            new Date("2024-06-12T00:00:00"),
            new Date("2024-06-13T00:00:00"),
            new Date("2024-06-14T00:00:00"),
            new Date("2024-06-15T00:00:00"),
            new Date("2024-06-16T00:00:00"),
        ]);
    }

    return (
        <div className='my-4'>
            <DatePickerInput
                leftSection={icon}
                leftSectionPointerEvents="none"
                label="Trip Dates"
                placeholder="Pick date for trip timeline"
                value={value}
                onChange={setValue}
                renderDay={renderTripDates}
            />
        </div>
    );
}
