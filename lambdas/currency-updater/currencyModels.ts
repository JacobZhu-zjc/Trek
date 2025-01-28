import mongoose, { Document, Schema, model } from 'mongoose';

interface ICurrencyConversion extends Document {
    currencyCode: string;
    conversionRate: number;
    lastUpdated: Date;
}

const CurrencyConversionSchema: Schema = new Schema<ICurrencyConversion>({
    currencyCode: {
        type: String,
        required: true,
        unique: true,
    },
    conversionRate: {
        type: Number,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const USDCurrencyConversion = model<ICurrencyConversion>('USDCurrencyConversion', CurrencyConversionSchema);
const CADCurrencyConversion = model<ICurrencyConversion>('CADCurrencyConversion', CurrencyConversionSchema);


export { USDCurrencyConversion, CADCurrencyConversion };