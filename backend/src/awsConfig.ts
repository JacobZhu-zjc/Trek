import {S3Client} from '@aws-sdk/client-s3';

require('dotenv').config();

const s3 = new S3Client({
    region: process.env.USER_S3_REGION,
    credentials: {
        accessKeyId: process.env.USER_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.USER_S3_SECRET_ACCESS_KEY || ''
    },
});

export default s3;
