/**
 * @fileoverview types for timeline stuff along with type predicates and examples
 * @author Matthew Kang
 */

import moment from "moment";
import { Duration } from "moment";

/**
 * @typedef {Object} DestinationItem
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {Money | null } cost
 * @property {Date | null} startTime
 * @property {Duration | null} duration
 */

export interface DestinationItem {
    id: number;
    name: string;
    description: string;
    cost: Money | null;
    startTime: Date | null;
    duration: Duration | null;
}


// examples
export const di1: DestinationItem = {
    id: 100,
    name: 'Vancouver International Airport (YVR)',
    description: 'Destination description',
    cost: {
        amount: 100,
        currency: 'USD',
    },
    duration: moment.duration(4, 'hours'),
    startTime: new Date("2024-04-12T07:00:00"),
};

export const di2: DestinationItem = {
    id: 200,
    name: 'Los Angeles International Airport (LAX)',
    description: 'Destination 2 description',
    cost: {
        amount: 200,
        currency: 'USD',
    },
    duration: moment.duration(2, 'hours'),
    startTime: new Date("2024-04-12T16:00:00"),
};


// type predicate for DestinationItem
export function isDestinationItem(item: DestinationItem | TransportationItem): item is DestinationItem {
    return (item as DestinationItem).name !== undefined;
}

/**
 * @typedef {Object} Money
 * @property {number} amount
 * @property {string} currency
 */

export interface Money {
    amount: number;
    currency: string;
}


/**
 * @typedef {Object} TransportationItem
 * @property {number} id
 * @property {Money} cost
 * @property {TransportationType} type
 * @property {Date | null} startTime 
 * @property {Duration | null} duration 
 */

export interface TransportationItem {
    id: number;
    cost: Money | null;
    type: TransportationType;
    startTime: Date | null;
    duration: Duration | null;
    fromDestination: DestinationItem;
    toDestination: DestinationItem;
}

/**
 * @typedef {enum} TransportationType
 */

export enum TransportationType {
    FLIGHT = 'FLIGHT',
    TRANSIT = 'TRANSIT',
    CAR = 'CAR',
    WALK = 'WALK',
    OTHER = 'OTHER',
}


// examples
export const ti1: TransportationItem = {
    id: 300,
    cost: {
        amount: 50,
        currency: 'USD',
    },
    type: TransportationType.FLIGHT,
    duration: moment.duration(4.5, 'hours'),
    startTime: new Date("2024-04-12T11:00:00"),
    fromDestination: di1,
    toDestination: di2,
};

// export const ti2: TransportationItem = {
//     id: 400,
//     cost: {
//         amount: 20,
//         currency: 'USD',
//     },
//     type: TransportationType.TRANSIT,
//     duration: moment.duration(2, 'hours'),
//     startTime: new Date("2024-04-12T18:00:00"),
// };

/**
 * @typedef {Object} TimelineItem
 * @todo !!! Name collides with Mantine's TimelineItem for Timeline UI component
 *       probably a good idea to change... !!!
 * one of DestinationItem or TransportationItem
*/
export type TimelineItem = DestinationItem | TransportationItem;

// examples
export const exampleTimelineData = [ti1];

/** @typedef DestinationSuggestionItem */
export interface DestinationSuggestionItem {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
}

// examples
export const dsi1: DestinationSuggestionItem = {
    id: 997,
    name: 'Queen Elizabeth Park',
    description: 'Queen Elizabeth Park is a 130-acre municipal park located in Vancouver, British Columbia, Canada. It is located on top of Little Mountain approximately 125 metres above sea level',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipOS0lmxg-JDwvsdtS0BoJc92h94DhBev8tu40rM=s1360-w1360-h1020',
};

export const dsi2: DestinationSuggestionItem = {
    id: 998,
    name: "Stanley Park",
    description: "Stanley Park is a 405-hectare public park that borders the downtown of Vancouver in British Columbia, Canada and is almost entirely surrounded by waters of Vancouver Harbour and English Bay.",
    imageUrl: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRHkGX1xbZwUwqGQaxo7dtsDYm2RK8T898ZmCHGuzOFmbDO8CJAunn5mgAItfKcrKVAabeRd-Tdq6DWPx06gFy3ELWO1dNDFyAnujiSUDE"
}

export const dsi3: DestinationSuggestionItem = {
    id: 999,
    name: "Granville Island",
    description: "Granville Island is a peninsula and shopping district in Vancouver, British Columbia, Canada. It is located across False Creek from Downtown Vancouver, under the south end of the Granville Street Bridge.",
    imageUrl: "https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,h_448,q_75,w_675/https://res.cloudinary.com/simpleview/image/upload/v1519172836/clients/vancouverbc/publicmarket_5c99ceae-e761-47ba-92fa-548c5b581ea5.jpg"
}

export const exampleSuggestionData = [dsi1, dsi2, dsi3];
