import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Destination} from '@trek-types/destination';
import {PaginatedResponse} from '@trek-types/payloadApiResponse';
import {ExploreWithDestination} from 'src/pages/ExploreArea/ExploreAreaApp';
import {Legal} from 'src/pages/LegalPages/LegalPagesApp';

export const payloadApi = createApi({
    reducerPath: 'payloadApi',
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.PROD ? window.location.origin : "http://localhost:3000"}/api/`}),
    endpoints: (builder) => ({

        getExplore: builder.query<PaginatedResponse<ExploreWithDestination>, string>({
            query: (queryString) => `explore/${queryString}`,
        }),

        upsertOsmDestination: builder.query<Destination, { osm_id: string; osm_type: string }>({
            query: ({osm_id, osm_type}) => ({
                url: 'destinations/upsert/osm',
                method: 'post',
                body: {
                    osm_id: osm_id,
                    osm_type: osm_type
                },
            }),
        }),

        getDestination: builder.query<Destination, string>({
            query: (destinationId) => `destinations/${destinationId}`,
            keepUnusedDataFor: 60
        }),

        getLegalPage: builder.query<Legal, string>({
            query: (id) => `legal/${id}`,
        }),

    }),
});

export const {
    useGetExploreQuery,
    useLazyUpsertOsmDestinationQuery,
    useLazyGetDestinationQuery,
    useGetDestinationQuery,
    useGetLegalPageQuery
} = payloadApi;
