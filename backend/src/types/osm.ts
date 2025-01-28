export type NominatimResponse = NominatimResponseFeature[];

export interface NominatimResponseFeature {
    place_id?: number;
    licence?: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    display_name?: string;
    boundingbox?: string[];
    class?: string;
    type?: string;
    importance?: number;
    addresstype?: string;
    name: string;
    extratags?: {
        is_in?: string;
        wikidata?: string;
        wikipedia?: string;
    };
}

