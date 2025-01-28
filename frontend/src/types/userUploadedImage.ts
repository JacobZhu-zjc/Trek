import {BasicUser} from "./user";


export interface UserUploadedImage {
    id?: string;
    key?: string;
    url: string;
    uploaded_at: Date;
    uploaded_by: BasicUser;
}
