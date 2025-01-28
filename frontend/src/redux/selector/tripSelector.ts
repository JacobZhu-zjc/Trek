import {State} from "@trek-types/redux";
import {tripApi} from "../services/tripApi";

export const selectTrip = (uuid: string) => (state: State) =>
    tripApi.endpoints.getTrip.select(uuid)(state)?.data;
