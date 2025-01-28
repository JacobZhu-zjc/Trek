// Module to declare TS types for .env variables
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ATLAS_URI: string | false;
            ISSUER_BASE_URL: string;
            API_AUDIENCE: string;
            PAYLOAD_SECRET: string;

            ADMIN_S3_REGION: string;
            ADMIN_S3_ACCESS_KEY_ID: string;
            ADMIN__S3_SECRET_ACCESS_KEY: string;
            ADMIN_S3_BUCKET: string;

            USER_S3_REGION: string;
            USER_S3_ACCESS_KEY_ID: string;
            USER_S3_SECRET_ACCESS_KEY: string;
            USER_S3_BUCKET: string;
        }
    }
}

// Converting the file into a module using an empty export statement
export {};
