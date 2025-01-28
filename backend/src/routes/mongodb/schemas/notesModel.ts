import mongoose from "mongoose";
import {Notes} from "../../../types/tripTypes";

const notesSchema = new mongoose.Schema<Notes>({
    trip_item_key: {type: String, required: true, unique: true},
    notes: {type: Buffer}
});

export const notesModel = mongoose.model("Notes", notesSchema);
