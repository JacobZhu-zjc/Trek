import express, {NextFunction, Request, Response} from "express";
import { v4 as uuidv4 } from 'uuid';
import { tripModel, userModel } from "../../mongodb/schemas";
import { isEdited, removeFields, stringifyUUID } from "./scripts";
import { isDeepStrictEqual } from "util";

const router = express.Router();

const sampleUser = {

}

/* NOTE: these endpoints are all /api/v1/ */


/* TODO: discuss if based off username or authentication */
/* GET authenticated user settings. */
router.get('/settings', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get settings for a user');
  // TODO: see above here...
  const data = await userModel.findOne({"???": req.get("token")}, "settings");
  res.json(data && data.settings);
});
/* TODO: Set up public/private account setting? Currently returning data as if all accounts were public */
/* GET a user. */
router.get('/:username', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get publicly available information about a user');

  let data = null;
  try {
    data = await userModel.findOne({"username": req.params.username});
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  let userData = stringifyUUID(data);
  // Removing all fields other than "name", "username", and "image" if the user account is private
  if (userData["settings"]["privateAccount"]) {
    userData = removeFields(data, ["description", "links", "interests"]);
  }
  delete userData["settings"];
  res.json(userData);
});

/* GET a user's profile picture. */
router.get('/:username/picture', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get the profile picture of the given username.');

  let data = null;
  try {
    data = await userModel.findOne({"username": req.params.username}, "image");
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

/* GET list of trips associated with a particular user. */
router.get('/:username/trips', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get all the trips associated with a particular username. If auth token provided, more trips will be displayed (depending on privacy).');
  try {
    if (await userModel.findOne({"username": req.params.username}) === null) {
      res.status(404).send();
      return;
    }

    const data = await tripModel.find({"owner": req.params.username}, "_id name desc image");
    res.json(data.map(trip => stringifyUUID(trip)));
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

});

/* GET the authenticated user. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Get profile information about the currently authenticated user');
  // TODO: implement authentication with passwords, change user Mongoose schema if necessary, and send 401 error code if not authenticated
  /* const data = await userModel.findOne({"???": req.get("token")}, "_id name username image description links interests");

  res.json(stringifyUUID(data)); */
  res.status(404).send();
});

/* TODO: discuss if based off username or authentication */
/* GET authenticated user settings. */
router.get('/settings', async function(req: Request, res: Response, next: NextFunction) {
  res.send('Get the profile picture of the given username.');
  // TODO: see above here...
  /* const data = await userModel.findOne({"???": req.get("token")}, "settings");
  res.json(data); */
  res.status(404).send();
});

/* POST (create) a new user. */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Create a new user');
  try {
    await userModel.create({"_id": uuidv4(), ...req.body});
  } catch (error: any) {
    console.error(error);
    if (error?.errorResponse?.code === 11000) {
      // Duplicate username
      res.status(403).send();
    } else {
      // Bad request
      res.status(400).send();
    }
    return;
  }

  let data = null;
  try {
    data = await userModel.findOne({"username": req.body["username"]}, "_id name username image description links interests");
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }
  return res.json(stringifyUUID(data));
});

/* TODO: discuss if based off username or authentication */
/* PUT (update) a user's settings. */
router.put('/:username/settings', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Update a user\'s settings.');

  let data = null;
  try {
    data = await userModel.findOne({"username": req.params.username}, "settings");
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided list of settings has any differences to the list in the database
  if (!isEdited(req.body, data["settings"], ["accountLimitedDeals", "accountNewsletterNotifications", "privateAccount"])) {
    res.status(304).send();
    return;
  }

  data["settings"] = {...data["settings"], ...req.body};
  try {
    await data.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }
  res.json(data["settings"]);
});

/* TODO: discuss if based off username or authentication */
/* PUT (edit) a user's profile information. */
router.put('/:username', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Edit user profile information');


  let data = null;
  try {
    data = await userModel.findOne({"username": req.params.username});
  } catch (error: any) {
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided list of user data has any differences to the list in the database
  let userData = stringifyUUID(data);
  if (!isEdited(req.body, userData, ["name", "description", "links", "interests"])
    && (req.body["image"] === undefined || isDeepStrictEqual(req.body["image"], userData["image"]["source"]))) {
    res.status(304).send();
    return;
  }

  // Updating various fields in the user data obtained from the database
  const tempImage = req.body["image"];
  delete req.body["image"];
  userData = new userModel({...userData, ...req.body});
  userData.isNew = false;
  userData["image"]["source"] = tempImage || userData["image"]["source"];
  try {
    await userData.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  // Removing "settings", and "__v" from the final object returned to the frontend
  res.json(removeFields(userData, ["settings", "__v"]));
});

/* TODO: discuss if based off username or authentication */
/* DELETE a user. */
router.delete('/:username', async function(req: Request, res: Response, next: NextFunction) {
  // res.send('Delete a user with specified username.');

  let data = null;
  try {
    data = await userModel.findOne({"username": req.params.username}, "settings");
  } catch (error: any) {
    console.log(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  await userModel.deleteOne({"username": req.params.username});
  res.status(204).send();
});

export default router;
