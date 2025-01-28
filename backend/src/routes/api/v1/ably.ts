import cors from "cors";
import express from "express";
import {Rest} from "ably";

const {auth} = require('express-oauth2-jwt-bearer');

const router = express.Router();
router.use(cors());
router.use(express.json());

const jwtCheck = auth({
    audience: process.env.API_AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

const ably = new Rest({key: process.env.ABLY_API_KEY});

router.get("/", jwtCheck, async (req: express.Request<{ id: string }>, res) => {
    if (!req.query.id || !(req.query.id instanceof String || typeof req.query.id === "string")) {
        return res.status(400).send({error: "Bad request"});
    }
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({"error": "Missing authentication"});
    }

    const tokenRequest = await ably.auth.createTokenRequest({clientId: req.query.id as string});

    return res.status(200).send(tokenRequest);
});

export default router;
