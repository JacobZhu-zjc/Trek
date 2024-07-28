/**
 * Types for Trips in Trek
 * @author Matthew Kang
 */
export interface TripItem extends Document {
    item_type: "destination" | "transportation",
    item_id: mongoose.Types.ObjectId,
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
    membersBudget: Array<MemberBudgetInterface>
}

export interface MemberBudget extends Document {
    member_id: string,
    estimated_cost: number,
    cost: number,
    paid_cost: number,
    payment_date: Date,
    payment_base_currency_amount: number,
}

export interface TripBudgetCategory extends Document {
    category: string, // FIXME: we could put an enum here
    value: number,
}

export interface TripBudget extends Document {
    baseCurrency: string,
    tripBudgetCategoriesGroupCost: Array<TripBudgetCategoryInterface>,
    tripTotalGroupCost: number,
    tripTotalPayments: number,
    tripMemberPayments: Array<{ memberId: string, memberName: string, value: number }>
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
    // TODO decide with team what to do, current s3 file keys
    photos: Array<string>
}

export interface Location extends Document {
    title: string,
    address: string,
    date: DateInterface,
    transportation: Transportation,
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
