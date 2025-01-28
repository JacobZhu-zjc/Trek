import {useEffect, useMemo, useState} from 'react';
import {Button, Container,} from '@mantine/core';
import {useSelector} from "react-redux";
import {useNavigate, useParams} from 'react-router-dom';
import MapboxTripMap from "./components/MapboxTripMap.tsx";
import {useSocket} from "../../hooks/UseSocket.ts";
import {TripItemWithDestination, useFetchMultipleDestinations} from "../../hooks/TripItem.tsx";
import {Marker} from "mapbox-gl";
import TripItemInfo from "./components/TripItemInfo.tsx";
import {selectTrip} from '../../redux/selector/tripSelector.ts';
import Failure from '@components/alerts/Failure.tsx';


const TripMapApp = () => {

    const tripUUID = useParams().uuid as string;
    const trip = useSelector(selectTrip(tripUUID));
    const navigate = useNavigate();


    const {itemList} = useSocket();

    const {destinationPairs, isLoading} = useFetchMultipleDestinations(itemList);
    const [markers, setMarkers] = useState<Array<{ marker: Marker, key: string }>>([]);

    const [selectedTripItemWithDest, setSelectedTripItemWithDest] = useState<TripItemWithDestination>();

    useEffect(() => {
        if (destinationPairs[0] && destinationPairs[0].tripItem && destinationPairs[0].tripItem.key) {
            setSelectedTripItemWithDest(destinationPairs[0]);
        }
    }, [destinationPairs]);


    useEffect(() => {
        if (!isLoading) {
            const tempMarkers = [];
            for (const destPair of destinationPairs) {
                const dest = destPair.destination;
                if (dest) {
                    tempMarkers.push({
                        marker: new Marker().setLngLat(dest.geometry as unknown as [number, number]),
                        key: destPair.tripItem.key
                    });
                }
            }

            setMarkers(tempMarkers);
        }
    }, [destinationPairs, isLoading]);


    /** Set Page Title To "Map" */
    useEffect(() => {
        document.title = "Map";
    });

    const tripMap = useMemo(() => {
        function tripItemCallback(key: string) {
            const item = destinationPairs.filter((elt) => elt.tripItem.key === key);
            if (item.length === 1 && item[0].destination) {
                setSelectedTripItemWithDest(item[0]);
            }
        }

        return (<MapboxTripMap markers={markers} callback={tripItemCallback}/>)
    }, [markers, destinationPairs]);


    if (trip) {
        return (
            <>
                <div className="w-full">
                    <Container h={500} size={"max-width"}>
                        {tripMap}
                    </Container>

                    {
                        selectedTripItemWithDest &&
                        <TripItemInfo selectedWithDest={selectedTripItemWithDest}/>
                    }

                    {
                        !selectedTripItemWithDest &&
                        <Failure msg={
                            <>
                                <p>Please add a trip item to begin.</p>
                                <Button variant="filled" onClick={() => navigate(`/trip/${tripUUID}/timeline`)}>Go to
                                    Timeline Page</Button>
                            </>}/>
                    }

                </div>
            </>
        )
    } else {
        return (
            <></>
        )
    }

}

export default TripMapApp;
