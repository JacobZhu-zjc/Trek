import express from 'express';
import usersRouter from './v1/users';
import tripsRouter from './v1/trips';
import chatbotRouter from './v1/open-ai/openai';
import ablyRouter from "./v1/ably";
import budgetRouter from "./v1/budget";


var router = express.Router();

export default [
    router.use('/users', usersRouter),
    router.use('/trips', tripsRouter),
    router.use('/chatbot', chatbotRouter),
    router.use('/ably', ablyRouter),
    router.use('/budget', budgetRouter)
];
