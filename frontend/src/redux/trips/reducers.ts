import {createSlice} from "@reduxjs/toolkit";
import {
    createTripAsync,
    deleteTripAsync,
    getMapAsync,
    getPhotosAsync,
    getTripAsync,
    getTripsAsync,
    getTripsPaginatedAsync,
    populateTripUsersAsync,
    putManagementAsync,
    putPhotosAsync,
    putTripAsync
} from "./thunks.ts";
import {BasicTrip, Trip} from "@trek-types/trip.ts";
import {BasicUser} from "@trek-types/user.ts";

const emptyUser: BasicUser = {
    email: "", _id: "", name: "", image: "", uploadedProfilePictureURL: "", username: "", sub: ""
};

const emptyTrip: Trip = {
    _id: "",
    budget: {
        baseCurrency: 'CAD',
        tripBudgetCategoriesGroupCost: [],
        tripTotalGroupCost: 0,
        tripTotalPayments: 0,
        tripMemberSummary: [],
        /** @deprecated Use tripMemberSummary */
        tripMemberPayments: []
    },
    desc: "",
    dest: [],
    destObjs: [],
    areas: [],
    areaNames: [],
    image: "",
    map: {locations: []},
    name: "",
    owner: "",
    members: [],
    ownerUser: emptyUser,
    nonOwnerUsers: [],
    todo: [],
    url: "",
    photos: [],
    expenditures: [],
    mainImage: "",
    trip_items: [],
    mainImageURL: "",
    photoURLs: [],
    private: true,
};

const INITIAL_STATE = {
    basicUUIDS: [],
    basicTrips: [],
    current: emptyTrip,
    error: null,
    status: "idle",
    totalPages: 0,
};

const tripsSlice = createSlice({
    name: 'trips',
    initialState: INITIAL_STATE,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle"
        }
    },
    extraReducers: (builder) => {
        builder
            // Getting all the trips, not used anymore
            .addCase(getTripsAsync.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.basicTrips = action.payload;
                state.basicUUIDS = action.payload.map((trip: BasicTrip) => trip._id);
            })
            .addCase(getTripsAsync.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getTripsAsync.pending, (state) => {
                state.status = "pending";
            })
            // Getting a subset of trips for pagination
            .addCase(getTripsPaginatedAsync.fulfilled, (state, action) => {
                state.status = "fulfilled";
                if (action.payload["trips"]) {
                    state.basicTrips = action.payload["trips"];
                    state.basicUUIDS = action.payload["trips"].map((trip: BasicTrip) => trip._id);
                }
                state.totalPages = action.payload["pages"];
            })
            .addCase(getTripsPaginatedAsync.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getTripsPaginatedAsync.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getTripAsync.fulfilled, (state, action) => {
                state.current = {...state.current, ...action.payload, map: state.current['map']};
            })
            .addCase(putTripAsync.fulfilled, (state, action) => {
                state.current = {...state.current, ...action.payload, map: state.current['map']}; // not good for when we implement updating maps later
            })
            .addCase(getMapAsync.fulfilled, (state, action) => {
                state.current = {...state.current, map: action.payload};
            })
            .addCase(populateTripUsersAsync.fulfilled, (state, action) => {
                if (isOwner(action.payload.user, state.current)) { // pass trip found using tripUUID later
                    state.current = {...state.current, ownerUser: action.payload.user};
                } else {
                    if (!state.current.nonOwnerUsers) {
                        state.current.nonOwnerUsers = [action.payload.user];
                        return;
                    }
                    const existingUserIndex = state.current.nonOwnerUsers.findIndex(user => user._id === action.payload.user._id);

                    if (existingUserIndex !== -1) {
                        state.current.nonOwnerUsers[existingUserIndex] = action.payload.user;
                    } else {
                        state.current.nonOwnerUsers.push(action.payload.user);
                    }
                }
            })
            .addCase(deleteTripAsync.fulfilled, (state, action) => {
                void action;
                state.current = emptyTrip;
            })
            .addCase(createTripAsync.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(createTripAsync.fulfilled, (state, action) => {
                state.current = action.payload;
                state.status = 'idle';
            })
            .addCase(putPhotosAsync.fulfilled, (state, action) => {
                state.current = {...state.current, ...action.payload};
            })
            .addCase(getPhotosAsync.fulfilled, (state, action) => {
                state.current = {...state.current, ...action.payload};
            })
            .addCase(putManagementAsync.fulfilled, (state, action) => {
                state.current = {...state.current, ...action.payload};
            })
    }
});

function isOwner(user: BasicUser, trip: Trip) {
    return trip.owner === user._id;
}

export const {resetStatus} = tripsSlice.actions;
export default tripsSlice.reducer;
