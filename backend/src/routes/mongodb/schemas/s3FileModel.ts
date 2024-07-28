import mongoose, {Schema} from 'mongoose';
import {S3File} from '../../../types/s3File';

export const S3FileSchema = new Schema<S3File>({
    key: {type: String, required: true},
    bucket: {type: String, required: true},
    url: {type: String, required: true},
    uploaded_by: {type: mongoose.Types.UUID, ref: 'User', required: true},
    uploaded_at: {type: Date, default: Date.now},
});

export const S3FileModel = mongoose.model<S3File>('S3File', S3FileSchema);
