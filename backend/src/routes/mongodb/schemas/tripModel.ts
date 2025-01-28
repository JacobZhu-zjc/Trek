import mongoose from 'mongoose';
import * as TripTypes from '../../../types/tripTypes';
import {S3FileModel} from './s3FileModel';

// =============== TRIPS ===============
// Schema for a single expenditure on a trip, comprising part of the budget
const expenditureSchema = new mongoose.Schema<TripTypes.Expenditure>({
    expenditure: {type: String, required: true},
    cost: {type: Number, required: true},
});

// Schema for the "date" field of a trip or location
const dateSchema = new mongoose.Schema<TripTypes.Date>({
    start: {type: Date, required: true},
    end: {type: Date, required: true},
}, {
    _id: false,
});

/**
 * @schema Budget, TripBudget
 */
const budgetCategory = ["Activities", "Accommodation", "Food and Restaurants", "Transportation", "Gifts and Souvenirs", "Other"];

// Schema for the budget of a member's contribution to a tripItem
const memberBudgetSchema = new mongoose.Schema<TripTypes.MemberBudget>({
    member: {type: String, ref: 'user', required: true},
    estimated_cost: {type: Number, required: true, default: 0},
    cost: {type: Number, required: true, default: 0},
    paid_cost: {type: Number, required: true, default: 0},
    payment_date: {type: Date, required: false},
    estimated_cost_base_currency_amount: {type: Number, required: true, default: 0},
    cost_base_currency_amount: {type: Number, required: true, default: 0},
    payment_base_currency_amount: {type: Number, required: true, default: 0},
}, {
    _id: false,
});

// Schema for the budget of a single TripItem
const budgetSchema = new mongoose.Schema<TripTypes.Budget>({
    currency: {type: String, required: true, default: "CAD"},
    category: {type: String, enum: budgetCategory, required: false},
    totalEstimatedCost: {type: Number, required: true, default: 0},
    totalCost: {type: Number, required: true, default: 0},
    totalPaidCost: {type: Number, required: true, default: 0},
    membersBudget: [memberBudgetSchema],
}, {
    _id: false,
});

/**
 * @schema Trip, TripItems
 */
// Schema for a single item in a trip's itinerary
const TripItemSchema = new mongoose.Schema<TripTypes.TripItem>({
    item_type: {type: String, enum: ['destinations', 'transportations'], required: true},
    item_id: {type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'item_type'},
    key: {type: String, required: true},
    date: {type: dateSchema, required: false},
    duration: {type: Number, required: false},
    budget: {type: budgetSchema, required: false},
    notes: Buffer,
});

// Schema for a trip budget
const tripBudgetSchema = new mongoose.Schema<TripTypes.TripBudget>({
    baseCurrency: {type: String, required: true, default: "CAD"},
    tripBudgetCategoriesGroupCost: [{
        category: {
            type: String,
            enum: budgetCategory,
        },
        value: Number,
    }],
    tripTotalGroupCost: {type: Number},
    tripTotalPayments: {type: Number},
    tripMemberSummary: [{member: String, totalCost: Number, totalPayment: Number}],
}, {
    _id: false,
});

// Schema for an individual trip, which can be shared with friends
const tripSchema = new mongoose.Schema<TripTypes.Trip>({
    _id: mongoose.Types.UUID, // Overwriting the default _id field with a custom UUID
    name: {type: String, required: true},
    desc: {type: String, required: true, default: " "},
    budget: {type: tripBudgetSchema, required: true, default: () => ({})},
    expenditures: [expenditureSchema],
    date: dateSchema,
    todo: [String],
    mainImage: {type: mongoose.Types.ObjectId, ref: 'S3File'},
    url: {type: String, required: true},
    owner: {type: String, required: true},
    members: {type: [String], required: true},
    private: {type: Boolean, required: true, default: true},
    trip_items: {type: [TripItemSchema], required: true, default: []},
    photos: [{type: mongoose.Types.ObjectId, ref: 'S3File'}],
    areas: {type: [mongoose.Types.ObjectId], required: true, default: []},
    start: {type: String, required: false}, // The start location of the trip
    dest: {type: [String], required: false}, // The destination(s) of the trip (initially specified on trip create)
});

// Additional validation for tripSchemas, to check that "mainImage" and "photos" point to valid S3Files, if they exist
tripSchema.pre("validate", async function (next) {
    const queries = [];
    if (this.hasOwnProperty("mainImage") && mongoose.Types.ObjectId.isValid(this["mainImage"])) {
        queries.push(S3FileModel.findById(this["mainImage"]));
    }
    if (this.hasOwnProperty("photos")) {
        queries.concat((this.photos as [mongoose.Types.ObjectId]).map(objectid => S3FileModel.findById(objectid)));
    }

    const data = await Promise.all(queries);
    if (data.includes(null)) {
        next(new Error("One of 'mainImage' or 'photos' refers to an S3File that does not exist!"));
    } else {
        next();
    }
});

export const tripModel = mongoose.model("Trip", tripSchema);
