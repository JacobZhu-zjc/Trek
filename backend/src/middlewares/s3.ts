import path from 'path';
import s3 from '../awsConfig';

const multer = require('multer')
const multerS3 = require('multer-s3')

// Middleware to handle multipart data (fields and files together) in an HTTP request
// Also responsible for directly uploading to Amazon S3
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.USER_S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (_req: any, file: { fieldname: any; }, cb: (arg0: null, arg1: { fieldName: any; }) => void) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (_req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) {
            const extension = path.extname(file.originalname);
            const fileName = `${Date.now().toString()}${extension}`;
            cb(null, fileName);
        }
    })
});

// Additional middleware to allow a single endpoint (PUT /api/v1/trips/:UUID/picture) to upload files for different fields
export const tripPictureFields = upload.fields([
    {name: "mainImage", maxCount: 1},
    {name: "photos"}
]);
