export const tripActions = {
    GET_TRIPS: 'trips/:subtoken',
    GET_TRIPS_PAGINATED: 'trips/paginated',
    GET_USER_TRIPS: 'trips/:username',
    GET_TRIP: 'GET trips/:uuid',
    GET_TRIP_MAP: 'trips/:uuid/map',
    GET_TRIP_TIMELINE: 'trips/:uuid/timeline',
    GET_TRIP_PICTURE: 'trips/:uuid/picture',
    POST_TRIP: 'trips/',
    PUT_TRIP: 'PUT trips/:uuid',
    PUT_TRIP_MAP: 'trips/:uuid/map',
    DELETE_TRIP: 'trips/:uuid',
    POPULATE_TRIP_USERS: 'populate_trip_users',
    PUT_PICTURE: 'PUT trips/:uuid/picture',
    GET_PICTURE: 'trips/:uuid/picture',
    PUT_MANAGEMENT: 'trips/:uuid/management',
};
