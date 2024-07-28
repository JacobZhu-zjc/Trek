import { Area, Destination } from "./destination";
import { BasicUser } from "./user";
import { UserUploadedImage } from "./userUploadedImage";



export interface BasicTrip {
    _id: string;
    name: string;
    desc: string;
    photos: string[],
    mainImage: string,
}

export interface Trip extends BasicTrip {
    dest: string[],
    budget: TripBudget,
    expenditures: Expenditure[],
    date: {start: Date, end: Date},
    todo: string[],
    image: string,
    url: string,
    /** Owner subtoken */
    owner: string | {sub: string},
    /** Members' subtoken */
    members: string[],
    ownerUser: BasicUser,
    nonOwnerUsers: BasicUser[],
    trip_items: TripItem[],
    map: Map,
    /** General Areas for Overview */
    areas: Area[],
}

export interface TripBudget {
    baseCurrency: string;
    tripBudgetCategoriesGroupCost: {
        category: BudgetCategory,
        value: number
    }[];
    tripTotalGroupCost: number;
    tripTotalPayments: number;
    tripMemberPayments: {
        memberId: string,
        memberName: string,
        value: number
    }[];
}


export interface TripItem {
    item_id: string;
    item_type: 'destination' | 'transportation';
    /** 0-based trip-item index (0th activity, 1st activity, etc) */
    index: number;
    /** 0-based day (day 0, day 1, ...) */
    day: number;
    /** Optional Date/Times */
    start_time?: Date;
    end_time?: Date;
    /** Duration in seconds */
    duration?: number;
    budget: Budget;
    destination: Destination;
    /** Photos */
    photos: UserUploadedImage[];
}

export type BudgetCategory = "Activities" | "Accommodation" | "Food and Restaurants" | "Transportation" | "Gifts and Souvenirs" | "Other";

export interface Budget {
    /** Currency Code defined by ISO 4217 */
    currency: string;
    category: BudgetCategory;
    totalEstimatedCost: number;
    totalCost: number;
    totalPaidCost: number;
    membersBudget: GroupMemberBudget[];
}

export interface GroupMemberBudget {
    memberId: string;
    memberName: string;
    estimatedCost: number;
    cost: number;
    paidValue: number;
    paymentDate: Date;
    paymentBaseCurrencyValue: number;
}

interface Expenditure {
    expenditure: string,
    cost: number
}

interface Map {
    locations: Location[],
    notes?: string
}

interface Location {
    title: string,
    address: string,
    date: {start: Date, end: Date},
    transportation: Transportation
}

interface Transportation {
    type: string,
    distance: number,
    time: number,
    cost: number
}
