import mongoose from 'mongoose';
import { User } from './userTypes';

export interface S3File extends Document {
    key: string;
    bucket: string;
    url: string;
    uploaded_by: PopulatedDoc<User>;
    uploaded_at: Date;
}
