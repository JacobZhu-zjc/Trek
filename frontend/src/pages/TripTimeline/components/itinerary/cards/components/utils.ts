/**
 * @fileoverview Utility functions for Time Modal with dealing with Timezones and Conversions
 * @author Matthew Kang
 */


/**
 * @purpose The TimePicker from mantine uses the client's timezones to create a date object,
 *          and not the timezone of the trip item destination. When converted to UTC time, that
 *          time will be inconsistent with what the client intended to type.
 *
 *          Note that the DatePicker uses the DatesProvider, which handles timezones correctly.
 *
 *  Client Entering Time Scenario
 *          1. When client types in a Time, a timestring is created as HH:MM (also enters a date)
 *
 *          2. Our 'convertWithTimezone' function accepts a Date Object + Timestring + Timezone, and
 *             returns a new Date object of the timestring, in the date, but with the timezone of the
 *             trip item destination.
 *
 *          3. handleSubmit of the form calls 'convertWithTimezone' to correctly enter the UTC time
 *             from the destination's time zone.
 *
 *  Client Entering Time without Date Scenario
 *          1. When client types in a Time, a timestring is created as HH:MM
 *
 *          2. The client does not enter a date, we use 'normalizeToUTC' to convert the time to UTC
 *             and normalize it to 1970-01-01.
 *
 *          3. handleSubmit of the form calls 'normalizeToUTC' to correctly enter the UTC time without
 *             calling convertWithTimezone.
 *
 *  Form Default / Filled Value Scenario
 *          1. When the client re-visits the TimeModal, in initialValues, the UTC time needs to be
 *             converted to local time of the destination, not the local time of the client (by default).
 *
 *          2. The formatTime function is used to convert the UTC time to the destination's local time.
 *             given the date object and the timezone.
 *
 *  Form Default / Filled Value without Date Scenario [Date problem not a Time problem]
 *          1. When the client re-visits the TimeModal, in initialValues, the startDay, startDay should be
 *             null when the time is normalized to 1970-01-01.
 *
 *          2. initialValues uses 'isNormalizedTime' to check if the date is normalized to 1970-01-01.
 *             if it is, then the startDay or endDay should be null.
 *
 */

import moment from 'moment-timezone';

/**
 * formatTime - Formats a Date object into HH:MM in spcified timezone
 * @param time
 * @param timezone
 * @returns "HH:MM" string
 */
export function formatTime(time: Date, timezone?: string) {
    const formattedTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        // !!! figure out what to do if timezone is not available
        timeZone: timezone || 'America/Vancouver',
        hour12: false,
    });

    return formattedTime;
}

/**
 * isNormalizedTime - Checks if a Date object is normalized with normalizeToUTC
 * @param date
 * @returns boolean, true if the date is normalized with normalizeToUTC (time with normalized day)
 */
export function isNormalizedTime(date: Date): boolean {
    const epochDate = new Date(0);
    return date.getUTCFullYear() === epochDate.getUTCFullYear() &&
        date.getUTCMonth() === epochDate.getUTCMonth() &&
        date.getUTCDate() === epochDate.getUTCDate();
}


/**
 *  converts from Day + HH:MM to Date object in specified timezone
 *  For example if the day is 2021-08-01 and time is 12:00 and timezone is 'America/Vancouver'
 *  The output will be a Date object of 2021-08-01 12:00 in UTC
 */
export const convertWithTimezone = (day: Date, timeString: string): Date => {
    // Parse the time string 'HH:MM' to get the hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);

    day.setHours(hours);
    day.setMinutes(minutes);
    day.setSeconds(0);
    day.setMilliseconds(0);

    return day;
}

/**
 * normalizeToUTC - Normalizes a given time string in a specific timezone to UTC and returns a date object set to January 1, 1970.
 * @param {string} timeString - The time string in HH:MM format.
 * @param {string} timeZone - The IANA timezone string.
 * @returns {Date} A normalized date object set to January 1, 1970, with the given time in UTC.
 */
export function normalizeToUTC(timeString: string, timeZone: string): Date {
    // Parse the input time string to get hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);

    // Create a moment object representing Date(0) in the specified timezone
    const dateZeroInTimezone = moment.tz('1970-01-01 00:00:00', timeZone);

    // Set the hours and minutes to the parsed values
    dateZeroInTimezone.set({hour: hours, minute: minutes, second: 0, millisecond: 0});

    // Convert the moment object to a Date object in UTC
    const normalizedDate = dateZeroInTimezone.toDate();

    return normalizedDate;
}
