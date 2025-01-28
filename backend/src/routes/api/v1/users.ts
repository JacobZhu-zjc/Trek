import express, {NextFunction, Request, Response} from "express";
import {v4 as uuidv4} from 'uuid';
import {tripModel} from "../../mongodb/schemas/tripModel";
import {userModel} from "../../mongodb/schemas/userModel";
import {S3FileModel} from "../../mongodb/schemas/s3FileModel";
import {upload} from "../../../middlewares/s3";
import {formatUsers, isEqual, removeFields, stringifyUUID} from "./scripts";
import cors from "cors";
import {jwtDecode} from "jwt-decode";

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

/* Endpoint to create a new user for Auth0 */
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

            // Logic to check for collisions and adding numbers if exists
            let username = req.body.email.split('@')[0];
            let checkExists = await userModel.findOne({"username": username});
            if (checkExists) {
                const randomNumbers: number[] = [];
                for (let i = 0; i < 4; i++) {
                    randomNumbers.push(Math.floor(Math.random() * 10));
                }
                username = username + randomNumbers.join("");
            }

            let newUser = new userModel({
                sub: req.body.sub,
                name: req.body.name,
                username: username,
                email: req.body.email,
                image: req.body.picture,
            });
            user = await newUser.save();

            try {
                const SibApiV3Sdk = require('sib-api-v3-sdk');
                let defaultClient = SibApiV3Sdk.ApiClient.instance;

                let apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey = process.env.BREVO_API_KEY;

                let apiInstance = new SibApiV3Sdk.ContactsApi();

                let createContact = new SibApiV3Sdk.CreateContact();

                createContact.email = req.body.email;
                createContact.listIds = [5, 6, 8];
                createContact.updateEnabled = true;

                apiInstance.createContact(createContact).then(function (data: any) {
                    // nice!
                }, function (error: Error) {
                    throw new Error("Error creating contact for email list");
                });

            } catch (error: any) {
                console.error(error);
                return res.status(500).send();
            }

        }

        // Returning the user-uploaded image if they've uploaded their own profile picture - and the one from Auth0 if they haven't
        let imageLink;
        if (user["uploadedProfilePicture"]) {
            const uploadedProfilePicture = (await S3FileModel.findById(user["uploadedProfilePicture"]));
            imageLink = (uploadedProfilePicture !== null) ? uploadedProfilePicture["url"] : user.image;
        }

        // Returning the user to the frontend
        res.json({
            ...stringifyUUID(user),
            "uploadedProfilePictureURL": imageLink,
        });
    } catch (error) {
        console.error("Error occurred: ", error);
    }
})

/* GET a user by id */
router.get('/id/:userSub', async function (req: Request, res: Response, _next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({sub: req.params.userSub});
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    let userData = data;
    // Removing all fields other than "name", "username", "email", and "image" if the user account is private
    if (userData["settings"]["privateAccount"]) {
        userData = removeFields(data, ["description", "links", "interests", "home", "currentlyAt", "trips"]);
    }
    userData = await formatUsers(removeFields(userData, ["settings", "experience"]));
    return res.json(userData);
});

/* GET a user. */
router.get('/:subtoken', async function (req: Request, res: Response, next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({"sub": req.params.subtoken});
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    let userData = stringifyUUID(data);
    // Removing all fields other than "name", "username", "email", and "image" if the user account is private
    if (userData["settings"]["privateAccount"]) {
        userData = removeFields(data, ["description", "links", "interests", "home", "currentlyAt"]);
    }
    userData = await formatUsers(removeFields(userData, ["settings", "experience", "__v"]));
    res.json(userData);
});

/* GET a basic user by username. */
router.get('/username/:username', async function (req: Request, res: Response, next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({"username": req.params.username});
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null || data === undefined) {
        return res.status(404).send();
    }

    let userData = data;
    // Removing all fields other than "name", "username", "email", and "image" if the user account is private
    if (userData["settings"]["privateAccount"]) {
        userData = removeFields(data, ["description", "links", "interests", "home", "currentlyAt"]);
    }
    userData = await formatUsers(removeFields(userData, ["settings", "experience", "__v"]));
    res.json(userData);
});

/* GET a user's profile picture. */
router.get('/:subtoken/picture', async function (req: Request, res: Response, _next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({"sub": req.params.subtoken}, "image uploadedProfilePicture");
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    // Returning "image" only if the user has not uploaded their own profile picture
    if (data["uploadedProfilePicture"] === undefined || data["uploadedProfilePicture"] === null) {
        return res.json(removeFields(data, ["uploadedProfilePicture"]));
    }

    res.json(await formatUsers(removeFields(data, ["image"])));
});

/* GET list of trips associated with a particular user. */
router.get('/:subtoken/trips', async function (req: Request, res: Response, _next: NextFunction) {
    try {
        if (await userModel.findOne({"sub": req.params.subtoken}) === null) {
            return res.status(404).send();
        }

        const data = await tripModel.find({"owner": req.params.subtoken}, "_id name desc image");
        res.json({"trips": data.map(trip => stringifyUUID(trip))});
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }
});

/* GET the authenticated user. */
router.get('/', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
    // Establishing that the user is logged-in
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({"error": "Missing authentication"});
    }
    const sub = jwtDecode(token)["sub"];

    // Getting user data from MongoDB
    let data = null;
    try {
        data = await userModel.findOne({"sub": sub});
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }
    // Sending a 404 response if the user does not exist
    if (data === null) {
        return res.status(404).send();
    }

    res.json(await formatUsers(stringifyUUID(data)));
});

/* GET authenticated user settings. */
router.get('/settings', jwtCheck, async function (req: Request, res: Response, _next: NextFunction) {
    const token = req.headers.authorization;
    let sub = null;
    if (token) {
        sub = jwtDecode(token)["sub"];
    }

    let data = null;
    try {
        data = await userModel.findOne({sub: sub}, "settings");
        return res.status(200).send(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

/* POST (create) a new user. */
router.post('/', async function (req: Request, res: Response, _next: NextFunction) {
    try {
        await userModel.create({"_id": uuidv4(), ...req.body});
    } catch (error: any) {
        console.error(error);
        if (error?.errorResponse?.code === 11000) {
            // Duplicate username
            return res.status(403).send();
        } else {
            // Bad request
            return res.status(400).send();
        }
    }

    let data = null;
    try {
        data = await userModel.findOne({"username": req.body["username"]}, "_id name username image uploadedProfilePicture description links interests");
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }
    return res.json(await formatUsers(stringifyUUID(data)));
});

/* PUT (update) a user's settings. */
router.put('/:subtoken/settings', async function (req: Request, res: Response, _next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({"sub": req.params.subtoken}, ["settings", "email"]);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }


    try {

        const SibApiV3Sdk = require('sib-api-v3-sdk');
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        let apiInstance = new SibApiV3Sdk.ContactsApi();

        const email = data["email"];

        // if accountLimitedDeals is edited
        if (!isEqual(req.body.accountLimitedDeals, data["settings"].accountLimitedDeals)) {
            // edited to be true then add it
            if (req.body.accountLimitedDeals) {

                let contactEmails = new SibApiV3Sdk.AddContactToList();
                contactEmails.emails = [email];
                apiInstance.addContactToList(5, contactEmails).then(function (data: any) {
                    // nice!
                }, function (error: Error) {
                    console.error("Error adding contact to limited deals list");
                });

            } else {
                // edited to be false then remove it
                let contactEmails = new SibApiV3Sdk.RemoveContactFromList();
                contactEmails.emails = [email];
                apiInstance.removeContactFromList(5, contactEmails).then(function (data: any) {
                    // nice!
                }, function (error: Error) {
                    console.error("Error removing contact from limited deals list");
                });
            }
        }

        // if accountNewsletterNotifications is edited
        if (!isEqual(req.body.accountNewsletterNotifications, data["settings"].accountNewsletterNotifications)) {
            // edited to be true then add it
            if (req.body.accountNewsletterNotifications) {

                let contactEmails = new SibApiV3Sdk.AddContactToList();
                contactEmails.emails = [email];
                apiInstance.addContactToList(6, contactEmails).then(function (data: any) {
                    // nice!
                }, function (error: Error) {
                    console.error("Error adding contact to newsletter list");
                });

            } else {
                // edited to be false then remove it
                let contactEmails = new SibApiV3Sdk.RemoveContactFromList();
                contactEmails.emails = [email];
                apiInstance.removeContactFromList(6, contactEmails).then(function (data: any) {
                    // nice!
                }, function (error: Error) {
                    console.error("Error removing contact from newsletter list");
                });
            }
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }


    data["settings"] = {...data["settings"], ...req.body};
    try {
        await data.save();


    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
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
            return res.status(401).send({message: "Your sub token does not match the one provided"})
        }
    }

    try {
        data = await userModel.findOne({"sub": req.params.sub}, "experience");
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }


    data["experience"] = {...data["experience"], ...req.body};
    try {
        await data.save();
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }
    res.json(data["experience"]);
});

router.put('/:subtoken/picture', upload.single("uploadedProfilePicture"), async function (req: Request, res: Response, next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({"sub": req.params.subtoken}, "image uploadedProfilePicture");
    } catch (error: any) {
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    // Creating a new S3File corresponding to the path to the saved image
    let uploadedProfilePicture: any = undefined;
    if (req.file !== undefined) {
        uploadedProfilePicture = await S3FileModel.create({
            "key": (req.file as Express.MulterS3.File)?.key,
            "bucket": (req.file as Express.MulterS3.File)?.bucket,
            "url": (req.file as Express.MulterS3.File)?.location,
            "uploaded_by": req.params.subtoken,
            "uploaded_at": Date.now(),
        });
    }

    // Updating various fields in the user data obtained from the database
    let userData;
    try {
        userData = await userModel.findOneAndUpdate(
            {"sub": req.params.subtoken},
            {"uploadedProfilePicture": (uploadedProfilePicture !== undefined) ? uploadedProfilePicture["_id"] : null},
            {new: true}
        );
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    // Removing fields that are not updated by this PUT endpoint
    res.json(await formatUsers(removeFields(userData, ["sub", "name", "username", "image", "email", "description", "links", "interests", "home", "currentlyAt", "settings", "experience", "trips"])));
});

/* PUT (edit) a user's profile information. */
router.put('/:subtoken', async function (req: Request, res: Response, next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({"sub": req.params.subtoken});
    } catch (error: any) {
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    let userData = data;


    // Updating various fields in the user data obtained from the database
    userData = new userModel({...userData, ...req.body});
    userData.isNew = false;
    try {
        await userData.save();
    } catch (error: any) {
        console.error(error);
        return res.status(400).send();
    }

    // Removing "settings", "experience", and "__v" from the final object returned to the frontend
    res.json(await formatUsers(removeFields(userData, ["settings", "experience", "__v"])));
});

/* DELETE a user. */
router.delete('/:subtoken', async function (req: Request, res: Response, _next: NextFunction) {
    let data = null;
    try {
        data = await userModel.findOne({"sub": req.params.subtoken}, "settings");
    } catch (error: any) {
        console.error(error);
        return res.status(500).send();
    }

    if (data === null) {
        return res.status(404).send();
    }

    await userModel.deleteOne({"sub": req.params.subtoken});
    res.status(204).send();
});

export default router;
