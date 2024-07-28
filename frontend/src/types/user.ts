import { BasicTrip } from "./trip";

export interface PublicUser {
    name: string;
    /** UUID */
    _id: string;
    username: string;
    profilePicture: string;
}

export interface BasicUser extends PublicUser {
    /** UUID */
    email: string;
}

export interface UserLink {
    type: string;
    url: string;
}

export interface SimpleBudget {
    lo: number;
    hi: number;
}

export interface Settings {
    [key: string]: boolean;
    accountLimitedDeals: boolean,
    accountNewsletterNotifications: boolean,
    privateAccount: boolean
}

export interface UserExperience {
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

export interface User extends BasicUser {
    sub: string,
    /** Array of Basic Trip Interface */
    trips: BasicTrip[];
    /** Array of POI or Area IDs */
    saved_poi_area: string[];
    /** Array of POI or Area IDs */
    liked_poi_area: string[];
    description: string;
    links: UserLink[];
    interests: string[];
    home: string;
    currentlyAt: string;
    settings: Settings;
    experience: UserExperience;
    image: string;

    /* old */
    // image: {
    //     photo: string,
    //     _id: string
    // },
}


