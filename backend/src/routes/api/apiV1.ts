import express from 'express';
const { auth } = require('express-oauth2-jwt-bearer');
import usersRouter from './v1/users';
import tripsRouter from './v1/trips';

var router = express.Router();

export default [
    router.use('/users', usersRouter),
    router.use('/trips', tripsRouter),
];
