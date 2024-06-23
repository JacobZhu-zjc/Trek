import express from 'express';

import usersRouter from './v1/users';
import tripsRouter from './v1/trips';
import destinationsRouter from './v1/destination';

var router = express.Router();

export default [
    router.use('/users', usersRouter),
    router.use('/trips', tripsRouter),
    router.use('/destination', destinationsRouter)
];

