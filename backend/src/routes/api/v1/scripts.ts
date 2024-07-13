import { isDeepStrictEqual } from "util";

// Function to detect if any of the provided props in "newData" have a different value than those in "originalData"
export const isEdited = (newData: any, originalData: any, fields: string[]): boolean => {
    for (const prop of fields) {
        if (newData[prop] !== undefined && !isEqual(newData[prop], originalData[prop])) {
            return true;
        }
    }
    return false;
};

// Helper function for object and array equality
const isEqual = (newData: any, originalData: any): boolean => {
    if (Array.isArray(newData) && Array.isArray(originalData)) {
        for (let i = 0; i < Math.max(newData.length, originalData.length); i++) {
            if ((typeof originalData !== "object" || !{...originalData[i]}.hasOwnProperty("_doc")) && !isDeepStrictEqual(newData[i], originalData[i])) {
                // Case for simple comparison
                return false;
            } else if ((typeof originalData === "object" && {...originalData[i]}.hasOwnProperty("_doc")) && !isDeepStrictEqual(newData[i], {...originalData[i]}["_doc"])) {
                // Case for object comparison
                return false;
            }
        }
        return true;
    } else {
        // FIXME: extract spread equality comparison to helper function, add check for newData as well
        return isDeepStrictEqual(newData, originalData);
    }
};

// Function to turn UUID field from buffer object to a string
export const stringifyUUID = (data: any): any => {
    let toReturn = Object(data);
    toReturn["_doc"]["_id"] = String(toReturn["_id"]);
    return toReturn["_doc"];
};

// Helper function to remove fields from a retrieved model, for the purpose of limiting data sent by the endpoint
export const removeFields = (data: any, fields: string[]): any => {
    let toReturn = stringifyUUID(data);
    for (const prop of fields) {
        delete toReturn[prop];
    }
    return toReturn;
}
