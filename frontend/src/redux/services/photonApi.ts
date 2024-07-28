import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';


export const photonApi = createApi({
  reducerPath: 'photonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://photon.komoot.io/api/' }),
  endpoints: (builder) => ({
    getLocations: builder.query<FeatureCollection<Geometry, GeoJsonProperties>, string>({
      query: (searchText) => `?q=${searchText}
              &osm_tag=place:country
              &osm_tag=place:state
              &osm_tag=place:region
              &osm_tag=place:province
              &osm_tag=place:district
              &osm_tag=place:county
              &osm_tag=place:subdistrict
              &osm_tag=place:municipality
              &osm_tag=place:city
              &osm_tag=place:borough
              &osm_tag=place:town
              &osm_tag=place:village
              &osm_tag=place:hamlet`,
    }),
    getPlacesAndAreas: builder.query<FeatureCollection<Geometry, GeoJsonProperties>, { searchText: string, lat: number, lon: number }>({
      query: ({ searchText, lat, lon }) => `?q=${searchText}&lat=${lat}&lon=${lon}`,
    }),
  }),
});

export const { useLazyGetLocationsQuery, useLazyGetPlacesAndAreasQuery } = photonApi;
