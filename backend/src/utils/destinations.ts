import payload from "payload";
import {Where} from "payload/types";
import {downloadImageFromWikipedia} from "./wikipedia";
import {NominatimResponseFeature} from "../types/osm";

/**
 * Stores the feature in the database as a Database if it does not already exist.
 * @param osm_id - The OpenStreetMap ID of the destination.
 * @param osm_type - The OpenStreetMap type of the destination.
 * @returns {mongoose.Types.ObjectId} - The ID of the stored destination.
 */
export async function upsertDestinationFromOsmID(osm_id: string, osm_type: string): Promise<any> {
    osm_type = osm_type.toLowerCase();

    const query: Where = {
        and: [
            {
                'properties.osm_id': {
                    equals: osm_id
                },
            },
            {
                'properties.osm_type': {
                    equals: osm_type
                }
            }
        ]
    }


    const destination = await payload.find<'destinations'>({
        collection: 'destinations',
        where: query
    });

    if ((destination.docs as any).length > 0) {
        return destination.docs[0].id;
    }

    /** Look up Area Details in OSM (nominatim) if not found */
    const nominatimResult = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osm_type}${osm_id}&format=json&extratags=1&accept-language=en`);
    const features = await nominatimResult.json();

    if (features.length === 0) {
        console.error("Area not found in OSM");
        throw new Error("Area not found in OSM");
    }

    const feature = features[0];

    /** Look up Timezone and Download Photo */
    const [timezone, photoId] = await Promise.all([
        getTimezone(feature.lat, feature.lon).catch(error => {
            console.error('Error getting timezone:', error);
            return undefined;
        }),
        downloadImageFromWikipedia(feature.name).catch(error => {
            console.error('Error downloading image from Wikipedia:', error);
            return undefined;
        })
    ]);

    /** Create Area in DB if not found */
    const newDestination = await payload.create<'destinations'>({
        collection: 'destinations',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [feature.lon, feature.lat]
            },
            properties: {
                osm_id: osm_id,
                osm_type: osm_type,
                wikidata_id: feature.extratags?.wikidata,
                wikipedia: feature.extratags?.wikipedia,
                destination_type: determineDestinationType(feature.type, feature.class),
                name: feature.name || feature.display_name,
                display_name: feature.display_name,
                countrycode: feature.address?.country_code,
                ...(photoId && {
                    main_photo: photoId
                }),
                ...(timezone && {
                    timezone: timezone
                }),
                ...(feature.boundingbox && {
                    bbox: {
                        min_latitude: feature.boundingbox[0],
                        max_latitude: feature.boundingbox[1],
                        min_longitude: feature.boundingbox[2],
                        max_longitude: feature.boundingbox[3]
                    }
                })
            }
        }
    });

    return newDestination.id;
}

/**
 *
 */
export async function getTimezone(lat: number, lon: number): Promise<string> {
    const timezoneResult = await fetch(`https://api.geotimezone.com/public/timezone?latitude=${lat}&longitude=${lon}`);
    const timezone = await timezoneResult.json();

    if (!timezone || !timezone.iana_timezone) {
        console.error("Timezone not found");
        return Promise.reject("Timezone not found");
    }

    return Promise.resolve(timezone.iana_timezone);
}


/**
 * Determines the type of the destination based on the OSM class / type.
 */
export function determineDestinationType(osm_type: string, osm_class?: string): string {

    if (osm_class) {
        switch (osm_class) {
            case "building":
                return "address";
            case "boundary":
                return "area";
            default:
                return "poi";
        }
    }

    switch (osm_type) {
        case "city":
            return "area";
        case "town":
            return "area";
        case "village":
            return "area";
        case "hamlet":
            return "area";
        case "suburb":
            return "area";
        case "neighbourhood":
            return "area";
        case "amenity":
            return "poi";
        case "tourism":
            return "poi";
        case "historic":
            return "poi";
        case "leisure":
            return "poi";
        case "shop":
            return "poi";
        case "office":
            return "address";
        case "building":
            return "address";
        default:
            return "poi";
    }
}

/**
 * Inserts a new destination into the database if its OSM ID+Type does not already exist.
 */
export async function upsertDestination(feature: NominatimResponseFeature): Promise<any> {

    const query: Where = {
        and: [
            {
                'properties.osm_id': {
                    equals: String(feature.osm_id)
                },
            },
            {
                'properties.osm_type': {
                    equals: feature.osm_type.toLowerCase()
                }
            }
        ]
    }


    const destinationsResult = await payload.find<'destinations'>({
        collection: 'destinations',
        where: query
    });


    /**
     * Fast resolve if destination already exists.
     */
    if ((destinationsResult.docs as any).length > 0) {
        return Promise.resolve(destinationsResult.docs[0]);
    }


    /**
     * Look up Timezone
     */
    const timezone = await getTimezone(Number(feature.lat), Number(feature.lon)).catch(error => {
        return undefined;
    });

    const newDestination = await payload.create({
        collection: 'destinations',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [feature.lon, feature.lat]
            },
            properties: {
                osm_id: feature.osm_id,
                osm_type: feature.osm_type,
                wikidata_id: feature.extratags?.wikidata,
                wikipedia: feature.extratags?.wikipedia,
                destination_type: determineDestinationType(feature.type || '', feature.class),
                name: feature.name || feature.display_name,
                display_name: feature.display_name,
                ...(feature.boundingbox && {
                    bbox: {
                        min_latitude: feature.boundingbox[0],
                        max_latitude: feature.boundingbox[1],
                        min_longitude: feature.boundingbox[2],
                        max_longitude: feature.boundingbox[3]
                    }
                }),
                ...(timezone && {
                    timezone: timezone
                })
            }
        }
    });

    return Promise.resolve(newDestination);
}
