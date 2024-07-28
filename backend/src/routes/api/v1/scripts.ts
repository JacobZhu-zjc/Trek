import payload from "payload";
import { Trip } from "../../../types/tripTypes";
import { S3FileModel } from "../../mongodb/schemas/s3FileModel";
import { isDeepStrictEqual } from "util";
import { userModel } from "../../mongodb/schemas/userModel";
import { Where } from "payload/types";

// Function to detect if any of the provided props in "newData" have a different value than those in "originalData"
export const isEdited = (newData: any, originalData: any, fields: string[]): boolean => {
    for (const prop of fields) {
        if (newData[prop] !== undefined && !isEqual(newData[prop], originalData[prop])) {
            return true;
        }
    }
    return false;
};

// Helper function for object and array equality
const isEqual = (newData: any, originalData: any): boolean => {
    try {
        if (Array.isArray(newData) && Array.isArray(originalData)) {
            for (let i = 0; i < Math.max(newData.length, originalData.length); i++) {
                // Recursive call if array elements are objects
                if (typeof newData[i] === "object" && !isEqual(newData[i], originalData[i])) {
                    return false;
                }
            }
            return true;
        } else if (typeof newData === "object") {
            for (const prop of Object.keys(newData)) {
                // Recursive call over all properties if data is an object
                if (!isEqual(reduceMongoObject(newData)[prop], reduceMongoObject(originalData)[prop])) {
                    return false;
                }
            }
            return true;
        } else {
            return isDeepStrictEqual(reduceMongoObject(newData), reduceMongoObject(originalData));
        }
    } catch (error: any) {
        // Handling any unexpected errors to prevent the backend from crashing
        console.error("Unexpected error when checking object equality: " + error);
        return false;
    }
};

// Helper function to convert MongoDB objects into normal JS objects, if the input is a MongoDB object
const reduceMongoObject = (data: any): any => {
    if ({ ...data }.hasOwnProperty("_doc")) {
        return { ...data }.hasOwnProperty("_doc");
    }
    return data;
};

// Function to turn UUID field from buffer object to a string
export const stringifyUUID = (data: any): any => {
    if (data === null) {
        return null;
    }
    let toReturn = Object(data);
    toReturn["_doc"]["_id"] = String(toReturn["_id"]);
    return toReturn["_doc"];
};

// Function to remove fields from a retrieved model, for the purpose of limiting data sent by the endpoint
export const removeFields = (data: any, fields: string[]): any => {
    let toReturn = stringifyUUID(data);
    for (const prop of fields) {
        delete toReturn[prop];
    }
    return toReturn;
}

// Function to process trip data from MongoDB for use in frontend
export const formatTrips = async (data: any): Promise<any> => {
    try {
        // Replacing the "mainImage" field with the corresponding URL
        const mainImage: any = await S3FileModel.findById(data["mainImage"]);
        if (mainImage === null) {
            console.error("mainImage for trip not found: ObjectID = " + data["mainImage"]);
        } else {
            data["mainImage"] = mainImage["url"];
        }

        // Replacing each ObjectID in the "photos" field with their corresponding S3Files' URLs
        const photos = [];
        for (const objectid of data["photos"]) {
            const photo = await S3FileModel.findById(objectid);
            if (photo === null) {
                console.error("photo for trip not found: ObjectID = " + objectid);
            } else {
                photos.push(photo["url"]);
            }
        }
        data["photos"] = photos;

        // Returning early if the "areas" field doesn't exist
        if (!data.hasOwnProperty("areas")) {
            return data;
        }

        data.owner = await getUserData(data.owner);

        data.members = await Promise.all(data.members.map(async (member: any) => {
            return await getUserData(member);
        }));
        
        // Replacing each ObjectID in the "areas" field with the corresponding Destination's name
        data.areas = await formatDestinations(data.areas);
    } catch (error: any) {
        console.error("Error processing trip data for response: " + error);
    }

    return data;
};

// Function to process user data from MongoDB for use in frontend
export const formatUsers = async (data: any): Promise<any> => {
    try {
        // Replacing the "uploadedProfilePicture" field with the corresponding URL
        if (data.hasOwnProperty("uploadedProfilePicture")) {
            const uploadedProfilePicture: any = await S3FileModel.findById(data["uploadedProfilePicture"]);
            if (uploadedProfilePicture === null) {
                console.error("uploadedProfilePicture for user not found: ObjectID = " + data["mainImage"]);
            } else {
                data["uploadedProfilePicture"] = uploadedProfilePicture["url"];
            }
        }
    } catch (error: any) {
        console.error("Error processing user data for response: " + error);
    }
};


// Helper function to pull relevant user data from database for use in trips
const getUserData = async (data: any): Promise<any> => {
    const user = await userModel.findOne({ sub: data })
        .select('sub name username image');

    return user;
}

// Helper function to get & format destination information for use in trips
const formatDestinations = async (data: any): Promise<any> => {
    const destinations = [];
    for (const objectid of data) {
        try {
            const destination = await payload.findByID({
                collection: "destinations",
                id: objectid
            });
            // console.log(destination);
            if (destination === null) {
                console.error("area for trip not found: ObjectID = " + objectid);
            } else {
                destinations.push((destination as any)["properties"]["name"]);
            }
        } catch (error: any) {
            console.error("Error finding destination data for ObjectId: " + objectid + "\nError: " +error)
        }
    }

    return destinations;
};

/**
 * Stores the feature in the database as a Database if it does not already exist.
 * @param osm_id - The OpenStreetMap ID of the destination.
 * @param osm_type - The OpenStreetMap type of the destination.
 * @returns {mongoose.Types.ObjectId} - The ID of the stored destination.
 */
export async function storeAreaIfNotExists(osm_id: string, osm_type: string): Promise<any> {

    /** Look up Areas with same OSM_ID in DB */
    const query = {
        and: [
            {
                'properties.osm_id': {
                    equals: osm_id
                },
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
        console.log(destination.docs[0]);
        return destination.docs[0].id;
    }

    console.log("Area not found in DB, looking up in OSM");

    /** Look up Area Details in OSM (nominatim) if not found */
    const nominatimResult = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osm_type}${osm_id}&format=json&extratags=1`);
    const areas = await nominatimResult.json();
    const area = areas[0];

    console.log("Area found in OSM");

    /** Look up Timezone */
    const timezoneResult = await fetch(`https://api.geotimezone.com/public/timezone?latitude=${area.lat}&longitude=${area.lon}`);
    const timezone = await timezoneResult.json();

    console.log("Timezone found");

    /** Create Area in DB if not found */
    const newDestination = await payload.create<'destinations'>({
        collection: 'destinations',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [area.lon, area.lat]
            },
            properties: {
                osm_id: osm_id,
                osm_type: osm_type,
                wikidata_id: area.extratags?.wikidata,
                wikipedia: area.extratags?.wikipedia,
                destination_type: 'area',
                name: area.name,
                display_name: area.display_name,
                ...(timezone && {
                    timezone: timezone.iana_timezone
                }),
                ...(area.boundingbox && {
                    bbox: {
                        min_latitude: area.boundingbox[0],
                        max_latitude: area.boundingbox[1],
                        min_longitude: area.boundingbox[2],
                        max_longitude: area.boundingbox[3]
                    }
                })
            }
        }
    });

    console.log("Area created in DB");

    return newDestination.id;
}

/**
 * Gets the char osm_type to string osm_type
 * for example 'n' -> 'node'
 */
export function getOsmTypeString(osm_type: string): string {

    osm_type = osm_type.toLowerCase();

    switch (osm_type) {
        case 'n':
            return 'node';
        case 'w':
            return 'way';
        case 'r':
            return 'relation';
        default:
            return 'unknown';
    }
}
