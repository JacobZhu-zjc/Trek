import {createAsyncThunk} from "@reduxjs/toolkit";
import {tripActions} from "./actionTypes.ts";
import TripsService from "./service.ts";
import {Trip} from "../../interfaces.ts";

export const getTripsAsync = createAsyncThunk(
    tripActions.GET_TRIPS,
    async () => {
        return await TripsService.getTrips();
    }
);

export const getTripAsync = createAsyncThunk(
    tripActions.GET_TRIP,
    async (uuid: string) => {
        return await TripsService.getTrip(uuid);
    }
)

export const getMapAsync = createAsyncThunk(
    tripActions.GET_TRIP_MAP,
    async (uuid: string) => {
        return await TripsService.getMap(uuid);
    }
)

export const putTripAsync = createAsyncThunk(
    tripActions.PUT_TRIP,
    async(payload: {uuid: string, trip: Trip}) => {
        console.log(payload.trip);
        return await TripsService.putTrip(payload.uuid, payload.trip);
    }
)
