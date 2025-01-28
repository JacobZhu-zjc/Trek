import express, {NextFunction, Request, Response} from "express";
import {v4 as uuidv4} from 'uuid';
import {tripModel} from "../../mongodb/schemas/tripModel";
import {S3FileModel} from "../../mongodb/schemas/s3FileModel";
import {userModel} from "../../mongodb/schemas/userModel";
import {formatTrips, isEdited, removeFields, storeAreaIfNotExists, stringifyUUID} from "./scripts";
import {tripPictureFields, upload} from "../../../middlewares/s3";
import cors from "cors";
import mongoose from "mongoose";
import {jwtDecode} from "jwt-decode";
import {Feature} from "geojson";

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

/* NOTE: these endpoints are all /api/v1/ */

/* GET list of trips. */
router.get('/', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
    const payload = (req as any).auth.payload;
    const sub = payload.sub;
    try {
        if (!sub) {
            return res.status(400).json({error: {message: "The sub token is missing!"}});
        }
        let user = await userModel.findOne({"sub": sub});
        if (!user?.trips) {
            return res.status(404).json({error: {message: "There are no trips found for this user"}});
        }
        const tripUUIDS: string[] = user?.trips ?? [];
        const basicTrips = [];
        for (const uuid of tripUUIDS) {
            const trip = stringifyUUID(await tripModel.findById(uuid, 'name mainImage photos desc members owner'));
            if (trip) basicTrips.push(await formatTrips(trip));
        }

        return res.json(basicTrips);
    } catch (error) {
        return res.status(500).send("Error occurred: " + error);
    }
});

/* GET subset of trips for pagination, page number provided as a URL param */
router.get('/paginated', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
    // Authenticating the user
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({"error": "Missing authentication"});
    }
    const sub = jwtDecode(token)["sub"];

    // Constants for pagination, and retrieving page number from the URL params
    const TRIPS_PER_PAGE = 6;
    const pageNumber = (req.query["page"]) ? Math.floor(Number(req.query["page"])) : 0;

    try {
        // Getting list of trips in user
        const user = await userModel.findOne({"sub": sub});
        if (user === null) {
            return res.status(404).json({error: {message: "User not found"}});
        }

        let tripUUIDS: string[] = [];
        // Adding all the trips the user is/was an owner of
        tripUUIDS.concat(user?.trips);
        // Adding all the trips the user is only a member of
        for (const uuid of (await tripModel.find({"members": {"$elemMatch": {"$eq": sub}}})).map(trip => trip["_id"])) {
            if (!tripUUIDS.includes(uuid)) {
                tripUUIDS.push(uuid);
            }
        }

        // Slicing the array to find only the trips in the current page, and querying MongoDB using the $in operator
        const paginatedUUIDS = tripUUIDS.slice(pageNumber * TRIPS_PER_PAGE, (pageNumber + 1) * TRIPS_PER_PAGE) ?? [];
        const tripData = await tripModel.find({"_id": {"$in": paginatedUUIDS}});
        const basicTrips = await Promise.all(tripData.map(trip => formatTrips(stringifyUUID(trip))));
        return res.json({
            "trips": basicTrips,
            "pages": Math.ceil(tripUUIDS.length / TRIPS_PER_PAGE)
        });
    } catch (error: any) {
        console.error("Error getting paginated trips:\n" + error);
        return res.status(500).send();
    }
});

// Middleware to prevent returning trip data if its privacy setting isn't "public"
async function returnTripIfPublic(req: Request, res: Response, next: NextFunction) {
    let data = null;
    try {
        const uuid = new mongoose.Types.UUID(req.params.uuid);
        data = await tripModel.findById(uuid);
    } catch (error: any) {
        console.error("Error in getting trip by id:");
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(400).send();
    }

    if (!data.private) {
        return res.json(await formatTrips(removeFields(data, ["trip_items", "__v"])));
    } else {
        return jwtCheck(req, res, next);
    }
}

/* GET a particular trip given UUID if authorized. */
router.get('/:uuid', returnTripIfPublic, async function (req: Request, res: Response, _next: NextFunction) {
    const reqPayload = (req as any).auth.payload;
    const sub = reqPayload.sub;
    let data = null;
    try {
        let uuid = new mongoose.Types.UUID(req.params.uuid);
        data = await tripModel.findById(uuid);

    } catch (error: any) {
        console.error("Error in getting trip by UUID:");
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    if (data.owner !== sub && !data.members.includes(sub)) {
        return res.status(401).send();
    }

    res.json(await formatTrips(removeFields(data, ["trip_items", "__v"])));
});

/* GET list of trips. */
router.get('/', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
    const payload = (req as any).auth.payload;
    const sub = payload.sub;
    try {
        if (!sub) {
            return res.status(400).json({error: {message: "The sub token is missing!"}});
        }
        let user = await userModel.findOne({"sub": sub});
        if (!user?.trips) {
            return res.status(404).json({error: {message: "There are no trips found for this user"}});
        }
        const tripUUIDS: string[] = user?.trips ?? [];
        const basicTrips = [];
        for (const uuid of tripUUIDS) {
            const trip = stringifyUUID(await tripModel.findById(uuid, 'name mainImage photos desc members owner'));
            if (trip) basicTrips.push(await formatTrips(trip));
        }

        return res.json(basicTrips);
    } catch (error) {
        return res.status(500).send("Error occurred: " + error);
    }
});

/* GET a particular trip's itinerary information (ie. trip_items) given UUID if authorized. */
router.get('/:uuid/trip_items', async function (req: Request, res: Response, _next: NextFunction) {
    let data = null;
    try {
        data = await tripModel.findById(req.params.uuid);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    res.json(data["trip_items"]);
});

/* GET a particular trip's timeline given UUID if authorized. (not implemented) */
router.get('/:uuid/timeline', async function (req: Request, res: Response, _next: NextFunction) {
    res.status(501).send();
});

/* GET a particular trip's picture given UUID if authorized. */
router.get('/:uuid/picture', async function (req: Request, res: Response, _next: NextFunction) {
    let data = null;
    try {
        data = await tripModel.findById(req.params.uuid, "owner members mainImage photos");
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    return res.json(await formatTrips(stringifyUUID(data)));
});

/* POST (create) a new trip under authenticated user. */
router.post('/', [upload.single("mainImage"), jwtCheck], async function (req: Request, res: Response, _next: NextFunction) {
    // check for required fields
    if (!req.body.tripName || !req.body.startLocationOsmId || !req.body.startLocationOsmType || !req.body.destinationLocationOsmId || !req.body.destinationLocationOsmType) {
        return res.status(400).json({error: {message: "Missing required fields"}});
    }

    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({"error": "Missing authentication"});
    }
    const sub = jwtDecode(token)["sub"];

    const startLocationOsmId = req.body.startLocationOsmId;
    const startLocationOsmType = req.body.startLocationOsmType;

    const destinationLocationOsmId = req.body.destinationLocationOsmId;
    const destinationLocationOsmType = req.body.destinationLocationOsmType;

    const tripName = req.body.tripName;


    const [startLocationId, destinationLocationId] = await Promise.all([
        storeAreaIfNotExists(startLocationOsmId, startLocationOsmType),
        storeAreaIfNotExists(destinationLocationOsmId, destinationLocationOsmType)
    ]);

    const uuid = uuidv4();
    let data = null;
    try {
        let mainImage: any;
        if (req.files && (req.files as any)["mainImage"]) {
            // Creating a new S3File corresponding to the path to the saved image
            mainImage = await S3FileModel.create({
                "key": (req.file as Express.MulterS3.File)?.key,
                "bucket": (req.file as Express.MulterS3.File)?.bucket,
                "url": (req.file as Express.MulterS3.File)?.location,
                "uploaded_by": sub,
                "uploaded_at": Date.now(),
            });
        }

        data = await tripModel.create({
            "_id": uuid,
            "owner": sub,
            "members": [sub],
            "name": tripName,
            "desc": " ",
            "url": `${req.protocol}://${req.get('host')}/trips/${uuid}`,
            "areas": [new mongoose.Types.ObjectId(destinationLocationId)],
            "start": new mongoose.Types.ObjectId(startLocationId),
            ...req.body,
            "mainImage": (mainImage !== undefined) ? mainImage["_id"] : undefined,
            "budget": {
                baseCurrency: "CAD",
                tripBudgetCategoriesGroupCost: [],
                tripTotalGroupCost: 0,
                tripTotalPayments: 0,
                tripMemberPayments: []
            },
            "dest": [destinationLocationId],
            "trip_items": [],
        });

        const ownerTrips = (await userModel.findOne({"sub": sub}))?.trips;
        if (ownerTrips) {
            ownerTrips.push(uuid);
            await userModel.findOneAndUpdate({"sub": sub},
                {trips: ownerTrips}
            );
        }

        await userModel.findOneAndUpdate({"sub": sub},);

    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    try {
        data = await tripModel.findById(uuid)
            .populate({
                path: 'mainImage',
                select: 'id url',
            })
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    return res.json(await formatTrips(removeFields(data, ["trip_items", "__v"])));
});

/* PUT (update) a trip's itinerary information given uuid and if authorized. */
router.put('/:uuid/trip_items', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
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

    // Checking if the user is authenticated to edit trip data
    if (!data["members"].includes(sub) && data["owner"] !== sub) {
        return res.status(401).send({"error": "Unauthorized"});
    }

    // Checking if the provided trip items have any differences to the list in the database
    if (!isEdited(req.body, data, ["trip_items"])) {
        return res.status(304).send();
    }

    data["trip_items"] = {...data["trip_items"], ...req.body["trip_items"]};
    try {
        await data.save();
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    res.json(data["trip_items"]);
});

/* PUT (update) a trip's budget information given uuid and if authorized. */
router.put('/:uuid/budget', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
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

    // Checking if the user is authenticated to edit trip data
    if (!data["members"].includes(sub) && data["owner"] !== sub) {
        return res.status(401).send({"error": "Unauthorized"});
    }

    // Checking if the provided budget has any differences to the list in the database
    if (!isEdited(req.body, data, ["budget"])) {
        return res.status(304).send();
    }

    data["budget"] = {...data["budget"], ...req.body["budget"]};
    try {
        await data.save();
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    res.json(data["budget"]);
});

/* PUT (update) a trip's management settings given uuid and if authorized. */
router.put('/:uuid/management', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
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

    // Checking if the user is authenticated to edit trip data
    if (data["owner"] !== sub) {
        return res.status(401).send({"error": "Unauthorized"});
    }

    try {
        data = await tripModel.findByIdAndUpdate(req.params.uuid, req.body, {new: true});
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    res.json(await formatTrips(stringifyUUID(data)));
});

/* PUT (update) a trip's picture fields given uuid and if authorized. */
// Testing with Postman: set body to "form-data", add "mainImage" field and set to file (hover over right side of "key" column)
router.put("/:uuid/picture", [tripPictureFields, jwtCheck], async function (req: Request, res: Response, _next: NextFunction) {
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

    // Checking if the user is authenticated to edit trip data
    if (!data["members"].includes(sub) && data["owner"] !== sub) {
        return res.status(401).send({"error": "Unauthorized"});
    }

    // Checking that req.files is well-defined
    if (!req.files) {
        return res.status(400).send({"error": "Image files are missing!"});
    }

    // Creating a new MongoDB S3File corresponding to the path to the saved "mainImage" in S3, if it was passed to the endpoint
    const mainImageFile = (req.files as any)["mainImage"];
    let mainImage: any = undefined;
    if (mainImage && (mainImageFile.length > 0)) {
        mainImage = await S3FileModel.create({
            "key": ((req.files as any)["mainImage"][0] as Express.MulterS3.File)?.key,
            "bucket": ((req.files as any)["mainImage"][0] as Express.MulterS3.File)?.bucket,
            "url": ((req.files as any)["mainImage"][0] as Express.MulterS3.File)?.location,
            "uploaded_by": sub,
            "uploaded_at": Date.now(),
        });
    }

    // Creating MongoDB S3Files corresponding to the paths to the saved "photos", if they were passed to the endpoint
    const photoFiles = (req.files as any)["photos"];
    let photos: any[] = [];
    if (photoFiles && photoFiles.length > 0) {
        for (const file of photoFiles) {
            photos.push(await S3FileModel.create({
                "key": (file as Express.MulterS3.File)?.key,
                "bucket": (file as Express.MulterS3.File)?.bucket,
                "url": (file as Express.MulterS3.File)?.location,
                "uploaded_by": sub,
                "uploaded_at": Date.now(),
            }));
        }
    }

    // Replacing fields in the trip data
    data = new tripModel({
        ...stringifyUUID(data),
        "mainImage": (photos.length > 0) ? photos[0]["_id"] : data["mainImage"],
        "photos": (photos.length > 0) ? photos.map(elem => elem["_id"]) : data["photos"],
    });
    data.isNew = false;
    try {
        await data.save();
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    return res.json(await formatTrips(removeFields(data, ["name", "desc", "budget", "expenditures", "date", "todo", "url", "areas", "start", "dest"])));
});

/* PUT (update) a trip's information given uuid and if authorized. */
router.put('/:uuid', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
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

    // Checking if the user is authenticated to edit trip data
    if (!data["members"].includes(sub) && data["owner"] !== sub) {
        return res.status(401).send({"error": "Unauthorized"});
    }

    let tripData = stringifyUUID(data);
    delete req.body["mainImage"];

    const newDests: string[] = [];
    for (const featureOrDest of req.body["destObjs"]) {
        if ('_id' in featureOrDest) {
            newDests.push(featureOrDest._id);
        } else {
            const feature = featureOrDest as Feature;
            newDests.push(await storeAreaIfNotExists(feature.properties?.osm_id as string, feature.properties?.osm_type as string) as string);
        }
    }
    delete req.body["destObjs"];
    delete req.body["trip_items"];

    // Updating the trip in the database
    tripData = {
        date: {
            start: new Date((req.body.date?.start ?? 0) * 1000),
            end: new Date((req.body.date?.end ?? 0) * 1000)
        },
        ...tripData,
        ...req.body,
        dest: newDests,
    };
    tripData.isNew = false;
    delete tripData["_id"];

    try {
        tripData = await tripModel.findByIdAndUpdate(req.params.uuid, tripData, {new: true});
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    // Removing the "trip_items", "owner", and other unchanged fields before responding with the trip data
    res.json(await formatTrips(removeFields(tripData, ["trip_items", "__v"])));
});

/* DELETE a trip's information given uuid and if authorized. */
router.delete('/:uuid', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({"error": "Missing authentication"});
    }
    const sub = jwtDecode(token)["sub"];

    let data = null;
    try {
        data = await tripModel.findById(req.params.uuid);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    if (data.owner !== sub) {
        return res.status(401).send({"error": "Unauthorized"});
    }

    try {
        // Deleting both the trip, as well as the entry in the UserModel.trips field using the $pull operator
        await tripModel.deleteOne({"_id": req.params.uuid});
        await userModel.findOneAndUpdate({"sub": sub}, {"$pull": {trips: req.params.uuid}})
    } catch (error) {
        console.error("Error deleting a trip: " + error);
        return res.status(500).send();
    }

    return res.status(200).send({status: "success"});
});

export default router;
