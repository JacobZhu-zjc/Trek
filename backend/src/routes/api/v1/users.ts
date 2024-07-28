import express, { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { tripModel } from "../../mongodb/schemas/tripModel";
import {userModel} from "../../mongodb/schemas/userModel";
import { S3FileModel } from "../../mongodb/schemas/s3FileModel";
import { upload } from "../../../middlewares/s3";
import { formatUsers, isEdited, removeFields, stringifyUUID } from "./scripts";
import cors from "cors";
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
router.post('/fetch-user', jwtCheck, async (req, res) => {
  try {
    if (!req.body || !req.body.sub) {
      return res.status(400).json({
        error: {
          message: "The sub token is missing!"
        }
      })
    }
    let user = await userModel.findOne({"sub": req.body.sub});

    if (!user) {
      if (!req.body.sub) {
        res.status(500).json({
          error: {
            message: "The sub token is missing!"
          }
        })
      }

      let newUser = new userModel({
        sub: req.body.sub,
        username: req.body.name,
        email: req.body.email,
        image: req.body.picture,
      });
      user = await newUser.save();
      console.log("Successfully created new user")
    }
    // return the user
    res.json(user);
  } catch (error) {
    console.log("Error occurred: ", error);
  }
})


/* TODO: add to api docs after deciding use */
/* GET a user by id */
router.get('/id/:userSub', async function (req: Request, res: Response, _next: NextFunction) {
  console.log("Getting user" + req.params.userSub);
  let data = null;
  try {
    data = await userModel.findOne({sub: req.params.userSub});
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  let userData = data;
  // Removing all fields other than "name", "username", "email", and "image" if the user account is private
  if (userData["settings"]["privateAccount"]) {
    userData = removeFields(data, ["description", "links", "interests", "home", "currentlyAt", "trips"]);
  }
  userData = await formatUsers(removeFields(userData, ["settings", "experience"]));
  res.json(userData);
});

/* GET a user. */
router.get('/:subtoken', async function(req: Request, res: Response, next: NextFunction) {
  let data = null;
  try {
    data = await userModel.findOne({"sub": req.params.subtoken});
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  let userData = stringifyUUID(data);
  // Removing all fields other than "name", "username", "email", and "image" if the user account is private
  if (userData["settings"]["privateAccount"]) {
    userData = removeFields(data, ["description", "links", "interests", "home", "currentlyAt"]);
  }
  userData = await formatUsers(removeFields(userData, ["settings", "experience", "__v"]));
  res.json(userData);
});

/* GET a user's profile picture. */
router.get('/:username/picture', async function (req: Request, res: Response, _next: NextFunction) {
  let data = null;
  try {
    data = await userModel.findOne({ "username": req.params.username }, "image uploadedProfilePicture");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Returning "image" only if the user has not uploaded their own profile picture
  if (data["uploadedProfilePicture"] === undefined || data["uploadedProfilePicture"] === null) {
    res.json(removeFields(data, ["uploadedProfilePicture"]));
    return;
  }

  res.json(await formatUsers(removeFields(data, ["image"])));
});

/* GET list of trips associated with a particular user. */
router.get('/:username/trips', async function (req: Request, res: Response, _next: NextFunction) {
  try {
    if (await userModel.findOne({ "username": req.params.username }) === null) {
      res.status(404).send();
      return;
    }

    const data = await tripModel.find({ "owner": req.params.username }, "_id name desc image");
    console.log("wahoo");
    res.json({"trips": data.map(trip => stringifyUUID(trip))});
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }
});

/* GET the authenticated user. */
router.get('/', async function (req: Request, res: Response, _next: NextFunction) {
  // res.send('Get profile information about the currently authenticated user');
  // TODO: implement authentication with passwords, change user Mongoose schema if necessary, and send 401 error code if not authenticated
  /* const data = await userModel.findOne({"???": req.get("token")}, "_id name username image description links interests");

  res.json(stringifyUUID(data)); */
  res.status(404).send();
});

/* TODO: discuss if based off username or authentication */
/* GET authenticated user settings. */
router.get('/settings', async function (req: Request, res: Response, _next: NextFunction) {
  res.send('Get the profile picture of the given username.');
  // TODO: see above here...
  /* const data = await userModel.findOne({"???": req.get("token")}, "settings");
  res.json(data); */
  res.status(404).send();
});

/* POST (create) a new user. */
router.post('/', async function (req: Request, res: Response, _next: NextFunction) {
  try {
    await userModel.create({ "_id": uuidv4(), ...req.body });
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
    data = await userModel.findOne({ "username": req.body["username"] }, "_id name username image uploadedProfilePicture description links interests");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }
  return res.json(await formatUsers(stringifyUUID(data)));
});

/* TODO: discuss if based off username or authentication */
/* PUT (update) a user's settings. */
router.put('/:username/settings', async function (req: Request, res: Response, _next: NextFunction) {
  let data = null;
  try {
    data = await userModel.findOne({ "username": req.params.username }, "settings");
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
  if (!isEdited(req.body, data["settings"], ["accountLimitedDeals", "accountNewsletterNotifications", "privateAccount"])) {
    res.status(304).send();
    return;
  }

  data["settings"] = { ...data["settings"], ...req.body };
  try {
    await data.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  res.json(data["settings"]);
});

/* PUT (update) a user's experience fields. */
router.put('/:sub/experience', async function (req: Request, res: Response, _next: NextFunction) {
  let data = null;
  const token = req.headers.authorization;
  if (token) {
    const sub = jwtDecode(token)["sub"];
    if (sub !== req.params.sub) {
      res.status(401).send({message: "Your sub token does not match the one provided"})
    }
  }


  try {
    data = await userModel.findOne({ "sub": req.params.sub }, "experience");
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
  if (!isEdited(req.body, data["experience"], Object.keys(req.body))) {
    res.status(304).send();
    return;
  }

  data["experience"] = { ...data["experience"], ...req.body };
  try {
    await data.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }
  res.json(data["experience"]);
});

router.put('/:subtoken/picture', upload.single("uploadedProfilePicture"), async function(req: Request, res: Response, next: NextFunction) {
  let data = null;
  try {
    data = await userModel.findOne({"sub": req.params.subtoken});
  } catch (error: any) {
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided user picture data has any differences to the database
  let userData = data;
  if (!isEdited(req.body, userData, ["image"]) && !req.body.hasOwnProperty("uploadedProfilePicture")) {
    res.status(304).send();
    return;
  }

  // Creating a new S3File corresponding to the path to the saved image
  let uploadedProfilePicture: any;
  if (req.body.hasOwnProperty("uploadedProfilePicture")) {
    uploadedProfilePicture = await S3FileModel.create({
      "key": (req.file as Express.MulterS3.File)?.key,
      "bucket": (req.file as Express.MulterS3.File)?.bucket,
      "url": (req.file as Express.MulterS3.File)?.location,
      "uploaded_by": data["_id"],
      "uploaded_at": Date.now(),
    });
  }

  // Updating various fields in the user data obtained from the database
  userData = new userModel({ 
    ...userData,
    ...req.body,
    "uploadedProfilePicture": (uploadedProfilePicture !== undefined) ? uploadedProfilePicture["_id"] : undefined,
  });
  userData.isNew = false;
  try {
    await userData.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  // Removing "settings", "experience", and "__v" from the final object returned to the frontend
  res.json(await formatUsers(removeFields(userData, ["settings", "experience", "__v"])));
});

/* TODO: discuss if based off username or authentication */
/* PUT (edit) a user's profile information. */
router.put('/:subtoken', async function(req: Request, res: Response, next: NextFunction) {
  let data = null;
  try {
    data = await userModel.findOne({"sub": req.params.subtoken});
  } catch (error: any) {
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  // Checking if the provided list of user data has any differences to the list in the database
  let userData = data;
  if (!isEdited(req.body, userData, ["name", "email", "description", "links", "interests", "home", "currentlyAt", "trips"])) {
    res.status(304).send();
    return;
  }

  // Updating various fields in the user data obtained from the database
  userData = new userModel({ ...userData, ...req.body });
  userData.isNew = false;
  try {
    await userData.save();
  } catch (error: any) {
    console.error(error);
    res.status(400).send();
    return;
  }

  // Removing "settings", "experience", and "__v" from the final object returned to the frontend
  res.json(await formatUsers(removeFields(userData, ["settings", "experience", "__v"])));
});

/* TODO: discuss if based off username or authentication */
/* DELETE a user. */
router.delete('/:username', async function (req: Request, res: Response, _next: NextFunction) {
  let data = null;
  try {
    data = await userModel.findOne({ "username": req.params.username }, "settings");
  } catch (error: any) {
    console.error(error);
    res.status(500).send();
    return;
  }

  if (data === null) {
    res.status(404).send();
    return;
  }

  await userModel.deleteOne({ "username": req.params.username });
  res.status(204).send();
});

export default router;
