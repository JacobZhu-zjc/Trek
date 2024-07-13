import {createSlice} from "@reduxjs/toolkit";
import {getMapAsync, getTripAsync, getTripsAsync, putTripAsync} from "./thunks.ts";
import {Trip} from "../../interfaces.ts";

const emptyTrip: Trip = {
    _id: "",
    budget: {high: 0, low: 0},
    date: {end: 0, start: 0},
    desc: "",
    dest: [],
    destination: "",
    destinations: [],
    expenditures: [],
    image: {_id: "", source: ""},
    map: {
        notes: "Add your notes here!",
        locations: []
    },
    members: [],
    name: "",
    notes: "",
    owner: "",
    private: false,
    todo: [],
    url: ""
};

const INITIAL_STATE = {
    list: [],
    current: emptyTrip,
    error: null
};

const tripsSlice = createSlice({
    name: 'trips',
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTripsAsync.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(getTripAsync.fulfilled, (state, action) => {
                state.current = wrangleImage({...action.payload, map:state.current['map']});
            })
            .addCase(putTripAsync.fulfilled, (state, action) => {
                state.current = wrangleImage({...action.payload, map:state.current['map']}); // not good for when we implement updating maps later
            })
            .addCase(getMapAsync.fulfilled, (state, action) => {
                state.current = wrangleImage({...state.current, map:action.payload});
            })
    }
});

function wrangleImage(trip: Trip) {
   const url = (trip.image as {_id: string, source: string}).source;
   trip.image = url;
   return trip;
}

export default tripsSlice.reducer;
