import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Trip} from '@trek-types/trip';
import {BasicUser} from '@trek-types/user';
import {sec} from '../../security';

const hostname = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";
const API_URL = `${hostname}/api/v1/`;


export const tripApi = createApi({
    reducerPath: 'tripApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: async (headers) => {
            let accessToken = "";
            try {
                accessToken = await sec.getAccessTokenSilently()();
            } catch (error) {
                console.log(error);
            }
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            } else {
                console.log("!!! No token found in state");
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTrips: builder.query<Trip[], void>({
            query: () => 'trips',
        }),
        getTrip: builder.query<Trip, string>({
            query: (uuid) => `trips/${uuid}`,
        }),
        postTrip: builder.mutation<Trip, Partial<Trip>>({
            query: (data) => ({
                url: 'trips',
                method: 'POST',
                body: data,
            }),
        }),
        putTrip: builder.mutation<Trip, { uuid: string; trip: Partial<Trip> }>({
            query: ({uuid, trip}) => ({
                url: `trips/${uuid}`,
                method: 'PUT',
                body: trip,
            }),
        }),
        deleteTrip: builder.mutation<{ success: boolean }, string>({
            query: (uuid) => ({
                url: `trips/${uuid}`,
                method: 'DELETE',
            }),
        }),
        populateTripUsers: builder.mutation<BasicUser, { userSub: string; tripUUID: string }>({
            query: ({userSub}) => ({
                url: `users/id/${userSub}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetTripsQuery,
    useGetTripQuery,
    usePostTripMutation,
    usePutTripMutation,
    useDeleteTripMutation,
    usePopulateTripUsersMutation,
} = tripApi;
