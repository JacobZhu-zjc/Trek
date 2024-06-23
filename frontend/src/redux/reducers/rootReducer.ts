import accountReducers from "./accountReducers.ts";
import profileReducers from "./profileReducers.ts";
import tripReducers from "./tripReducers.ts";
import { combineReducers } from "redux";


const rootReducer = combineReducers({
    account: accountReducers,
    profile: profileReducers,
    trip: tripReducers,
})

export default rootReducer;

