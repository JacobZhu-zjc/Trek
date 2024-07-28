/**
 * @fileoverview Hook to search for destinations by combining Photon (OSM) and Mapbox (Geocoding V6) APIs
 * - Photon/OSM API is used to search for POIs and Areas
 * - Mapbox Forward Geocoding V6 API is used to search for addresses
 * @author Matthew Kang
 */
import { useState, useCallback } from 'react';
import { FeatureCollection, Feature } from 'geojson';

type PhotonResponse = FeatureCollection; // Replace with the actual type of the response from API 1
type MapboxResponse = FeatureCollection; // Replace with the actual type of the response from API 2
type CombinedData = Feature[]; // Replace with the type of the combined data

interface UseLazyCombinedDataResult {
    data: CombinedData | null;
    isLoading: boolean;
    error: Error | null;
    trigger: () => void;
}

const useLazyDestinationQuery = (): UseLazyCombinedDataResult => {

    const photonApiUrl = 'https://photon.komoot.io/api/?q=6551%20Arbutus%20Street%20Vancouver%20BC%20Canada';
    const mapboxApiUrl = 'https://api.mapbox.com/search/geocode/v6/forward?proximity=ip&access_token=pk.eyJ1IjoidHJla2tlcnMtcHJvamVjdCIsImEiOiJjbHloaXUxcTkwNDAwMnFxMG91OGpyMjdpIn0.liCJENmSeSYcYzyuvbFEvA&q=39%20west%2038th%20ave%2C%20vancouver';

    const [data, setData] = useState<CombinedData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [response1, response2] = await Promise.all([fetch(photonApiUrl), fetch(mapboxApiUrl)]);

            if (!response1.ok || !response2.ok) {
                throw new Error('Failed to fetch data');
            }

            const data1: PhotonResponse = await response1.json();
            const data2: MapboxResponse = await response2.json();

            // Combine the data from both APIs in the desired format
            const combinedData: CombinedData = [...data1.features, ...data2.features];

            setData(combinedData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, error, trigger: fetchData };
};

export default useLazyDestinationQuery;

