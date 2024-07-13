import express, {NextFunction, Request, Response} from "express";
import { v4 as uuidv4 } from 'uuid';
import { tripModel } from "../../mongodb/schemas";
import { isEdited, removeFields, stringifyUUID } from "./scripts";

const router = express.Router();

/* NOTE: these endpoints are all /api/v1/

/* GET list of trips. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get all the trips associated with the authenticated user');
  // TODO: integrate with Auth0
  res.status(404).send();
});

const defaultTrip = {
  name: 'Graduation Trip',
  desc: 'Graduation trip to LA and Vegas with friends and colleagues.',
  destination: 'LA and Vegas',
  date: {start: 0, end: 0},
  budget: { low: 0, high: 0 },
  image: {
    source: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/71/39/f1.jpg',
    _id: 'temp'
  },
  members: [],
  todo: [
    'Stay at X hotel for 3 days',
    'Visit Y memorial and check out the gift shop',
    'Be present at Z during an alien invasion',
    'Run from said aliens',
    'Submit a pull request once you are done'
  ],
  // TODO move to tripMapReducer?
  notes: '<h3>Trip details</h3><br /><p>This is where I go into detail about all the fun we are going to have, etc.</p>',
  destinations: [
    {
      title: 'ICICS Building',
      address: '2366 Main Mall, Vancouver, BC V6T 1Z4',
      date: {start: 1679716640000, end: 1679719640000},
      transportation: {
        type: 'bus',
        distance: 2,
        time: 5,
        cost: 10
      }
    }
  ]
};

/* GET a particular trip given UUID if authorized. */
router.get('/:uuid', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get detailed trip information for the trip given UUID if user is authorized');
  // TODO: integrate with Auth0
  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid);
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  const tripData = removeFields(data, ["map", "timeline", "destinations", "__v"]);
  res.json(tripData);
});

/* GET a particular trip's map information given UUID if authorized. */
router.get('/:uuid/map', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get a trip\'s map information given UUID if authorized');
  // TODO: integrate with Auth0
  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "map");
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  res.json(data["map"]);
});

/* GET a particular trip's timeline given UUID if authorized. */
router.get('/:uuid/timeline', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get the timeline information for a given trip.');
  // TODO: schema work still in progress
  res.status(404).send();
});

/* GET a particular trip's picture given UUID if authorized. */
router.get('/:uuid/picture', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get a trip\'s picture given UUID if authorized');
  // TODO: integrate with Auth0

  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid, "image");
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  res.json(data["image"]);
});

/* POST (create) a new trip under authenticated user. */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Create a new trip under the authenticated users ownership ');
  // TODO: integrate with Auth0
  const uuid = uuidv4();
  try {
    await tripModel.create({
      "_id": uuid,
      "url": `http://localhost:5173/trips/${uuid}`,
      "owner": "hello", // TODO: add owner in from Auth0 subtoken?
      "members": ["hello"], // TODO: add owner as member from Auth0 subtoken?
      ...req.body,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send();
    return;
  }


  let data = null;
  try {
    data = await tripModel.findById(uuid);
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  return res.json(removeFields(data, ["map", "timeline", "destinations", "__v"]));
});

/* PUT (update) a trip's information given uuid and if authorized. */
router.put('/:uuid', async function(req: Request, res: Response, next: NextFunction) {

  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid);
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided list of fields has any differences compared to the trip from the database
  let tripData = stringifyUUID(data);
  if (!isEdited(req.body, tripData, ["name", "desc", "dest", "budget", "expenditures", "date", "todo", "image", "owner", "members", "private"])) {
    res.status(304).send();
    return;
  }

  // Updating the trip in the database
  const tempImage = req.body["image"];
  delete req.body["image"];
  tripData = new tripModel({...tripData, ...req.body});
  tripData.isNew = false;
  tripData["image"]["source"] = tempImage || tripData["image"]["source"];
  try {
    await tripData.save();
  } catch (error: any) {
    console.log(error);
    res.status(400).send();
    return;
  }

  // Removing the "map", "timeline", and "__v" fields before responding with the trip data
  res.json(removeFields(tripData, ["map", "timeline", "__v"]))
});

/* PUT (update) a trip's map information given uuid and if authorized. */
router.put('/:uuid/map', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Update a trip\'s map information');
  // TODO: implement alongside sockets?
  res.status(404).send();
});

/* PUT (update) a trip's timeline given uuid and if authorized. */
router.put('/:uuid/timeline', async function(req: Request, res: Response, next: NextFunction) {
  // res.send("Update a trip's timeline under the authenticated user's ownership");
  // TODO: implement alongside sockets?
  res.status(404).send();
});

/* DELETE a trip's information given uuid and if authorized. */
router.delete('/:uuid', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Delete a trip\'s information');

  let data = null;
  try {
    data = await tripModel.findById(req.params.uuid);
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  await tripModel.deleteOne({"_id": req.params.uuid});
  res.status(204).send();
});

export default router;
