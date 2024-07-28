// Module to declare TS types for .env variables
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ATLAS_URI: string | false;
        }
    }
}

// Converting the file into a module using an empty export statement
export { };
