import {
    ADD_PROFILE_BIO,
    ADD_PROFILE_CURRENT_LOCATION,
    ADD_PROFILE_HOME, ADD_PROFILE_INTEREST,
    ADD_PROFILE_NAME,
    ADD_PROFILE_PICTURE, ADD_PROFILE_SOCIAL_ACCOUNT, REMOVE_PROFILE_INTEREST
} from "./actionTypes.ts";
import {SocialMediaAccounts} from "./actions.ts";

interface AddProfilePictureAction {
    type: typeof ADD_PROFILE_PICTURE;
    payload: string;
}

interface AddProfileNameAction {
    type: typeof ADD_PROFILE_NAME;
    payload: string;
}

interface AddProfileHomeAction {
    type: typeof ADD_PROFILE_HOME;
    payload: string;
}

interface AddProfileCurrentLocationAction {
    type: typeof ADD_PROFILE_CURRENT_LOCATION;
    payload: string;
}

interface AddProfileBioAction {
    type: typeof ADD_PROFILE_BIO;
    payload: string;
}

interface AddProfileInterestAction {
    type: typeof ADD_PROFILE_INTEREST;
    payload: string;
}

interface RemoveProfileInterestAction {
    type: typeof REMOVE_PROFILE_INTEREST;
    payload: string;
}

interface AddProfileSocialAccountAction {
    type: typeof ADD_PROFILE_SOCIAL_ACCOUNT;
    payload: {
        accountType: SocialMediaAccounts;
        url: string;
    };
}

export type ProfileActionTypes =
    | AddProfilePictureAction
    | AddProfileNameAction
    | AddProfileHomeAction
    | AddProfileCurrentLocationAction
    | AddProfileBioAction
    | AddProfileInterestAction
    | RemoveProfileInterestAction
    | AddProfileSocialAccountAction;
