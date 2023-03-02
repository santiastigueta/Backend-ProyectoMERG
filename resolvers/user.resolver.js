// crear usuario y guardarlo
//registro e inicio de sesión

import bcrypt from "bcrypt";

import Usuario from "../models/userModel.js";
import Series from "../models/seriesModel.js";

// tokens
import { createJWTToken } from "../utils/auth.js";
import { createRefreshJWTToken } from "../utils/auth.js";
//import { sendAccesToken } from "../utils/auth.js";
import { sendRefreshToken } from "../utils/auth.js";
import isAuth from "../middlewares/auth.js";

import createSerieResolver from "./createSerie.resolver.js";


import cookieParser from "cookie-parser";
import verify from "jsonwebtoken";

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
                sendRefreshToken(res, refreshToken);
                console.log('usuario logueado: ', usuarioLogin);
                //sendAccesToken(res, req, accesToken);
                console.log('hay cookies cuando me logueo? : ', req)
                return accesToken;
            } catch (error) {
                console.log("login error: ", error)
            }
        },
        logOut: async(root, args, { _req, res }) => {
            res.clearCookie('refreshtoken');
            return 'Logged out'
        },
        isProtected: async(root, args, { req, res }) => {

            console.log("cookies: ", req.cookieParser)
            try {
                const userId = isAuth(req);
                if (userId !== null) {
                    console.log("protected data")
                    return 'this is protected data'
                } else {
                    return 'this is not protected data'
                }
            } catch (error) {
                console.log('error isProtected: ', error)
            }
        },
        // REFRESH TOKEN
        sendRefreshToken: async(root, args, { req, res }) => {
            console.log("hay cookies? ", req.cookies)
            const token = req.cookies.refreshtoken;
            console.log("token?: ", token)
            if (!token) return 'no hay token';
            let payload = null;
            try {
                payload = verify(token, process.env.REFRESH_TOKEN);
            } catch (error) {
                return 'Error'
            }
            console.log('payload.userId: ', payload.userId)
            const user = Usuario.findOne({ _id: payload.userId })
            if (!user) return 'no se encontro user';
            if (user.refreshToken !== token) {
                return 'el token no coincide...'
            };
            const accestoken = createJWTToken(user._id);
            const refreshtoken = createRefreshJWTToken(user._id);
            user.refreshToken = refreshtoken;
            sendRefreshToken(res, refreshtoken);
            return accestoken;
        },
        createSerieUser: async(
            root, { userId, nombre, autor, estrellas, fechaLanzamiento, image, gender }
        ) => {
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
            const seriesUser = [...user.series, serieId];
            console.log('seriesUser: ', seriesUser);
            user.series = seriesUser;
            console.log("asignada una serie a usuario: ", user);
            await user.save();
            return 'agregada serie con éxito';
        },
        //investigar el motodo populate de mongoose
        // no voy a hacer public post. Para ver las series si o si hay que loguearse
    },
};

export default userResolver;