import {Area, Destination, SimpleDestination} from "./destination";
import {BasicUser} from "./user";
import {UserUploadedImage} from "./userUploadedImage";


export interface BasicTrip {
    _id: string;
    name: string;
    desc: string;
    photos: string[],
    mainImage: string,
    // Additional fields for convenience in frontend, added by formatTrips()
    photoURLs: string[],
    mainImageURL: string,
    ownerUser: BasicUser,
    nonOwnerUsers: BasicUser[],
}

export interface Trip extends BasicTrip {
    dest: string[],
    destObjs: SimpleDestination[];
    budget: TripBudget,
    /** @deprecated expenditures are to be deprecated, use TripBudget */
    expenditures: Expenditure[],
    date?: { start: Date, end: Date },
    todo: string[],
    image: string,
    url: string,
    /** Owner subtoken */
    owner: string | { sub: string },
    /** Members' subtoken */
    members: string[],
    /** Owner member of the trip */
    ownerUser: BasicUser,
    /** all members of the trip including owner */
    nonOwnerUsers: BasicUser[],
    /** Trip Items holding transporation or destination */
    trip_items?: TripItem[],
    /** @deprecated map is deprecated, use TripItems */
    map: Map,
    /** General Areas for Overview */
    areas: Area[],
    /** @deprecated areaNames is deprecated, use areas */
    areaNames: string[],
    private: boolean,
    startObj?: SimpleDestination,
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
        member: string,
        value: number
    }[];
    tripMemberSummary: {
        member: string,
        totalCost: number,
        totalPayment: number,
    }[];
}


export interface TripItem {
    item_id: string;
    item_type: 'destination' | 'transportations';
    /** 0-based trip-item index (0th activity, 1st activity, etc) */
    index: number;
    /** 0-based day (day 0, day 1, ...) */
    day: number;
    /** Optional Date/Times */
    start_time?: Date;
    end_time?: Date;
    /** Duration in seconds */
    duration?: number;
    budget?: Budget;
    destination: Destination;
    /** Photos */
    photos?: UserUploadedImage[];
}

export type BudgetCategory =
    "Activities"
    | "Accommodation"
    | "Food and Restaurants"
    | "Transportation"
    | "Gifts and Souvenirs"
    | "Other";

export interface Budget {
    /** Currency Code defined by ISO 4217 */
    currency: string;
    category?: BudgetCategory;
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
    date: { start: Date, end: Date },
    transportation: Transportation
}

interface Transportation {
    type: string,
    distance: number,
    time: number,
    cost: number
}
