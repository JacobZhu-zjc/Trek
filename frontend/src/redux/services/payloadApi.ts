import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Destination } from '@trek-types/destination';
import { PaginatedResponse } from '@trek-types/payloadApiResponse';
import { ExploreWithDestination } from 'src/pages/ExploreArea/ExploreAreaApp';

export const payloadApi = createApi({
  reducerPath: 'payloadApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: (builder) => ({
    getExplore: builder.query<PaginatedResponse<ExploreWithDestination>, string>({
      query: (queryString) => `explore/${queryString}`,
    }),
    upsertOsmDestination: builder.query<Destination, { osm_id: string; osm_type: string }>({
      query: ({ osm_id, osm_type }) => ({
        url: 'destinations/upsert/osm',
        method: 'post',
        body: {
          osm_id: osm_id,
          osm_type: osm_type
        },
      }),
    }),
  }),
});

export const { useGetExploreQuery, useLazyUpsertOsmDestinationQuery } = payloadApi;
