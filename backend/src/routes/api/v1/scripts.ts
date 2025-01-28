import payload from "payload";
import {S3FileModel} from "../../mongodb/schemas/s3FileModel";
import {isDeepStrictEqual} from "util";
import {userModel} from "../../mongodb/schemas/userModel";

interface Address {
    tourism?: string,
    house_number?: string,
    road?: string,
    quarter?: string,
    suburb?: string,
    county?: string,
    city?: string,
    state?: string,
    "ISO3116-2-lv14"?: string,
    postcode?: string,
    country?: string,
    country_code?: string,
}

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
export const isEqual = (newData: any, originalData: any): boolean => {
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
    if ({...data}.hasOwnProperty("_doc")) {
        return {...data}.hasOwnProperty("_doc");
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
        if (toReturn[prop]) {
            delete toReturn[prop];
        }
    }
    return toReturn;
}

// Function to process trip data from MongoDB for use in frontend
export const formatTrips = async (data: any): Promise<any> => {
    try {
        // Adding a field called "mainImageURL", mapping the "mainImage" field to the corresponding URL
        if (data.hasOwnProperty("mainImage")) {
            const mainImage: any = await S3FileModel.findById(data["mainImage"]);
            if (mainImage === null) {
                console.error("mainImage for trip not found: ObjectID = " + data["mainImage"]);
            } else {
                data["mainImageURL"] = mainImage["url"];
            }
        } else {
            data["mainImageURL"] = "";
        }

        // Adding a field called "photoURLS", mapping each ObjectID in the "photos" field to their corresponding S3Files' URLs
        if (data.hasOwnProperty("photos")) {
            const photos = [];
            for (const objectid of data["photos"]) {
                const photo = await S3FileModel.findById(objectid);
                if (photo === null) {
                    console.error("photo for trip not found: ObjectID = " + objectid);
                } else {
                    photos.push(photo["url"]);
                }
            }
            data["photoURLs"] = photos;
        } else {
            data["photoURLs"] = [];
        }

        if (data.hasOwnProperty("owner")) {
            data["ownerUser"] = await formatUsers(stringifyUUID(await getUserData(data.owner)));
        }

        if (data.hasOwnProperty("members")) {
            data["nonOwnerUsers"] = [];
            for (const member of data.members) {
                const userData = await getUserData(member);
                if (userData) {
                    data["nonOwnerUsers"].push(await formatUsers(stringifyUUID(userData)));
                }
            }
        }

        if (data.hasOwnProperty("areas")) {
            // Adding a field called "areasNames", which maps each area's ObjectId to its corresponding destination's name
            data["areaNames"] = await formatDestinations(data.areas);
        }


        // Fetching destinations from their ideas to return
        const destObjs = [];
        const destIDs = data.dest;
        for (const destID of destIDs) {
            const query = {
                '_id': {
                    equals: destID
                },
            }
            const destination = await payload.find<'destinations'>({
                collection: 'destinations',
                where: query,
                depth: 4
            });
            if ((destination.docs as any).length > 0) {
                destObjs.push(destination.docs[0]);
            }
        }
        data["destObjs"] = destObjs;

        // Fetching starting location as a destination
        const startDestQuery = await payload.find<'destinations'>({
            collection: 'destinations',
            where: {
                '_id': {
                    equals: data.start
                }
            }
        });
        if (((startDestQuery.docs) as any).length > 0) {
            data["startObj"] = startDestQuery.docs[0];
        }

    } catch (error: any) {
        console.error("Error processing trip data for response: " + error);
    }

    return data;
};

// Function to process user data from MongoDB for use in frontend
export const formatUsers = async (data: any): Promise<any> => {
    try {
        // Adding a "uploadedProfilePictureURL" field, mapping the value of "uploadedProfilePicture" to its corresponding URL
        if (data.hasOwnProperty("uploadedProfilePicture")) {
            if (data["uploadedProfilePicture"] === null) {
                // User wants to remove profile picture
                data["uploadedProfilePictureURL"] = "";
                return data;
            }
            const uploadedProfilePicture: any = await S3FileModel.findById(data["uploadedProfilePicture"]);
            if (uploadedProfilePicture === null) {
                console.error("uploadedProfilePicture for user not found: ObjectID = " + data["uploadedProfilePicture"]);
            } else {
                data["uploadedProfilePictureURL"] = uploadedProfilePicture["url"];
            }
        } else {
            data["uploadedProfilePictureURL"] = "";
        }
    } catch (error: any) {
        console.error("Error processing user data for response: " + error);
    }
    return data;
};

// Helper function to pull relevant user data from database for use in trips
const getUserData = async (data: any): Promise<any> => {
    const user = await userModel.findOne({sub: data})
        .select('sub name username image uploadedProfilePicture');

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
            if (destination === null) {
                console.error("area for trip not found: ObjectID = " + objectid);
            } else {
                destinations.push((destination as any)["properties"]["name"]);
            }
        } catch (error: any) {
            console.error("Error finding destination data for ObjectId: " + objectid + "\nError: " + error)
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
                    equals: osm_type.toLowerCase()
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
    const nominatimResult = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osm_type}${osm_id}&format=json&extratags=1`);
    const areas = await nominatimResult.json();
    const area = areas[0];

    /** Look up Timezone */
    const timezoneResult = await fetch(`https://api.geotimezone.com/public/timezone?latitude=${area.lat}&longitude=${area.lon}`);
    const timezone = await timezoneResult.json();

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
                countrycode: area.address?.country_code,
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
                }),
                address: getAddressAsString(area.address)
            }
        }
    });

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

/**
 * Converts an OSM Address object to a single string for display purposes.
 *
 * @param address The address object returned from the OSM API.
 */
function getAddressAsString(address: Address) {
    let stringifiedAddr = `
        ${address.house_number ?? ""} ${address.road ?? ""}\n
        ${address.city ? address.city + ", " : ""}${address.state ?? ""}\n
        ${address.country ?? ""} ${address.postcode ?? ""}
    `;

    return stringifiedAddr;
}
