import express, { json, NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { tripModel } from "../../mongodb/schemas/tripModel";
import { S3FileModel } from "../../mongodb/schemas/s3FileModel";
import { userModel } from "../../mongodb/schemas/userModel";
import { formatTrips, isEdited, removeFields, storeAreaIfNotExists, stringifyUUID } from "./scripts";
import { upload } from "../../../middlewares/s3";
import cors from "cors";
import mongoose from "mongoose";
import {jwtDecode} from "jwt-decode";
const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();
const router = express.Router();

const jwtCheck = auth({
  audience: process.env.API_AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

router.use(cors());
router.use(express.json());

/* NOTE: these endpoints are all /api/v1/ */

// TODO: TEMPORARY S3 FILE ENDPOINT UNTIL IT IS ELABORATED ON MORE
router.get('/s3/:key', async function (req, res, _next) {
  let data = null;
  try {
    data = await S3FileModel.findOne({ key: req.params.key });
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  res.json(data);
});

/* GET list of trips. */
// TODO migrate to users.ts
router.get('/', jwtCheck, async function (req: Request, res: Response, next: NextFunction) {
  console.log("Attempting to get list of tripsasdjaksdjklas");
  const payload = (req as any).auth.payload;
  const sub = payload.sub;
  try {
    if (!sub) {
      return res.status(400).json({ error: { message: "The sub token is missing!" } });
    }
    let user = await userModel.findOne({ "sub": sub });
    if (!user?.trips) {
      return res.status(404).json({ error: { message: "There are no trips found for this user" } });
    }
    // console.log(JSON.stringify(user));
    const tripUUIDS: string[] = user?.trips ?? [];
    const basicTrips = [];
    for (const uuid of tripUUIDS) {
      const trip = stringifyUUID(await tripModel.findById(uuid, 'name mainImage photos desc'));
      if (trip) basicTrips.push(await formatTrips(trip));
    }

    console.log("BASIC TRIPS ====================")
    console.log(basicTrips);
    return res.json(basicTrips);
  } catch (error) {
    return res.status(500).send("Error occurred: " + error);
  }
});


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
router.get('/:uuid', returnTripIfPublic, async function(req: Request, res: Response, _next: NextFunction) {
  // TODO: properly type this in the future
  const payload = (req as any).auth.payload;
  const sub = payload.sub;
  let data = null;
  try {
    let uuid = new mongoose.Types.UUID(req.params.uuid);
    data = await tripModel.findById(uuid);

  } catch (error: any) {
    console.error("Error in getting trip by UUID:");
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  if (data.owner !== sub && !data.members.includes(sub)) {
    return res.status(401).send();
  }

  res.json(await formatTrips(removeFields(data, ["trip_items", "__v"])));
});

/* GET a particular trip's itinerary information (ie. trip_items) given UUID if authorized. */
router.get('/:uuid/trip_items', async function (req: Request, res: Response, _next: NextFunction) {
  // TODO: integrate with Auth0
  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "trip_items");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  res.json(data["trip_items"]);
});

/* GET a particular trip's picture given UUID if authorized. */
router.get('/:uuid/picture', async function (req: Request, res: Response, _next: NextFunction) {
  // TODO: integrate with Auth0
  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "image photokeys");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  res.json(await formatTrips(stringifyUUID(data)));
});

/* POST (create) a new trip under authenticated user. */
router.post('/', [upload.single("mainImage"), jwtCheck], async function(req: Request, res: Response, _next: NextFunction) {
  // check for required fields
  if (!req.body.tripName || !req.body.startLocationOsmId || !req.body.startLocationOsmType || !req.body.destinationLocationOsmId || !req.body.destinationLocationOsmType) {
    res.status(400).json({ error: { message: "Missing required fields" } });
    return;
  }

  // get the sub token
  const payload = (req as any).auth.payload;
  const sub = payload.sub;
  if (!sub) {
    res.status(400).json({ error: { message: "The sub token is missing!" } });
    return;
  }

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
    if (req.body["mainImage"] !== undefined) {
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
      "trip_items": [
        {
          item_type: 'destinations',
          item_id: new mongoose.Types.ObjectId("66a440bea2de93d1b61c8e11"),// TODO: get the destination id here...
          index: 0,
          date: {start: new Date(), end: new Date()},
          notes: null
        },
        {
          item_type: "destinations",
          item_id: new mongoose.Types.ObjectId("66a330f522aea5af81a2b6cc"),
          index: 0,
          date: {start: new Date(), end: new Date()},
          notes: null
        }
      ]
    });

    const ownerTrips = (await userModel.findOne({"sub": sub}))?.trips;
    if (ownerTrips) {
      ownerTrips.push(uuid);
      await userModel.findOneAndUpdate({ "sub": sub },
        {trips: ownerTrips}
      );
    }

    await userModel.findOneAndUpdate({ "sub": sub }, );

  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  try {
    data = await tripModel.findById(uuid)
      .populate({
        path: 'mainImage',
        select: 'id url',
      })
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  return res.json(await formatTrips(removeFields(data, ["trip_items", "__v"])));
});

/* PUT (update) a trip's itinerary information given uuid and if authorized. */
router.put('/:uuid/trip_items', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
  // TODO: implement alongside sockets?
  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "trip_items");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided trip items have any differences to the list in the database
  if (!isEdited(req.body, data, ["trip_items"])) {
    res.status(304).send();
    return;
  }

  data["trip_items"] = { ...data["trip_items"], ...req.body["trip_items"] };
  try {
    await data.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  res.json(data["trip_items"]);
});

/* PUT (update) a trip's budget information given uuid and if authorized. */
router.put('/:uuid/budget', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
  // TODO: implement alongside sockets?
  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "budget");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided budget has any differences to the list in the database
  if (!isEdited(req.body, data, ["budget"])) {
    res.status(304).send();
    return;
  }

  data["budget"] = { ...data["budget"], ...req.body["budget"] };
  try {
    await data.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  res.json(data["budget"]);
});

/* PUT (update) a trip's management settings given uuid and if authorized. */
router.put('/:uuid/management', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "owner members private");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided list of settings has any differences to the list in the database
  if (!isEdited(req.body, data, ["owner", "members", "private"])) {
    res.status(304).send();
    return;
  }

  data = { ...data, ...req.body };
  try {
    await data.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  res.json(stringifyUUID(data));
});

/* PUT (update) a trip's picture fields given uuid and if authorized. */
// Expects a field "mainImage" in the request body with the file data
router.put("/:uuid/picture", [upload.single("mainImage"), jwtCheck], async function(req: Request, res: Response, _next: NextFunction) {
  const payload = (req as any).auth.payload;
  const sub = payload.sub;
  if (!sub) {
    res.status(400).json({ error: { message: "The sub token is missing!" } });
    return;
  }

  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "mainImage");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Creating a new S3File corresponding to the path to the saved image
  const mainImage: any = await S3FileModel.create({
    "key": (req.file as Express.MulterS3.File)?.key,
    "bucket": (req.file as Express.MulterS3.File)?.bucket,
    "url": (req.file as Express.MulterS3.File)?.location,
    "uploaded_by": sub,
    "uploaded_at": Date.now(),
  });
  
  data = {
    ...data, 
    "mainImage": mainImage["_id"],
    // TODO: add method to delete old photos or add new photos for the "photos" field
  };
  try {
    await data.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  // res.json(await formatTrips(stringifyUUID(data)));
  res.status(200).send();
});

/* PUT (update) a trip's information given uuid and if authorized. */
router.put('/:uuid', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
  // get the sub token
  const payload = (req as any).auth.payload;
  const sub = payload.sub;
  if (!sub) {
    res.status(400).json({ error: { message: "The sub token is missing!" } });
    return;
  }

  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid);
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided list of fields has any differences compared to the trip from the database
  let tripData = stringifyUUID(data);
  if (!isEdited(req.body, tripData, ["name", "desc", "areas", "expenditures", "date", "todo", "photos"])) {
    res.status(304).send();
    return;
  }
  delete req.body["mainImage"];

  // Updating the "areas" field of the trip and adding locations to database if they don't already exist
  const areas = await Promise.all(
    (req.body["areas"] as any[]).map(area => storeAreaIfNotExists(area["OsmId"], area["OsmType"])
  ));

  // Updating the trip in the database
  tripData = new tripModel({
    date: {
      start: new Date(req.body.date.start * 1000),
      end: new Date(req.body.date.end * 1000)
    },
    ...tripData,
    ...req.body,
    areas: areas.map(OsmId => new mongoose.Types.ObjectId(OsmId))
  });
  tripData.isNew = false;
  try {
    await tripData.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  // Removing the "trip_items", "owner", and other unchanged fields before responding with the trip data
  res.json(formatTrips(removeFields(tripData, ["budget", "owner", "members", "private", "trip_items", "__v"])));
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
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  if (data.owner !== sub) {
    return res.status(401).send({"error": "Unauthorized"});
  }

  await tripModel.deleteOne({ "_id": req.params.uuid });
  res.status(200).send({status: "success"});
});

export default router;
