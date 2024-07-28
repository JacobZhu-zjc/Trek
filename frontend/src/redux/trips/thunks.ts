import {createAsyncThunk} from "@reduxjs/toolkit";
import {tripActions} from "./actionTypes.ts";
import TripsService from "./service.ts";
import {Trip} from "@trek-types/trip.ts";

export const getTripsAsync = createAsyncThunk(
    tripActions.GET_TRIPS,
    async ({token}: {token: string}) => {
        return await TripsService.getTrips({token});
    }
);

export const getTripAsync = createAsyncThunk(
    tripActions.GET_TRIP,
  async ({ uuid, token }: {uuid: string, token: string}) => {
    return await TripsService.getTrip({ uuid, token });
    }
);

export const getMapAsync = createAsyncThunk(
    tripActions.GET_TRIP_MAP,
  async ({ uuid, token }: { uuid: string, token: string }) => {
    return await TripsService.getMap({ uuid, token });
    }
);

export const putTripAsync = createAsyncThunk(
    tripActions.PUT_TRIP,
    async (payload: {uuid: string, token: string, trip: Trip},) => {
        // console.log(payload.trip);
        return await TripsService.putTrip(payload.uuid, payload.token, payload.trip);
    }
);

export const populateTripUsersAsync = createAsyncThunk(
    tripActions.POPULATE_TRIP_USERS,
    async (payload: {userSub: string, tripUUID: string}) => {
        return await TripsService.populateTripUsers(payload.userSub, payload.tripUUID);
    }
);

// export const getPhotoAsync = createAsyncThunk(
//     tripActions.GET_PICTURE,
//     async (payload: {s3Key: string, tripUUID: string}) => {
//         return await TripsService.getPhoto(payload.s3Key, payload.tripUUID);
//     }
// );

export const createTripAsync = createAsyncThunk(
    tripActions.POST_TRIP,
    async (payload: {token: string, data: object}) => {
        return await TripsService.postTrip(payload.token, payload.data);
    }
);

export const deleteTripAsync = createAsyncThunk(
    tripActions.DELETE_TRIP,
    async (payload: {token: string, tripUUID: string}) => {
        return await TripsService.deleteTrip(payload.token, payload.tripUUID);
    }
);

// export const getPhotoAsync = createAsyncThunk(
//     tripActions.GET_PICTURE,
//     async(payload: {s3Key: string, tripUUID: string}) => {
//         return await TripsService.getPhoto(payload.s3Key, payload.tripUUID);
//     }
// )
