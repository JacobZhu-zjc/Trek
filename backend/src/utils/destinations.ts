import payload from "payload";
import { Where } from "payload/types";

/**
 * Stores the feature in the database as a Database if it does not already exist.
 * @param osm_id - The OpenStreetMap ID of the destination.
 * @param osm_type - The OpenStreetMap type of the destination.
 * @returns {mongoose.Types.ObjectId} - The ID of the stored destination.
 */
export async function upsertDestination(osm_id: string, osm_type: string): Promise<any> {

    console.log("Hello World");
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
        console.log("Area found in DB");
        console.log(destination.docs.length);
        return destination.docs[0].id;
    }

    console.log("Area not found in DB, looking up in OSM");

    /** Look up Area Details in OSM (nominatim) if not found */
    const nominatimResult = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osm_type}${osm_id}&format=json&extratags=1`);
    const features = await nominatimResult.json();

    if (features.length === 0) {
        console.log("Area not found in OSM");
        throw new Error("Area not found in OSM");
    }

    const feature = features[0];

    console.log("Area found in OSM");

    /** Look up Timezone */
    const timezoneResult = await fetch(`https://api.geotimezone.com/public/timezone?latitude=${feature.lat}&longitude=${feature.lon}`);
    const timezone = await timezoneResult.json();

    if (!timezone || !timezone.iana_timezone) {
        console.log("Timezone not found");
        // throw new Error("Timezone not found"); do not throw error if timezone not found
    }

    console.log("Timezone found");


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
                destination_type: determineDestinationType(feature.class, feature.type),
                name: feature.name || feature.display_name,
                display_name: feature.display_name,
                ...(timezone && {
                    timezone: timezone.iana_timezone
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

    console.log("Area created in DB");

    return newDestination.id;
}


/**
 * Determines the type of the destination based on the OSM class / type.
 */
export function determineDestinationType(osm_class: string, osm_type: string): string {
    switch (osm_class) {
        case "building":
            return "address";
        case "boundary":
            return "area";
        default:
            return "poi";
    }
}