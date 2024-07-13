import mongoose from 'mongoose';

// =============== GENERAL ===============
// Schema for profile pictures or splash images for a trip
const imageSchema = new mongoose.Schema({
	max_width: Number,
	max_height: Number,
	source: { type: String, required: true, default: "https://www.amazon.<rest of aws s3 url for default image>" }, // TODO: add default string for default image - not sure how we're encoding them
});

// =============== AUTH0 ===============
// Schema used for user authentication with Auth0
const userAuthSchema = new mongoose.Schema({
	_id: mongoose.Types.UUID,
	subtoken: { type: String, required: true },
	username: { type: String, required: true, unique: true, immutable: true },
});

// =============== USERS ===============
// Schema for the social media links for a user
const userLinksSchema = new mongoose.Schema({
	type: { type: String, required: true },
	url: { type: String, required: true },
}, {
	_id: false, // Disabling the creation of ObjectIds for userLinksSchema subdocuments
});

// Schema for user settings
const userSettingsSchema = new mongoose.Schema({
	accountLimitedDeals: { type: Boolean, required: true, default: true },
	accountNewsletterNotifications: { type: Boolean, required: true, default: true },
	privateAccount: { type: Boolean, required: true, default: false },
}, {
	_id: false,
});

// Mongoose schema for a single user
const userSchema = new mongoose.Schema({
	_id: mongoose.Types.UUID,
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true, immutable: true }, // Username is effectively another _id field
	image: {type: imageSchema, required: true, default: () => ({}) }, // Generating the default image according to the rules in imageSchema
	email: String,
	description: String,
	links: [userLinksSchema],
	interests: [String],
	home: String,
	currentlyAt: String,
	settings: { type: userSettingsSchema, required: true, default: () => ({}) },
	// trips: { type: [mongoose.Types.UUID], required: true, default: [] }, // Adding a list of trips UUIDs here, so that we can precompute some of the responses
});

// =============== TRIPS ===============
// Schema for a destination that users intend to visit (distinct from "destinationSchema" below, which refers to a formalized destination in the Trek database)
const destSchema = new mongoose.Schema({
	name: { type: String, required: true },
	desc: String,
});

// Schema for a trip's budget
const budgetSchema = new mongoose.Schema({
	low: { type: Number, required: true },
	high: { type: Number, required: true },
}, {
	_id: false,
});

// Schema for a single expenditure on a trip, comprising part of the budget
const expenditureSchema = new mongoose.Schema({
	expenditure: { type: String, required: true },
	cost: { type: Number, required: true },
});

// Schema for the "date" field of a trip or location
const dateSchema = new mongoose.Schema({
	start: { type: Date, required: true },
	end: { type: Date, required: true },
}, {
	_id: false,
});

// Schema for a "transportation" field of a location
const transportationSchema = new mongoose.Schema({
	type: { type: String, required: true, default: "" },
	distance: { type: Number, required: true, default: 0 },
	time: { type: Number, required: true, default: 0 },
	cost: { type: Number, required: true, default: 0 },
}, {
	_id: false,
});

// Schema for a single "location" subdocument for a map element, with all relevant transportation and location data
const locationSchema = new mongoose.Schema({
	title: { type: String, required: true, default: "" },
	address: { type: String, required: true, default: "" },
	date: { type: dateSchema, required: true },
	transportation: { type: transportationSchema, default: () => ({}) },
}, {
	_id: false,
});

// Schema for the "map" field of a trip, used in the Trip Maps page
const mapSchema = new mongoose.Schema({
	notes: { type: String, required: true, default: "" },
	locations: { type: [locationSchema], required: true, default: [] },
}, {
	_id: false,
});

// Schema for an individual trip, which can be shared with friends
const tripSchema = new mongoose.Schema({
	_id: mongoose.Types.UUID, // Overwriting the default _id field with a custom UUID
	name: { type: String, required: true },
	desc: { type: String, required: true },
	dest: [String],
	budget: { type: budgetSchema, required: true },
	expenditures: [expenditureSchema],
	date: dateSchema,
	todo: [String],
	image: { type: imageSchema, default: () => ({}) },
	url: { type: String, required: true },
	owner: { type: String, required: true },
	members: { type: [String], required: true },
	private: { type: Boolean, required: true, default: true },
	destinations: [destSchema],
	map: { type: mapSchema, default: () => ({}) },
});

// =============== DESTINATIONS ===============
// Schema for a formal destination in the Trek database - one that has been visited often
const destinationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	image: String,
	desc: String,
	url: String, // TODO: is this field redundant?
});

export const userAuthModel = mongoose.model("UserAuth", userAuthSchema);
export const userModel = mongoose.model("User", userSchema);
export const tripModel = mongoose.model("Trip", tripSchema);
export const destinationModel = mongoose.model("Destination", destinationSchema);
