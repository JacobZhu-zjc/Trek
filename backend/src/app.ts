// import express from 'express';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import payload from 'payload';

// import apiV1 from './routes/api/apiV1';
// import expressWs from "express-ws";
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import { destinationModel } from './routes/mongodb/schemas/destinationModel';
// import { tripModel } from './routes/mongodb/schemas/tripModel';
// import { S3FileModel } from './routes/mongodb/schemas/s3FileModel';
// const { setupWSConnection } = require("y-websocket/bin/utils");

// const app = express();

// app.use(cors());
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

// app.use('/api/v1', apiV1);

// // Connecting to the MongoDB cluster
// mongoose.connect(process.env.ATLAS_URI).then(
//     () => {
//         console.log("Successfully connected to Atlas MongoDB server!");
//     }
// ).catch(
//     error => console.log("Error connecting to MongoDB Atlas server: " + error)
// );

// export default app;


import express from 'express'
import path from 'path';
import payload from 'payload'
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import apiV1 from './routes/api/apiV1';
import { upload } from './middlewares/s3';
import addSockets from "./socket";
import {tripModel} from './routes/mongodb/schemas/tripModel';


require('dotenv').config();
const app = express();

app.use('/api/v1', apiV1);
app.use('/graphics', express.static(path.resolve(__dirname, './graphics')));

app.use(cors({origin: '*'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

// /** Left as example for how upload works. Test on Postman */
// app.post('/test/upload', upload.array('photos', 3), function (req, res, next) {
//     res.send('Successfully uploaded ' + (req.files?.length ?? 0) + ' files!');
// });

const start = async () => {
    // Initialize Payload
    console.log('PAYLOAD_SECRET: ', process.env.PAYLOAD_SECRET)
    console.log('ATLAS_URI: ', process.env.ATLAS_URI)

    await payload.init({
        secret: process.env.PAYLOAD_SECRET || '',
        express: app,
        onInit: async () => {
            payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
        },
    });

    // Websocket setup needs to do here
    const port = process.env.PORT || '3000';
    addSockets(app);

    app.listen(port);
    console.log(`listening on ${port}`);
}

start()
