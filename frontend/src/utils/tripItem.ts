import {SerializedTripItem, TripItem} from "@trek-types/trip-item/tripItem";

export const deserializeTripItems = (tripItems: SerializedTripItem[]): TripItem[] => {

    return tripItems.map((item) => {
        return {
            ...item,
            date: {
                start: item.date?.start ? new Date(item.date.start) : undefined,
                end: item.date?.end ? new Date(item.date.end) : undefined
            }
        } as TripItem;
    });

};

export const serializeTripItems = (tripItems: TripItem[]): SerializedTripItem[] => {

    return tripItems.map((item) => {
        return {
            ...item,
            date: {
                start: item.date?.start?.toISOString(),
                end: item.date?.end?.toISOString()
            }
        } as SerializedTripItem;
    });

};

/**
 * Compares two timezones to see if they are equal
 * @param timezone1 string | undefined
 * @param timezone2 string | undefined
 * @returns true if timezones are equal or undefined/cannot parse, false otherwise
 */
export function isTimezoneEqual(timezone1: string | undefined, timezone2: string | undefined): boolean {

    console.log("in the function");
    console.log("comparing timezones ", timezone1, timezone2);
    if (!timezone1 || !timezone2) {
        return true;
    }

    try {
        const date = new Date();
        const formatOptions: Intl.DateTimeFormatOptions = {timeZoneName: 'long'};

        const formattedTimezone1 = new Intl.DateTimeFormat('en-US', {
            ...formatOptions,
            timeZone: timezone1
        }).format(date);
        const formattedTimezone2 = new Intl.DateTimeFormat('en-US', {
            ...formatOptions,
            timeZone: timezone2
        }).format(date);

        console.log("formatted timezones ", formattedTimezone1, formattedTimezone2);
        return formattedTimezone1 === formattedTimezone2;
    } catch (error) {
        return true;
    }
}

/**
 * Gets the hour difference between two timezones based on a given date
 * @param timezone1 string | undefined
 * @param timezone2 string | undefined
 * @param date Date
 * @returns number representing the hour difference, NaN if timezones are undefined or cannot parse
 */
export function getTimezoneHourDifference(timezone1: string | undefined, timezone2: string | undefined, date: Date): number {
    if (!timezone1 || !timezone2) {
        return NaN;
    }

    try {
        const formatOptions: Intl.DateTimeFormatOptions = {hour: 'numeric', hour12: false, timeZone: timezone1};
        const formattedHour1 = new Intl.DateTimeFormat('en-US', formatOptions).format(date);

        formatOptions.timeZone = timezone2;
        const formattedHour2 = new Intl.DateTimeFormat('en-US', formatOptions).format(date);

        const hour1 = parseInt(formattedHour1, 10);
        const hour2 = parseInt(formattedHour2, 10);

        return hour2 - hour1;
    } catch (error) {
        return NaN;
    }
}

export function formatTimezoneDifference(timezone1: string | undefined, timezone2: string | undefined, date: Date): string {
    const hourDifference = getTimezoneHourDifference(timezone1, timezone2, date);
    if (isNaN(hourDifference) || hourDifference === 0) {
        return "";
    }

    const sign = hourDifference >= 0 ? "+" : "-";
    const absHourDifference = Math.abs(hourDifference);

    return `(${sign}${absHourDifference}h)`;
}
