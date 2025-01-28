import {useEffect, useRef, useState} from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl, {Marker} from 'mapbox-gl';

const MapboxTripMap = ({markers, callback}: { markers: Array<{ marker: Marker, key: string }>, callback: any }) => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(-123.113952);
    const [lat, setLat] = useState(49.2608724);
    const [zoom, setZoom] = useState(5);

    useEffect(() => {
        if (map.current || !mapContainer.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false,
        });


        map.current.addControl(new mapboxgl.AttributionControl({
            customAttribution: 'Trek'
        }));
    }, [markers, lat, lng, zoom]);

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

            for (const {marker, key} of markers) {
                marker.addTo(map.current);
                marker.getElement().addEventListener("click", () => {
                    const coords = marker.getLngLat();
                    map.current!.flyTo({
                        center: coords,
                        speed: 0.2
                    });
                    callback(key);
                });
            }
        }
    });

    useEffect(() => {
        if (markers[0] && map.current) {
            const lngLat = markers[0].marker.getLngLat();
            if (map.current.getCenter() !== lngLat) {
                map.current.flyTo({center: [lngLat.lng, lngLat.lat]})
            }
        }
    }, [markers]);

    return (
        <div ref={mapContainer} className="w-full h-full"/>
    );
};

export default MapboxTripMap;
