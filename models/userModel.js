import mongoose from "mongoose";
import Series from "./seriesModel.js";
const User = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "no puede ser vacío"],
        match: [/^[a-zA-Z0-9]+$/, 'es inválido'],
        index: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "no puede ser vacío"],
        match: [/\S+@\S+\.\S+/, 'es inválido'],
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: String,
    image: String,
    series: { type: mongoose.Schema.ObjectId, ref: Series }
});


const Usuario = mongoose.model('User', User);
export default Usuario;