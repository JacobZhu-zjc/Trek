import {Application} from "express";
import expressWs from "express-ws";
import {fetchPayload, Server, storePayload} from "@hocuspocus/server";
import {Database} from "@hocuspocus/extension-database";
import {notesModel} from "./routes/mongodb/schemas/notesModel";
import * as Y from 'yjs';
import {jwtDecode} from "jwt-decode";
import {tripModel} from "./routes/mongodb/schemas/tripModel";

const {auth} = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
    audience: process.env.API_AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

export default function addSockets(origApp: Application) {
    const {app} = expressWs(origApp);
    const hocusServer = Server.configure({
        async onConnect(data) {
            const id = data.requestParameters.get("id");
            const trip = await tripModel.findById(id);
            if (trip === null) {
                throw new Error("Could not find trip");
            }

            if (trip.private === false) {
                data.connection.requiresAuthentication = false;
                data.connection.readOnly = true;
            }
        },
        async onAuthenticate(data) {
            const id = data.requestParameters.get("id");
            if (!id) {
                throw new Error("Missing params");
            }

            const trip = await tripModel.findById(id);
            if (trip === null) {
                throw new Error("Could not find trip");
            }
            const {token} = data;

            const sub = jwtDecode(token as string)["sub"];
            if (!sub) {
                throw new Error("Missing sbu");
            }
            if (trip.private && !trip.members.includes(sub) && trip.owner !== sub) {
                throw new Error("Member is not authorized to edit this trip");
            }
        },
        extensions: [
            new Database({
                fetch: async (data: fetchPayload) => {
                    if (data.documentName == "") {
                        // Data has not loaded yet
                        return null;
                    }
                    const dbData = await notesModel.findOne({trip_item_key: data.documentName});
                    if (dbData) {
                        return dbData.notes;
                    } else {
                        const notes = Y.encodeStateAsUpdate(new Y.Doc());
                        return notes;
                    }
                },
                store: async (data: storePayload) => {
                    const dbData = await notesModel.findOne({trip_item_key: data.documentName});

                    if (dbData) {
                        dbData.notes = data.state;
                        await dbData.save();
                    } else {
                        await notesModel.create({
                            trip_item_key: data.documentName,
                            notes: data.state
                        })
                    }
                },
            })
        ]
    });

    app.ws("/collaboration", async (ws, req) => {

        hocusServer.handleConnection(ws, req);
    });

    return app;
}
