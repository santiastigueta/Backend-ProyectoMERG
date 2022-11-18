import mongoose from "mongoose";
import crypto from 'crypto';

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
    bio: String,
    image: String,
    hash: String,
    salt: String
}, { timestamps: true });

User.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}


const Usuario = mongoose.model('User', User);
/* const miUsuario = new Usuario({ username: 'Santiago', email: 'santiasti@gmail.com', })
miUsuario.save(); */
export default Usuario;