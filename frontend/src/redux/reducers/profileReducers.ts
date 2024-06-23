import {
    ADD_PROFILE_BIO,
    ADD_PROFILE_CURRENT_LOCATION,
    ADD_PROFILE_HOME,
    ADD_PROFILE_INTEREST,
    ADD_PROFILE_NAME,
    ADD_PROFILE_PICTURE,
    ADD_PROFILE_SOCIAL_ACCOUNT,
    REMOVE_PROFILE_INTEREST,
} from "../actions/actionTypes.ts";

import {ProfileActionTypes} from "../actions/ProfileActionType.ts";
import {Profile} from "../../../Interfaces.ts";
import {SocialMediaAccounts} from "../actions/actions.ts";

const initialProfileState: Profile = {
    profileUsername: 'gregork',
    profilePicture: 'https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z',
    profileName: 'Gregor Kiczales',
    profileEmail: 'gregor@cs.ubc.ca',
    profileHome: 'Vancouver, BC',
    profileCurrentLocation: '',
    profileBio: 'Father of all CS students, king of the natural recursion, and the master of the AOP.',
    profileInterests: ['Island', 'Ocean', 'Hiking', 'Nature', 'Recursion'],
    socialAccounts: {
        Facebook: '',
        Instagram: '',
        Twitter: '',
        Youtube: '',
    },
}

const profileReducers = (state = initialProfileState, action: ProfileActionTypes) => {
    switch(action.type) {
        case ADD_PROFILE_PICTURE: {
            return { ...state, profilePicture: action.payload };
        }
        case ADD_PROFILE_NAME: {

            return { ...state, profileName: action.payload };
        }
        case ADD_PROFILE_HOME: {

            return { ...state, profileHome: action.payload };
        }
        case ADD_PROFILE_CURRENT_LOCATION: {

            return { ...state, profileCurrentLocation: action.payload };
        }
        case ADD_PROFILE_BIO: {

            return { ...state, profileBio: action.payload };
        }
        case ADD_PROFILE_INTEREST: {

            return { ...state, profileInterests: action.payload };
        }
        case REMOVE_PROFILE_INTEREST: {
            return { ...state, profileInterests: state.profileInterests.filter(
                    interest => interest !== action.payload
                )};
        }
        case ADD_PROFILE_SOCIAL_ACCOUNT: {
            const accs = {...state.socialAccounts};
            switch (action.payload.accountType) {
                case SocialMediaAccounts.Facebook:
                    accs.Facebook = action.payload.url;
                    break;
                case SocialMediaAccounts.Instagram:
                    accs.Instagram = action.payload.url;
                    break;
                case SocialMediaAccounts.Twitter:
                    accs.Twitter = action.payload.url;
                    break;
                case SocialMediaAccounts.Youtube:
                    accs.Youtube = action.payload.url;
                    break;
            }
            return { ...state, socialAccounts: accs};
        }
        default:
            return state;
    }
}

export default profileReducers;
