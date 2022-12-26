import mongoose from "mongoose";
import Schema from "mongoose";
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
        required: true,
        select: false
    },
    bio: String,
    image: String,
    series: [{ type: Schema.Types.ObjectId, ref: 'Series' }]
});


const Usuario = mongoose.model('User', User);
// prueba

/* const user1 = new Usuario({
    _id: new mongoose.Types.ObjectId(),
    username: "SantiPrueba4",
    email: "santiprueba4@gmail.com",
    password: "santi12345"
});

user1.save(function(err) {
    if (err) {
        console.log('error: ', err)
    }
    const serie1 = new Series({
        name: "santi4",
        author: "santiAsti",
        rating: "9",
        releaseDate: "2022",
        gender: "drama",
        user: user1._id 
    });

    serie1.save()
}); */
export default Usuario;