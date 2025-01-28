import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import {ICurrencyConversion, USDCurrencyConversion} from "../../../routes/mongodb/schemas/CurrencyConversionModel";

const {auth} = require('express-oauth2-jwt-bearer');
require('dotenv').config();
const router = express.Router();
router.use(cors());
router.use(express.json());

const jwtCheck = auth({
    audience: process.env.API_AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});


router.post('/currency', async function (req: Request, res: Response, next: NextFunction) {

    const {amount, from, to} = req.body;

    if (!amount || !from || !to) {
        return res.status(400).json({error: 'Amount, from, and to are required'});
    }

    try {
        // Fetch conversion rates for 'from' and 'to' currencies
        const fromCurrency: ICurrencyConversion | null = await USDCurrencyConversion.findOne({currencyCode: from.toUpperCase()});
        const toCurrency: ICurrencyConversion | null = await USDCurrencyConversion.findOne({currencyCode: to.toUpperCase()});

        if (!fromCurrency || !toCurrency) {
            return res.status(400).json({error: 'Invalid currency code'});
        }


        /**
         * Note: This is a 2-step conversion process:
         * 1. Convert the amount to USD
         * 2. Convert the amount from USD to the target currency
         */

            // Convert amount to USD
        const amountInUSD = amount / fromCurrency.conversionRate;

        // Convert amount from USD to target currency
        const convertedAmount = amountInUSD * toCurrency.conversionRate;

        res.json({amount: convertedAmount, from, to});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }

});

export default router;
