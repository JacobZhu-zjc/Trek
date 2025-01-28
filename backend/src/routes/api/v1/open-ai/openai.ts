import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import {messageModel} from "../../../mongodb/schemas/messageModel";
import {tripModel} from "../../../mongodb/schemas/tripModel";
import {jwtDecode} from "jwt-decode";
import OpenAI from 'openai';
import payload from "payload";
import {Feature, Geometry} from "geojson";
import {determineDestinationType, upsertDestination} from "../../../../utils/destinations";
import {NominatimResponse} from "../../../../types/osm";
import {SYSTEM_PROMPT} from "./prompt";
import {Readable} from "stream";
import {Message} from "../../../../types/openAi";
import {Destination} from "../../../../types/payload-types";

const {auth} = require('express-oauth2-jwt-bearer');
require('dotenv').config();
const router = express.Router();
router.use(cors());
router.use(express.json());

const jwtCheck = auth({
    audience: process.env.API_AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* NOTE: these endpoints are all /api/v1/ */

// Endpoint to recieve user message
router.put('/:uuid', jwtCheck, async (req, res, next) => {
    const {uuid} = req.params;
    const {text, userExperience} = req.body;

    // Store the message in MongoDB here

    res.status(200).send({message: 'Message received'});
});

// Endpoint to receive and send back a message and also save messages
router.put('/:uuid/stream', jwtCheck, async (req: Request, res: Response, next: NextFunction) => {

    // Establishing that the user is logged-in
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({"error": "Missing authentication"});
    }
    const sub = jwtDecode(token)["sub"];

    // Getting trip data to check if trip exists, and to find the members
    let data = null;
    try {
        data = await tripModel.findById(req.params.uuid);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }
    // Sending a 404 response if the trip does not exist
    if (data === null) {
        return res.status(404).send();
    }

    // Checking if the user is authenticated to access chat history for a trip
    if (!sub || !data["members"].includes(sub)) {
        return res.status(401).send({"error": "This user is not authorized to access this Trip's data"});
    }

    // Setting up input for OpenAI API
    const userInput: string = req.body["text"];
    const openai = new OpenAI({apiKey: OPENAI_API_KEY});
    const prevMessages = await messageModel.find({"sub": sub, "tripUUID": req.params.uuid});

    // Log user message in the background
    messageModel.create({
        "sub": sub,
        "tripUUID": req.params.uuid,
        "text": userInput,
        "sender": "user",
    }).catch(error => console.error("Error logging user message:", error));


    /**
     * Streaming Responses
     */
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');


    let experience = req.body["userExperience"];
    if (experience.tosAgreement === false) {
        experience = {
            travelFrequency: '',
            ageRange: 18,
            occupation: '',
            passports: [],
            visas: [],
            connectivityNeeds: '',
            activities: [],
            dining: [],
            climateAndWeather: [],
            culture: [],
            language: '',
            healthAndAccessibility: '',
            safety: '',
            travelStyle: [],
            tripDuration: '',
            transportPreferences: [],
            accommodationBudget: {lo: 0, hi: 1000, _id: ''},
            diningBudget: {lo: 0, hi: 1000, _id: ''},
            activitiesBudget: {lo: 0, hi: 1000, _id: ''},
            tosAgreement: false
        }

    }
    console.log(experience);

    /**
     * Send the user message to OpenAI API
     */
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'system', content: SYSTEM_PROMPT},
            {
                role: 'system',
                content: "Here are the travel preferences of the user, as well as some other pertinent information about them: \n"
                    + "Travel frequency: " + experience["travelFrequency"] + "; "
                    + "age range for activities: " + experience["ageRange"] + "; "
                    + "occupation: " + experience["occupation"] + "; "
                    + "passports held: " + experience["passports"].join(", ") + "; "
                    + "visas held: " + experience["visas"].join(", ") + "; "
                    + "connectivity needs: " + experience["connectivityNeeds"] + "; "
                    + "favourite activities: " + experience["activities"].join(", ") + "; "
                    + "preferred dining: " + experience["dining"].join(", ") + "; "
                    + "climate preferences: " + experience["climateAndWeather"].join(", ") + "; "
                    + "preferred cultural influences: " + experience["culture"].join(", ") + "; "
                    + "main language of fluency: " + experience["language"] + "; "
                    + "health and accessibility needs are: " + experience["healthAndAccessibility"] + "; "
                    + "safety preferences: " + experience["safety"] + "; "
                    + "travel style preferences: " + experience["travelStyle"].join(", ") + "; "
                    + "trip duration preference: " + experience["tripDuration"] + "; "
                    + "transportation preferences: " + experience["transportPreferences"].join(", ") + "; "
                    + "accomodation budget: between " + experience["accommodationBudget"]["lo"] + " and " + experience["accommodationBudget"]["hi"] + "; "
                    + "dining budget: between " + experience["diningBudget"]["lo"] + " and " + experience["diningBudget"]["hi"] + "; "
                    + "budget for activities: between " + experience["activitiesBudget"]["lo"] + " and " + experience["activitiesBudget"]["hi"] + "."
            },
            ...prevMessages.map(message => ({
                role: ((message.sender === "user") ? "user" : "assistant") as "user" | "assistant",
                content: (message.text === null) ? "" : message.text,
            })),
            {role: "user", content: userInput}
        ],
        stream: true
    });


    const reader = Readable.from(completion);

    let accumulatedText = '';

    reader.on('data', (chunk) => {
        const content = chunk.choices[0].delta.content;
        if (content) {
            accumulatedText += content;
            res.write(`${content}`);
        }
    });

    reader.on('end', async () => {
        // Write <DONE> marker
        res.write(`\n\n<DONE>\n\n`);

        // Find locations in accumulatedText
        const locations: [string, string][] = findPairsBetweenBrackets(accumulatedText);
        const destinationIds: string[] = [];

        // Process destinations
        if (locations.length > 0) {
            try {
                const promises = locations.map(loc => findDestination(loc[0], loc[1]));
                const results = await Promise.allSettled(promises);
                const fulfilledResults = results
                    .filter(result => result.status === "fulfilled")
                    .map(result => (result as PromiseFulfilledResult<any>).value);

                // Write JSON results
                res.write(JSON.stringify(fulfilledResults));
                fulfilledResults.forEach((destination: any) => {
                    destinationIds.push(destination.id);
                });
            } catch (error) {
                console.error("Error finding destinations:", error);
                // Handle error if necessary
            }
        }

        // Log assistant message in the background
        messageModel.create({
            "sub": sub,
            "tripUUID": req.params.uuid,
            "text": accumulatedText,
            "sender": "assistant",
            "destinations": destinationIds
        }).catch(error => console.error("Error logging assistant message:", error));


        // End the response
        res.end();
    });

    reader.on('error', (error) => {
        console.error('Error:', error);
        res.end();
    });

});

// Endpoint to get message history (ie. for when a user revisits the chatbot page)
router.get('/:uuid', jwtCheck, async (req, res, _next) => {
    // Establishing that the user is logged-in
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({"error": "Missing authentication"});
    }
    const sub = jwtDecode(token)["sub"];

    // Getting trip data to check if trip exists, and to find the members
    let data = null;
    try {
        data = await tripModel.findById(req.params.uuid);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }
    // Sending a 404 response if the trip does not exist
    if (data === null) {
        return res.status(404).send();
    }

    // Checking if the user is authenticated to access chat history for a trip
    if (!sub || !data["members"].includes(sub)) {
        return res.status(401).send({"error": "This user is not authorized to access this Trip's data"});
    }

    type MessageWithDestination = Message & { destinationsResolved?: Destination[] };


    const messages: Message[] = await messageModel.find({"sub": sub, "tripUUID": req.params.uuid}).lean();
    const messagesResolved: MessageWithDestination[] = [];

    // replaces message.destinations with the actual destination objects
    for (const message of messages) {
        if (message.destinations && Array.isArray(message.destinations)) {
            const promises = message.destinations.map((dest: string) => payload.findByID<'destinations'>({
                collection: 'destinations',
                id: dest,
                depth: 4
            }));

            const destinationsResult = await Promise.allSettled(promises);

            const fulfilledResults = destinationsResult
                .filter(result => result.status === "fulfilled")
                .map(result => result.value as any as Destination);

            messagesResolved.push({...message, destinationsResolved: fulfilledResults});
        } else {
            messagesResolved.push(message);
        }
    }

    res.json(messagesResolved);
});

/**
 *  @deprecated Helper function to find all the text between square brackets in a string, and return it in the form of an array
 */
const findTextBetweenBrackets = (message: string): string[] => {

    // Use a regular expression to match text between square brackets
    const regex = /\[([^\]]+)\]/g;
    const matches = [];
    let match;

    // Loop through all matches in the input string
    while ((match = regex.exec(message)) !== null) {
        matches.push(match[1]);
    }

    return matches;
};

/**
 * findPairsBetweenBrackets
 *
 * @param message from the OpenAI API response
 * @returns [string, string][] array of pairs of destination names and country codes
 *          ignores square brackets without a "||" separator
 *          Country code must be 2 characters long (excluding whitespaces)
 */
const findPairsBetweenBrackets = (message: string): [string, string][] => {
    // Use a regular expression to match text between square brackets with "||" separator
    const regex = /\[([^\|\]]+)\|\|(\S{2})\]/g;
    const matches: [string, string][] = [];
    let match;

    // Loop through all matches in the input string
    while ((match = regex.exec(message)) !== null) {
        matches.push([match[1].trim(), match[2]]);
    }

    return matches;
};


/**
 *
 * @param name
 * @param countrycode
 * @returns
 */
const findDestination = async (name: string, countrycode: string): Promise<any> => {
    const nominatimQuery = `https://nominatim.openstreetmap.org/search?q=${name}&format=json&extratags=1&accept-language=en&countrycodes=${countrycode}`;

    try {
        const nominatimResult = await fetch(nominatimQuery);
        const features: NominatimResponse = await nominatimResult.json();

        if (features.length === 0) {
            return Promise.reject("Area not found in OSM");
        }

        // We pick the first result of the nominatim query
        const feature = features[0];

        // We upsert the destination
        const destination = await upsertDestination(feature);
        return destination;
    } catch (error) {
        console.error("Error upserting destination: ", error);
        return Promise.reject(error);
    }
};

const photonGeocode = (searchInput: string): Promise<Feature<Geometry, Destination>[]> => {
    return new Promise((resolve) => {
        const query = `https://photon.komoot.io/api/?q=${searchInput}&limit=1`;


        fetch(query)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error();
                }

                return response.json()
            })
            .then(data => {
                const photonFeatures = data.features;
                const newData = photonFeatures.map((feature: Feature) => {
                    if (feature.geometry.type === "Point") {
                        return {
                            id: String(feature.properties?.osm_id),
                            type: "Feature",
                            place_name: `${feature.properties?.name}`,
                            geometry: {
                                type: "Point",
                                coordinates: feature.geometry.coordinates
                            },
                            center: feature.geometry.coordinates,
                            properties: feature.properties
                        };
                    }
                    return feature;
                });
                resolve(newData);
            })
            .catch(error => {
                console.error("Error: ", error);
                return resolve([]);
            });
    });
};

// Function to map Photon API response to Payload CMS schema
async function mapPhotonToDestination(photonData: any[]) {
    if (!photonData || photonData.length === 0) {
        throw new Error('Invalid Photon data');
    }

    const feature = photonData[0];

    return await payload.create<'destinations'>({
        collection: 'destinations',
        data: {
            type: feature.type,
            geometry: feature.geometry,
            properties: {
                osm_id: feature.id,
                osm_type: feature.properties?.osm_type,
                name: feature.properties?.name,
                // display_name: feature.properties?.display_name || feature.properties?.name,
                destination_type: determineDestinationType(feature.properties?.osm_type, ""), // or map it accordingly
                address: feature.properties?.address,
                mapbox_id: feature.properties?.mapbox_id,
                wikidata_id: feature.properties?.wikidata_id,
                geonames_id: feature.properties?.geonames_id,
                // wikipedia: feature.properties?.wikipedia,
                wikipedia_url: feature.properties?.wikipedia_url,
                description: feature.properties?.description,
                main_photo: feature.properties?.main_photo,
                poi_category: feature.properties?.poi_category,
                timezone: feature.properties?.timezone,
                bbox: {
                    min_latitude: feature.properties?.bbox ? feature.properties.bbox[1] : undefined,
                    min_longitude: feature.properties?.bbox ? feature.properties.bbox[0] : undefined,
                    max_latitude: feature.properties?.bbox ? feature.properties.bbox[3] : undefined,
                    max_longitude: feature.properties?.bbox ? feature.properties.bbox[2] : undefined,
                },
            }
        }
    });
}


export default router;
