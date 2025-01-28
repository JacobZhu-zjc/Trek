import {combineReducers} from "redux";
import tripReducers from "./trips/reducers.ts";
import userReducers from "./users/reducers.ts";
import {payloadApi} from "./services/payloadApi.ts";
import {photonApi} from "./services/photonApi.ts";
import {tripApi} from "./services/tripApi.ts";

const rootReducer = combineReducers({
    trip: tripReducers,
    user: userReducers,
    [payloadApi.reducerPath]: payloadApi.reducer,
    [photonApi.reducerPath]: photonApi.reducer,
    [tripApi.reducerPath]: tripApi.reducer,
})

export default rootReducer;

