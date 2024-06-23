import {
    ADD_TRIP_NAME,
    ADD_TRIP_DESTINATION,
    ADD_TRIP_DATE_RANGE,
    ADD_TRIP_BUDGET,
    UPDATE_TRIP_IMAGE_STORE,
    ADD_TRIP_TRAVELLER,
    ADD_TODO_LIST,
} from './actionTypes';

// Trip update related action interfaces
interface AddTripNameAction {
    type: typeof ADD_TRIP_NAME;
    payload: string;
}

interface AddTripDestinationAction {
    type: typeof ADD_TRIP_DESTINATION;
    payload: string;
}

interface AddTripDateRangeAction {
    type: typeof ADD_TRIP_DATE_RANGE;
    payload: string;
}

interface AddTripBudgetAction {
    type: typeof ADD_TRIP_BUDGET;
    payload: {
        low: number;
        high: number;
    };
}

interface UpdateTripImageStoreAction {
    type: typeof UPDATE_TRIP_IMAGE_STORE;
    payload: string;
}

interface AddTripTravellerAction {
    type: typeof ADD_TRIP_TRAVELLER;
    payload: string;
}

interface AddTodoListAction {
    type: typeof ADD_TODO_LIST;
    payload: string;
}

export type TripActionTypes =
    | AddTripNameAction
    | AddTripDestinationAction
    | AddTripDateRangeAction
    | AddTripBudgetAction
    | UpdateTripImageStoreAction
    | AddTripTravellerAction
    | AddTodoListAction;