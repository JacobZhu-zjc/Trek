import {Application} from "express";
import expressWs from "express-ws";
import http from "http";
import { fetchPayload, Server, storePayload } from "@hocuspocus/server";
import {Database} from "@hocuspocus/extension-database";
import { Types } from "mongoose";
import { tripModel } from "./routes/mongodb/schemas/tripModel";

// Be very careful! There is a SECURITY vulnerability if HOSTNAME is not set as an
// environment variable on production.
const ORIGIN = process.env.HOSTNAME ? process.env.HOSTNAME : "http://localhost:5173";

export default function addSockets(origApp: Application) {
    const { app } = expressWs(origApp);
    const hocusServer = Server.configure({
        extensions: [
            new Database({
              fetch: async (data: fetchPayload) => {
                console.log("Fetching from db");
                const dbData = await tripModel.findOne({ _id: data.documentName });
                console.log(dbData);
                const index = Number(data.requestParameters.get("index"));
                if (dbData && !isNaN(index)) {
                  const item = dbData.trip_items[index];
                  return item.notes ?? null;
                } else {
                  return null;
                }
              },
              store: async (data: storePayload) => {
                const dbData = await tripModel.findOne({ _id: data.documentName });
                const index = Number(data.requestParameters.get("index"));
                if (dbData && !isNaN(index)) {
                  const item = dbData.trip_items[index];
                  item.notes = data.state;
                  await tripModel.findOneAndUpdate({ _id: data.documentName }, dbData);
                }
              },
            })
        ]
    });

    app.ws("/collaboration", (ws, req) => {
        const context = {
            user: {
                id: 1234,
                name: "Test"
            }
        };

        hocusServer.handleConnection(ws, req, context);
     });
}
