import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import apiV1 from './routes/api/apiV1';
import expressWs from "express-ws";
import {Server} from 'socket.io';
import {createServer} from 'http';
const { setupWSConnection } = require("y-websocket/bin/utils");

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/v1', apiV1);

// Connecting to the MongoDB cluster
mongoose.connect(process.env.ATLAS_URI).then(
    () => console.log("Successfully connected to Atlas MongoDB server!")
).catch(
    error => console.log("Error connecting to MongoDB Atlas server: " + error)
);

export default app;
