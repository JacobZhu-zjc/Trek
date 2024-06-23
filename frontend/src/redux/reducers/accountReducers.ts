import {TOGGLE_LIMITED_DEALS, TOGGLE_NEWSLETTER_NOTIFICATIONS} from "../actions/actionTypes.ts";
import {AccountActionTypes} from "../actions/AccountActionTypes.ts";
import {Account} from "../../../Interfaces.ts";

const initialAccountState: Account = {
    accountLimitedDeals: true,
    accountNewsletterNotifications: false,
}

const accountReducers = (state = initialAccountState, action: AccountActionTypes) => {
    switch(action.type) {
        case TOGGLE_LIMITED_DEALS: {
            return { ...state, accountLimitedDeals: !state.accountLimitedDeals };
        }
        case TOGGLE_NEWSLETTER_NOTIFICATIONS: {
            return { ...state, accountNewsletterNotifications: !state.accountNewsletterNotifications };
        }
        default:
            return state;
    }
}

export default accountReducers;
