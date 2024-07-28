/**
 * Types for Users in Trek
 * @author Matthew Kang
 */

import { ObjectId } from 'mongoose';

export interface User extends Document {
    trips: ObjectId[];
    saved_poi_area: ObjectId[];
    liked_poi_area: ObjectId[];
}
