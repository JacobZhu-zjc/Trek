import {User} from "@trek-types/user.ts";
import {BasicTrip, Trip} from "@trek-types/trip.ts";
import {tripApi} from "../redux/services/tripApi";

export interface State {
    [tripApi.reducerPath]: ReturnType<typeof tripApi.reducer>,
    trip: {
        current: Trip,
        basicUUIDS: string[],
        basicTrips: BasicTrip[],
        status: string,
        error: object,
        totalPages: number,
    },
    user: {
        self: User,
        requestedUsers: User[],
        // settings:
    }
}
