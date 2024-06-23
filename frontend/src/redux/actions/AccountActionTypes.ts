import {TOGGLE_LIMITED_DEALS, TOGGLE_NEWSLETTER_NOTIFICATIONS} from "./actionTypes.ts";

interface ToggleLimitedDealsAction {
    type: typeof TOGGLE_LIMITED_DEALS;
}

interface ToggleNewsletterNotificationsAction {
    type: typeof TOGGLE_NEWSLETTER_NOTIFICATIONS;
}

export type AccountActionTypes =
    | ToggleLimitedDealsAction
    | ToggleNewsletterNotificationsAction;
