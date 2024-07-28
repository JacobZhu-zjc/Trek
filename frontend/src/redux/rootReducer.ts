import { combineReducers } from "redux";
import tripReducers from "./trips/reducers.ts";
import userReducers from "./users/reducers.ts";
import { payloadApi } from "./services/payloadApi.ts";
import { photonApi } from "./services/photonApi.ts";

const rootReducer = combineReducers({
    trip: tripReducers,
    user: userReducers,
    [payloadApi.reducerPath]: payloadApi.reducer,
    [photonApi.reducerPath]: photonApi.reducer,
})

export default rootReducer;

