import {Application} from "express";
import expressWs from "express-ws";
import http from "http";
import { Server } from "@hocuspocus/server";
import {Database} from "@hocuspocus/extension-database";

// Be very careful! There is a SECURITY vulnerability if HOSTNAME is not set as an
// environment variable on production.
const ORIGIN = process.env.HOSTNAME ? process.env.HOSTNAME : "http://localhost:5173";

let numUsers = 0;

// function getIo(server: http.Server) {
//     const io = new Server(server, {
//         cors: {
//             origin: ORIGIN,
//         },
//     });
//     io.on("connection", (socket) => {
//         numUsers++;
//         console.log("connection has started, num users is " + numUsers);
//         io.emit("numUsersUpdate", numUsers);

//         socket.on("tripTitleUpdate", ({name, text}) => {
//             console.log("trip title was updated to " + text + " by " + name);
//             io.emit("tripTitleUpdate", {name: name, text: text});
//         });

//         socket.on("nameConnect", (name: string) => {
//             console.log(name + " has connected");
//         })

//         socket.on("disconnect", () => {
//             console.log("disconnected");
//             numUsers--;
//             io.emit("numUsersUpdate", numUsers);
//         });
//     });
// }

function getWs(server: http.Server, origApp: Application) {
    const { app } = expressWs(origApp, server);
    const hocusServer = Server.configure({
        extensions: [
            // new Database({
            //     fetch: async ({ documentName }) => {
            //         return new Promise(1);
            //     }
            // })
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

module.exports = { getWs };
