import express from 'express'
import path from 'path';
import payload from 'payload'
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import apiV1 from './routes/api/apiV1';
import addSockets from "./socket";
import addYjsSocket from './yjsSocket';


require('dotenv').config();
const app = express();

app.use('/api/v1', apiV1);
app.use('/graphics', express.static(path.resolve(__dirname, './graphics')));

app.use(cors({origin: '*'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Redirect root to Admin panel
app.get('/', (_, res) => {
    res.redirect('/admin')
})

// Connecting to the MongoDB cluster
mongoose.connect(process.env.ATLAS_URI || '').then(
    () => {
        console.log("Successfully connected to Atlas MongoDB server!");
    }
).catch(
    error => console.log("Error connecting to MongoDB Atlas server: " + error)
);

const start = async () => {
    // Initialize Payload
    await payload.init({
        secret: process.env.PAYLOAD_SECRET || '',
        express: app,
        onInit: async () => {
            payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
        },
    });

    // Websocket setup needs to do here
    const port = process.env.PORT || '3000';

    const server = addYjsSocket(app); // Set up the server with Socket.IO

    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

    const collabApp = express();
    addSockets(collabApp);

    collabApp.listen(3001, () => {
        console.log("Collaboration app listening on port 3001");
    });
}

start()
