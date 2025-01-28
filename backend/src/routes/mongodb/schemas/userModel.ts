import mongoose from 'mongoose';
import {S3FileModel} from './s3FileModel';


interface SimpleBudget {
    lo: number;
    hi: number;
}

interface UserExperience {
    /** General Tripper Preferences */
    travelFrequency: string;
    ageRange: number;
    occupation: string;
    passports: string[];
    visas: string[];
    connectivityNeeds: string;
    /** Activities and Interests */
    activities: string[];
    dining: string[];
    climateAndWeather: string[],
    culture: string[],
    language: string,
    healthAndAccessibility: string;
    safety: string;
    /** Travel Style and Budget */
    travelStyle: string[];
    tripDuration: string;
    transportPreferences: string[];
    accommodationBudget: SimpleBudget;
    diningBudget: SimpleBudget;
    activitiesBudget: SimpleBudget;
    /** ToS */
    tosAgreement: boolean;
}

// =============== USERS ===============
// Schema for the social media links for a user
const userLinksSchema = new mongoose.Schema({
    type: {type: String, required: true},
    url: {type: String, required: true},
}, {
    _id: false, // Disabling the creation of ObjectIds for userLinksSchema subdocuments
});

// Schema for user settings
const userSettingsSchema = new mongoose.Schema({
    accountLimitedDeals: {type: Boolean, required: true, default: true},
    accountNewsletterNotifications: {type: Boolean, required: true, default: true},
    privateAccount: {type: Boolean, required: true, default: false},
}, {
    _id: false,
});

// Schema for various user experience fields
const userExperienceSchema = new mongoose.Schema({
    /** General Tripper Preferences */
    travelFrequency: {
        type: String, enum: [
            'Less than once a year',
            'Once a year',
            '2-4 times a year',
            '5-10 times a year',
            'I live on the road!',
            'No Preference',
            '',
            null
        ]
    },
    ageRange: {type: Number, min: 18},
    occupation: {
        type: String, enum: [
            'Student',
            'Employed',
            'Self-Employed',
            'Retired',
            'Unemployed',
            '',
            null
        ]
    },
    passports: [String],
    visas: [String],
    connectivityNeeds: {
        type: String, enum: [
            'No connectivity needed',
            'Occasional connectivity',
            'Frequent connectivity',
            'High connectivity',
            '',
            null
        ]
    },
    /** Activities and Interests */
    activities: [String],
    dining: [String],
    climateAndWeather: [String],
    culture: [String],
    language: {
        type: String,
        enum: ['Comfortable with different languages', 'Prefer English-speaking countries', '', null]
    },
    healthAndAccessibility: String,
    safety: String,
    /** Travel Style and Budget */
    travelStyle: [String],
    tripDuration: String,
    transportPreferences: [String],
    accommodationBudget: {type: {lo: Number, hi: Number}, default: {lo: 0, hi: 1000}},
    diningBudget: {type: {lo: Number, hi: Number}, default: {lo: 0, hi: 1000}},
    activitiesBudget: {type: {lo: Number, hi: Number}, default: {lo: 0, hi: 1000}},
    /** ToS */
    tosAgreement: {type: Boolean, required: true, default: false}
}, {
    _id: false,
})

// Initial (default) user experience
let initialExperience: UserExperience = {
    accommodationBudget: {lo: 0, hi: 1000},
    activities: [],
    activitiesBudget: {lo: 0, hi: 1000},
    ageRange: 18,
    climateAndWeather: [],
    connectivityNeeds: "",
    culture: [],
    dining: [],
    diningBudget: {lo: 0, hi: 1000},
    healthAndAccessibility: "",
    language: "",
    occupation: "",
    passports: [],
    safety: "",
    tosAgreement: false,
    transportPreferences: [],
    travelFrequency: "",
    travelStyle: [],
    tripDuration: "",
    visas: []
}
// Mongoose schema for a single user
const userSchema = new mongoose.Schema({
    sub: {type: String, required: true, unique: true, immutable: true},
    name: {type: String},
    username: {type: String},
    image: {type: String, default: () => ""}, // auth0 photo
    uploadedProfilePicture: {type: mongoose.Schema.Types.ObjectId, ref: 'S3File'},
    email: {type: String},
    description: String,
    links: [userLinksSchema],
    interests: [String],
    home: String,
    currentlyAt: String,
    settings: {type: userSettingsSchema, required: true, default: () => ({})},
    experience: {type: userExperienceSchema, default: () => (initialExperience)}, // users can opt out
    trips: {type: [String], required: true, default: []}, // Adding a list of trips UUIDs here, so that we can precompute some of the responses
});

// Additional validation for tripSchemas, to check that "mainImage" and "photos" point to valid S3Files, if they exist
userSchema.pre("validate", async function (next) {
    if (this.hasOwnProperty("uploadedProfilePicture")) {
        const data = await S3FileModel.findById(this["uploadedProfilePicture"]);
        if (data === null) {
            next(new Error("'uploadedProfilePicture' refers to an S3File that does not exist! ObjectID: " + this["uploadedProfilePicture"]));
        }
    }
    next();
});

export const userModel = mongoose.model("User", userSchema);
