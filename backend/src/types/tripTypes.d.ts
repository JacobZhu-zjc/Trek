/**
 * Types for Trips in Trek
 * @author Matthew Kang
 */
export interface TripItem extends Document {
    item_type: "destination" | "transportation",
    item_id: mongoose.Types.ObjectId,
    /** unique UUID key for each item */
    key: string,
    index: number,
    date: DateInterface,
    duration: number,
    budget: Budget,
    notes: Buffer,
}

export interface Budget extends Document {
    currency: string,
    category: string,
    totalEstimatedCost: number,
    totalCost: number,
    totalPaidCost: number,
    membersBudget: Array<MemberBudget>
}

export interface MemberBudget extends Document {
    // NOTE! Changed to just member to reflect sub - Matthew
    member: string,
    estimated_cost: number,
    cost: number,
    paid_cost: number,
    payment_date: Date,
    estimated_cost_base_currency_amount: number;
    cost_base_currency_amount: number;
    payment_base_currency_amount: number,
}

export interface TripBudgetCategory extends Document {
    category: string, // FIXME: we could put an enum here
    value: number,
}

export interface TripBudget extends Document {
    baseCurrency: string,
    tripBudgetCategoriesGroupCost: Array<CategoryBudgetSummary>,
    tripTotalGroupCost: number,
    tripTotalPayments: number,
    tripMemberSummary: Array<MemberBudgetSummary>,
}

export interface CategoryBudgetSummary extends Document {
    category: string,
    value: number
}

export interface MemberBudgetSummary extends Document {
    member: string,
    totalCost: number,
    totalPayment: number,
}

export interface Trip extends Document {
    _id: mongoose.Types.UUID,
    name: string,
    desc: string,
    dest: Array<string>,
    areas: Array<string>,
    start: string,
    budget: TripBudget,
    expenditures: Array<ExpenditureInterface>,
    date: DateInterface,
    todo: Array<string>,
    mainImage: PopulatedDoc<S3File>,
    url: string,
    owner: string,
    members: Array<string>,
    private: boolean,
    trip_items: Array<TripItemInterface>,
    map: MapInterface,
    photos: Array<string>,
    startLocation: string
}

export interface Location extends Document {
    title: string,
    address: string,
    date: DateInterface,
    transportation: Transportation,
}

export interface Notes extends Document {
    trip_item_key: string,
    notes: Buffer
}

export interface Map extends Document {
    locations: Array<Location>,
    notes: string
}

export interface Expenditure extends Document {
    expenditure: string,
    cost: number,
}

export interface Date extends Document {
    start: Date,
    end: Date,
}

interface Transportation extends Document {
    type: string,
    distance: number,
    time: number,
    cost: number,
}
