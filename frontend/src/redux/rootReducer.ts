import { combineReducers } from "redux";
import tripReducers from "./trips/reducers.ts";
import userReducers from "./users/reducers.ts";

const rootReducer = combineReducers({
    trip: tripReducers,
    user: userReducers
})

export default rootReducer;

