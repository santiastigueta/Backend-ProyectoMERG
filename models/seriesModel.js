import mongoose from "mongoose";
//import { Schema } from "mongoose";

const serieSchema = new mongoose.Schema({
    name: {
        type: String,
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
    }

});

const Series = mongoose.model('Series', serieSchema);

export default Series;