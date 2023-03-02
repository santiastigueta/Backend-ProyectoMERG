import mongoose from "mongoose";
import Usuario from "./userModel.js";
import Schema from "mongoose";
const serieSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    author: {
        type: String
    },
    rating: {
        type: String
    },
    releaseDate: {
        type: String
    },
    image: {
        type: String
    },
    gender: {
        type: String
    },
    name_lower: {
        type: String
    },
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]

});

const Series = mongoose.model('Series', serieSchema);

export default Series;