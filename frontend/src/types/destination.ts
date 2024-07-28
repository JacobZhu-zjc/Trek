import { Feature, Point } from 'geojson';
import { Media } from './payload-types';


interface TrekGeoJSONProperties {
    mapbox_id: string;
    osm_id?: string;
    destination_type: 'poi' | 'address' | 'area';
    name: string;
    description?: string;
    display_name?: string;
    address: string;
    main_photo?: Media;
    slug?: string;
    poi_category?: PlaceCategory;
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
        poi_category: PlaceCategory;
        name: string;
    };
}

export type PlaceCategory = "Activity" | "Accomodation" | "Landmark" | "Food and Restaurant" | "Shopping" | "Other";

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