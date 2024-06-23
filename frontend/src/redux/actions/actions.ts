import {
    ADD_PROFILE_BIO,
    ADD_PROFILE_CURRENT_LOCATION,
    ADD_PROFILE_HOME,
    ADD_PROFILE_INTEREST,
    ADD_PROFILE_NAME,
    ADD_PROFILE_PICTURE,
    ADD_PROFILE_SOCIAL_ACCOUNT, ADD_TODO_LIST,
    ADD_TRIP_BUDGET,
    ADD_TRIP_DATE_RANGE,
    ADD_TRIP_DESTINATION,
    ADD_TRIP_NAME,
    ADD_TRIP_TRAVELLER,
    REMOVE_PROFILE_INTEREST,
    TOGGLE_LIMITED_DEALS,
    TOGGLE_NEWSLETTER_NOTIFICATIONS,
    UPDATE_TRIP_IMAGE_STORE
} from "./actionTypes.ts";

export enum SocialMediaAccounts {
    Facebook,
    Instagram,
    Twitter,
    Youtube
}

// profile related interactions
export const addProfilePicture = (imgUrl: string) => ({type: ADD_PROFILE_PICTURE, payload: imgUrl});
export const addProfileName = (name: string) => ({type: ADD_PROFILE_NAME, payload: name});
export const addProfileHome = (location: string) => ({type: ADD_PROFILE_HOME, payload: location});
export const addProfileCurrentLocation = (location: string) => ({type: ADD_PROFILE_CURRENT_LOCATION, payload: location});
export const addProfileBio = (bio: string) => ({type: ADD_PROFILE_BIO, payload: bio});
export const addProfileInterest = (interest: string[]) => ({type: ADD_PROFILE_INTEREST, payload: interest});
export const removeProfileInterest = (interest: string) => ({type: REMOVE_PROFILE_INTEREST, payload: interest});
export const addProfileSocialAccount = (accountType: SocialMediaAccounts, url: string) => ({ type: ADD_PROFILE_SOCIAL_ACCOUNT, payload: { accountType, url }});

// account related interactions
export const toggleLimitedDeals = () => ({ type: TOGGLE_LIMITED_DEALS });
export const toggleNewsletterNotifications = () => ({ type: TOGGLE_NEWSLETTER_NOTIFICATIONS });

// trip update related interactions
export const addTripName = (name: string) => ({type: ADD_TRIP_NAME, payload: name});
export const addTripDestination = (destination: string) => ({type: ADD_TRIP_DESTINATION, payload: destination});
export const addTripDates = (dateRange: string) => ({type: ADD_TRIP_DATE_RANGE, payload: dateRange});
export const addTripBudget = (low: string, high: string) => ({type: ADD_TRIP_BUDGET, payload: {low, high}});
export const updateTripImageStore = (image: string) => ({type: UPDATE_TRIP_IMAGE_STORE, payload: image});
// maybe customized object?
export const addTripTraveller = (traveller: string) => ({type: ADD_TRIP_TRAVELLER, payload: traveller});
// needed?
// export const removeListOfTraveller = () => ({type: REMOVE_LIST_OF_TRAVELLER, payload: });
export const addTodoList = (entry: string) => ({ type: ADD_TODO_LIST, payload: entry});
