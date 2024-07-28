import {BasicTrip, Trip} from "@trek-types/trip.ts";
import {User} from "@trek-types/user.ts";

export interface State {
    trip: {
        current: Trip,
        basicUUIDS: string[],
        basicTrips: BasicTrip[],
        status: string,
    },
    user: {
        self: User,
        requestedUsers: User[],
        // settings:
    }
}
