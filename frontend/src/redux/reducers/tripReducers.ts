import {
    ADD_TODO_LIST,
    ADD_TRIP_BUDGET,
    ADD_TRIP_DATE_RANGE,
    ADD_TRIP_DESTINATION,
    ADD_TRIP_NAME,
    ADD_TRIP_TRAVELLER,
    UPDATE_TRIP_IMAGE_STORE
} from "../actions/actionTypes.ts";
import {TripActionTypes} from "../actions/TripActionTypes.ts";
import {Trip} from "../../../Interfaces.ts";

const tripInitialState: Trip = {
    tripName: 'Graduation Trip',
    tripDescription: 'Graduation trip to LA and Vegas with friends and colleagues.',
    tripDestination: '',
    tripDateRange: '',
    tripBudget: { low: '', high: '' },
    tripImageStore: ['https://media.tacdn.com/media/attractions-splice-spp-674x446/07/71/39/f1.jpg'],
    tripTravellers: [],
    tripTodoList: [
        'Stay at X hotel for 3 days',
        'Visit Y memorial and check out the gift shop',
        'Be present at Z during an alien invasion',
        'Run from said aliens',
        'Submit a pull request once you are done'
    ],
    // TODO move to tripMapReducer?
    tripNotes: '<h3>Trip details</h3><br /><p>This is where I go into detail about all the fun we are going to have, etc.</p>',
    tripLocations: [
        {
            title: 'ICICS Building',
            address: '2366 Main Mall, Vancouver, BC V6T 1Z4',
            date: {start: 1679716640000, end: 1679719640000},
            transportation: {
                type: 'bus',
                distance: 2,
                time: 5,
                cost: 10
            }
        }
    ]
}

const tripReducers = (state = tripInitialState, action: TripActionTypes) => {
    switch(action.type) {
        case ADD_TRIP_NAME: {
            return { ...state, tripName: action.payload };
        }
        case ADD_TRIP_DESTINATION: {
            return { ...state, tripDestination: action.payload };
        }
        case ADD_TRIP_DATE_RANGE: {
            return { ...state, tripDateRange: action.payload };
        }
        case ADD_TRIP_BUDGET: {
            return { ...state, tripBudget: { low: action.payload.low, high: action.payload.high }}
        }
        case UPDATE_TRIP_IMAGE_STORE: {
            return { ...state, tripImageStore: [...state.tripImageStore, action.payload] };
        }
        case ADD_TRIP_TRAVELLER: {
            return { ...state, tripTravellers: [...state.tripTravellers, action.payload] };
        }
        case ADD_TODO_LIST: {
            return { ...state, tripTodoList: [...state.tripTodoList, action.payload] };
        }
        default:
            return state;
    }
}

export default tripReducers;
