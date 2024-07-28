/**
 * Types for TrekGeoJSON, an expansion of GeoJSON to include additional properties for destinations
 * @author Matthew Kang
 */

import { Feature, FeatureCollection, Point } from 'geojson';

interface TrekGeoJSONProperties {
    mapbox_id?: string;
    osm_id?: string;
    wikidata_id?: string;
    destination_type: 'poi' | 'address' | 'area';
    name: string;
    description?: string;
    address: string;
    main_photo?: {
        photo_url: string;
        attributions?: string;
        license?: string;
    };
    poi_category?: string;
    slug?: string;
}

export interface Destination extends Feature<Point> {
    _id: string;
    type: 'Feature';
    geometry: Point;
    properties: TrekGeoJSONProperties;
}

export interface Place extends Destination {
    properties: TrekGeoJSONProperties & {
        destination_type: 'poi';
        name: string;
        poi_category: string;
    };
}

export interface Address extends Destination {
    properties: TrekGeoJSONProperties & {
        destination_type: 'address';
        address: string;
    };
}

export interface Area extends Destination {
    properties: TrekGeoJSONProperties & {
        destination_type: 'area';
        name: string;
    };
}
