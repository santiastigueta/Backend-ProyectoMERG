// crear usuario y guardarlo
//registro e inicio de sesión

import bcrypt from "bcrypt";
import pkg from 'jsonwebtoken'
import Usuario from "../models/userModel.js";
import Series from "../models/seriesModel.js";

// tokens
import { createJWTToken } from "../utils/auth.js";
import { createRefreshJWTToken } from "../utils/auth.js";
//import { sendAccesToken } from "../utils/auth.js";
//import { sendRefreshToken } from "../utils/auth.js";
import isAuth from "../middlewares/auth.js";

import createSerieResolver from "./createSerie.resolver.js";

import verify from "jsonwebtoken";
import authToken from "../middlewares/auth.js";

let refreshTokens = [];
const userResolver = {
    Query: {
        getUsuarios: async(root) => {
            const allUsers = await Usuario.find({}).populate("series");
            console.log("allusers: ", allUsers);
            return allUsers;
        },

        //getPrivateSeries: async() => { // este es el private Post
        // necesita el authToken (no se como xd)

        //}
    },
    Mutation: {
        registerUsuario: async(root, { username, email, password }) => {
            let newUser = {};
            newUser.username = username; //el nombre no puede tener espacios
            newUser.email = email;
            // hash password:
            try {
                const salt = await bcrypt.genSalt(10);
                console.log("salt: ", salt);
                const hashedPassword = await bcrypt.hash(password, salt);
                newUser.password = hashedPassword;
                console.log("newUser: ", newUser);
            } catch (error) {
                console.log('error de bcrypt: ', error)
            }
            try {
                const user = await Usuario.create(newUser);
                console.log("Usuario Creado: ", user);
                const token = createJWTToken({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                });
                //const token = createJWTToken(user);
                console.log("verifiedUser: ", user);
                console.log(token);
                return token;
            } catch (error) {
                console.log('error creacion de usuario: ', error)
            }
        },
        loginUsuario: async(root, { email, password }, { req, res }) => {
            try {
                const usuarioLogin = await Usuario.findOne({
                    email: email
                }).select("password").select("refreshToken");
                if (!usuarioLogin) throw new Error("No se encontró el usuario");
                const isMatch = await bcrypt.compare(password, usuarioLogin.password);
                if (!isMatch) throw new Error("Usuario o contraseña incorrectos");
                const accesToken = createJWTToken({
                    _id: usuarioLogin._id
                });
                const refreshToken = createRefreshJWTToken({
                    _id: usuarioLogin._id
                });
                usuarioLogin.refreshToken = refreshToken;
                usuarioLogin.save();
                return accesToken;
            } catch (error) {
                console.log("login error: ", error)
            }
        },
        logOut: async(root, args, { req, res }) => {
            const refreshToken = req.header("x-auth-token");
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            console.log('logged out')
            return 'Logged out';
        },
        createAccTokenfromRefreshToken: async(root, args, { req, res }) => {
            const refreshToken = req.header("x-auth-token");
            if (!refreshToken) return "No se encontró el x-auth-token";
            if (!refreshTokens.includes(refreshToken)) return "refresh token invalido (??)";
            try {
                const user = await pkg.verify(
                    refreshToken,
                    'refreshSecretToken123'
                );
                const { _id } = user;
                const accesToken = await pkg.sign({ _id }, 'mySuperSecretCryptoKey123', { expiresIn: "1m" });
                return accesToken;
            } catch (error) {
                console.log("token invalido: ", error)
            }
        },
        createSerieUser: async(
            root, { userId, nombre, autor, estrellas, fechaLanzamiento, image, gender }
        ) => {
            //createSerieUser está sin uso.
            const nuevaSerie = await createSerieResolver(
                userId,
                nombre,
                autor,
                estrellas,
                fechaLanzamiento,
                image,
                gender
            );

            const user = await Usuario.find({ _id: userId });
            console.log("miuser: ", user);

            await user.save();
            return nuevaSerie;
        },
        asignarSerieUser: async(root, { userId, serieId }) => {
            const user = await Usuario.findById(userId);
            const serieFind = await Series.findById(serieId);

            const serie = serieFind._id.toString();
            const seriesDelUser = [user.series].toString();
            const arraySeries = seriesDelUser.split(',');
            const seriesUser = [...arraySeries, serie];
            // Estoy evitando que se repita la serie al agregarla.
            function removeDuplicates(arr) {
                let unique = [];
                arr.forEach(element => {
                    if (!unique.includes(element)) {
                        unique.push(element);
                    }
                });
                return unique;
            };
            const result = removeDuplicates(seriesUser);
            user.series = result;

            await user.save();
            return 'agregada serie con éxito';
        },
        // esta funcion hace el efecto contrario a asignarSeriesUser, elimina una serie de la lista de un usuario. 
        deleteSeriesFromUser: async(root, { userId, serieId }, { req, res, next }, info) => {
            authToken(req, res, next);

            const user = await Usuario.findById(userId);
            const serieFind = await Series.findById(serieId);

            const serie = serieFind._id.toString();
            const seriesDelUser = [user.series].toString();
            const arraySeries = seriesDelUser.split(',');
            const result = arraySeries.filter(element => element !== serie);

            user.series = result;
            await user.save();
            return 'Serie eliminada '
        }
    },
};

export default userResolver;