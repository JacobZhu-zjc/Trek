import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import { USDCurrencyConversion } from './currencyModels';
import mongoose from 'mongoose';


const mongoDbConnection: string = process.env.ATLAS_URI || '';


export const handler: APIGatewayProxyHandler = async (event) => {

    try {
        mongoose.connect(mongoDbConnection)
            .then(async () => {
                console.log('MongoDB connected');

                const response = await axios.get('https://api.fxratesapi.com/latest?base=USD&resolution=1m&amount=1&places=6&format=json', {
                    headers: {
                        'Authorization': `Bearer ${process.env.FX_RATES_API_KEY}`,
                    }
                });
                if (response.data.success) {
                    const rates = response.data.rates;
                    const lastUpdated = new Date(response.data.timestamp * 1000);

                    const bulkOps = Object.keys(rates).map(currencyCode => {
                        return {
                            updateOne: {
                                filter: { currencyCode },
                                update: {
                                    currencyCode,
                                    conversionRate: rates[currencyCode],
                                    lastUpdated,
                                },
                                upsert: true,
                            }
                        };
                    });

                    await USDCurrencyConversion.bulkWrite(bulkOps);

                } else {
                    console.error('Failed to fetch currency rates:', response.data);
                }
            })
            .catch((error) => {
                console.error('MongoDB connection error:', error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: 'Failed to connect to MongoDB',
                    }),
                };
            });

    } catch (error) {
        console.error('Error fetching currency rates:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to fetch currency rates',
            }),
        };
    } finally {
        mongoose.disconnect();
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Currency data updated successfully',
        }),
    };
}