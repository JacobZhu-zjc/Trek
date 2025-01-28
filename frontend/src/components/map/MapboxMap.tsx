import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {useEffect, useRef, useState} from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';
import {Feature, FeatureCollection, Geometry, GeoJsonProperties} from 'geojson';
import DestinationCard from '@components/cards/destination-card/DestinationCard';
import {Draggable, Droppable} from '@hello-pangea/dnd';
import classes from './DndList.module.css';
import cx from 'clsx';
import {Destination} from '@trek-types/destination';
import {useLazyUpsertOsmDestinationQuery} from '../../redux/services/payloadApi';

const MapboxMap = () => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(-123.113952);
    const [lat, setLat] = useState(49.2608724);
    const [zoom, setZoom] = useState(9);

    const [selectedFeature, setSelectedFeature] = useState<Feature<Geometry, GeoJsonProperties> | null>(null);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

    const [trigger, {data}] = useLazyUpsertOsmDestinationQuery();

    useEffect(() => {
        if (selectedFeature) {
            const osm_id = selectedFeature.properties?.osm_id;
            const osm_type = selectedFeature.properties?.osm_type;
            if (osm_id && osm_type) {
                trigger({osm_id, osm_type});
            }
        }

    }, [selectedFeature, trigger]);

    useEffect(() => {
        if (data) {
            console.log('data: ', data);
            setSelectedDestination(data);
        }
    }, [data]);


    function photonGeocoder(searchInput: string): Promise<FeatureCollection<Geometry, GeoJsonProperties>> {
        return new Promise((resolve) => {
            const query = `https://photon.komoot.io/api/?q=${searchInput}&lat=${map.current?.getCenter()?.lat}&lon=${map.current?.getCenter()?.lng}`;
            console.log('query', query);

            fetch(query)
                .then(response => response.json())
                .then(data => {
                    const photonFeatures = data.features;
                    const newData = photonFeatures.map((feature: Feature) => {
                        if (feature.geometry.type === 'Point') {
                            return {
                                id: String(feature.properties?.osm_id),
                                type: 'Feature',
                                place_name: `${feature.properties?.name}`,
                                geometry: feature.geometry.coordinates,
                                center: feature.geometry.coordinates,
                                text: "",
                                properties: feature.properties
                            };
                        }
                        return feature;
                    });
                    const updatedFeatures: FeatureCollection<Geometry, GeoJsonProperties> = {
                        ...data,
                        features: newData
                    };
                    console.log("resolving ", updatedFeatures);
                    resolve(newData);
                })
                .catch(error => {
                    console.log("in error");
                    console.error('Error..:', error);
                });
        });
    }

    useEffect(() => {
        if (map.current || !mapContainer.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false,
        });

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            trackProximity: true,
            enableGeolocation: true,
            externalGeocoder: photonGeocoder,
            zoom: zoom,
            placeholder: 'Try: University of British Columbia',
            marker: true,
            /** @ts-expect-error red underline due to .dist probably */
            mapboxgl: mapboxgl,
            reverseGeocode: true,
            types: 'address',
        });

        map.current.addControl(geocoder);

        map.current.addControl(new mapboxgl.AttributionControl({
            customAttribution: 'Trek'
        }));

        geocoder.on('result', (event) => {
            setSelectedFeature(event.result);
        });

        geocoder.on('results', () => {
            setSelectedDestination(null);
        });
    });

    useEffect(() => {
        if (!map.current) {
            return; // wait for map to initialize
        } else {
            map.current.on("move", () => {
                const lngValue = map.current?.getCenter()?.lng
                const latValue = map.current?.getCenter()?.lat
                const zoomValue = map.current?.getZoom()
                if (lngValue && latValue && zoomValue) {
                    setLng(Number(lngValue));
                    setLat(Number(latValue));
                    setZoom(Number(zoomValue));
                }
            });
        }
    });

    useEffect(() => {
        console.log('selectedDestination', JSON.stringify(selectedDestination));
    }, [selectedDestination]);

    return (
        <div className='h-full' style={{position: 'relative'}}>
            <div ref={mapContainer} className="h-full"/>
            {selectedDestination &&
                (<div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '10px',
                }}>
                    <Droppable droppableId="search" direction="vertical">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>

                                <Draggable draggableId={selectedDestination.id?.toString() || ''} index={0}
                                           key={selectedDestination.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            className={cx(classes.item, {[classes.itemDragging]: snapshot.isDragging})}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            <DestinationCard destination={selectedDestination}/>
                                        </div>
                                    )}
                                </Draggable>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>)}
        </div>
    );
};

export default MapboxMap;
