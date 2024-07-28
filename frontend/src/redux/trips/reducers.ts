import {createSlice} from "@reduxjs/toolkit";
import {
    createTripAsync,
    deleteTripAsync,
    getMapAsync,
    // getPhotoAsync,
    getTripAsync,
    getTripsAsync,
    populateTripUsersAsync,
    putTripAsync
} from "./thunks.ts";
import {BasicTrip, Trip} from "@trek-types/trip.ts";
import {BasicUser} from "@trek-types/user.ts";

const emptyUser: BasicUser = {
    email: "", _id: "", name: "", profilePicture: "", username: ""
};

const emptyTrip: Trip = {
    _id: "",
    budget: {
        baseCurrency: 'CAD',
        tripBudgetCategoriesGroupCost: [],
        tripTotalGroupCost: 0,
        tripTotalPayments: 0,
        tripMemberPayments: []
    },
    date: {end: new Date(0), start: new Date(0)},
    desc: "",
    dest: [],
    areas: [],
    // destination: "",
    // destinations: [],
    image: "",
    map: {locations: []},
    name: "",
    // notes: "",
    owner: "",
    members: [],
    ownerUser: emptyUser,
    nonOwnerUsers: [],
    // private: false,
    todo: [],
    url: "",
    photos: [],
    expenditures: [],
    mainImage: "",
    trip_items: [],
};

const INITIAL_STATE = {
    basicUUIDS: [],
    basicTrips: [],
    current: emptyTrip,
    error: null,
    status: "idle"
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
            .addCase(getTripsAsync.fulfilled, (state, action) => {
                console.log("payload is " + JSON.stringify(action.payload))
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
            .addCase(getTripAsync.fulfilled, (state, action) => {
                state.current = {...state.current, ...action.payload, map:state.current['map']};
            })
            .addCase(putTripAsync.fulfilled, (state, action) => {
                state.current = {...state.current, ...action.payload, map:state.current['map']}; // not good for when we implement updating maps later
            })
            .addCase(getMapAsync.fulfilled, (state, action) => {
                state.current = {...state.current, map:action.payload};
            })
            .addCase(populateTripUsersAsync.fulfilled, (state, action) => {
                if (isOwner(action.payload.user, state.current)) { // pass trip found using tripUUID later
                    state.current = {...state.current, ownerUser: action.payload.user};
                } else {
                    // console.log(action.payload.user);
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
            // .addCase(getPhotoAsync.fulfilled, (state, action) => {
            //     if (!state.current.photos) {
            //         state.current.photos = [action.payload.photo];
            //         return;
            //     }
            //     const existingPhotoIndex = state.current.photos.findIndex(photo => photo.key === action.payload.photo.key);
            //
            //     if (existingPhotoIndex !== -1) {
            //         state.current.photos[existingPhotoIndex] = action.payload.photo;
            //     } else {
            //         state.current.photos.push(action.payload.photo);
            //     }
            // })
    }
});

function isOwner(user: BasicUser, trip: Trip) {
    return trip.owner === user._id;
}

export const {resetStatus} = tripsSlice.actions;
export default tripsSlice.reducer;
