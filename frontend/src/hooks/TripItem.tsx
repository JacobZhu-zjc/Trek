import {Destination} from "@trek-types/destination";
import {TripItem} from "@trek-types/trip-item/tripItem";
import {useEffect, useRef, useState} from "react";
import {useLazyGetDestinationQuery} from "../redux/services/payloadApi";

export type TripItemWithDestination = { tripItem: TripItem; destination: Destination | null | undefined };

export const useFetchMultipleDestinations = (tripItems: TripItem[]) => {
    const [destinationPairs, setDestinationPairs] = useState<TripItemWithDestination[]>([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trigger] = useLazyGetDestinationQuery();
    // local cache to store the fetched destinations by item_id
    const cacheRef = useRef<Map<string, Destination | null>>(new Map());

    useEffect(() => {
        if (tripItems.length >= 0) {
            setIsLoading(true);
            Promise.all(tripItems.map(async (item) => {
                if (cacheRef.current.has(item.item_id)) {
                    return {tripItem: item, destination: cacheRef.current.get(item.item_id)};
                } else {
                    try {
                        const destination = await trigger(item.item_id).unwrap();
                        cacheRef.current.set(item.item_id, destination);
                        if (!destination) {
                            return {tripItem: item, destination: null};
                        } else {
                            return {tripItem: item, destination};
                        }
                    } catch (fetchError) {
                        return {tripItem: item, destination: null}; // or handle the error differently
                    }
                }
            }))
                .then(pairs => setDestinationPairs(pairs))
                .catch(setError)
                .finally(() => setIsLoading(false));
        }
    }, [tripItems, trigger]);

    return {destinationPairs, isLoading, error};
};
