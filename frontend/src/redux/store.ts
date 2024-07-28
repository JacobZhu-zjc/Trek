import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.ts";
import { payloadApi } from "./services/payloadApi.ts";
import { photonApi } from "./services/photonApi.ts";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(payloadApi.middleware).concat(photonApi.middleware),
});

export default store;

export type AppDispatch = typeof store.dispatch;
