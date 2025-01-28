import {UserUploadedImage} from "@trek-types/userUploadedImage";


export interface TripItem {
    _id?: string;
    key: string;
    item_id: string;
    item_type: 'destinations' | 'transportations';
    day: number;
    date?: { start?: Date, end?: Date };
    /** Duration in seconds */
    duration?: number;
    budget: Budget;
    /** Photos */
    photos?: UserUploadedImage[];
}

export interface SerializedTripItem {
    _id?: string;
    key: string;
    item_id: string;
    item_type: 'destinations' | 'transportations';
    day: number;
    date?: { start?: string, end?: string };
    budget?: Budget;
    /** Photos empty for now */
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
    totalCost: number;
    totalPaidCost: number;
    membersBudget: GroupMemberBudget[];
}

export interface GroupMemberBudget {
    /** member is sub */
    member: string;
    estimated_cost: number;
    cost: number;
    /** Paid cost is "payment" */
    paid_cost: number;
    payment_date?: Date;
    estimated_cost_base_currency_amount: number;
    cost_base_currency_amount: number;
    payment_base_currency_amount?: number;
}
