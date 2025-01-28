import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.ts";
import {payloadApi} from "./services/payloadApi.ts";
import {photonApi} from "./services/photonApi.ts";
import {tripApi} from "./services/tripApi.ts";
import {createReduxMiddleware, defaultOptions} from "@karmaniverous/serify-deserify";

const serifyMiddleware = createReduxMiddleware(defaultOptions);

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(payloadApi.middleware)
            .concat(photonApi.middleware)
            .concat(tripApi.middleware)
            .concat(serifyMiddleware),
});

export default store;

export type AppDispatch = typeof store.dispatch;
