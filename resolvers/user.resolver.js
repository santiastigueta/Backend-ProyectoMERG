// crear usuario y guardarlo
//registro e inicio de sesión

import bcrypt from "bcrypt";

import Usuario from "../models/userModel.js";
import Series from "../models/seriesModel.js";

// tokens
import createJWTToken  from "../utils/auth.js";
import createRefreshJWTToken from "../utils/auth.js";
import sendAccesToken from "../utils/auth.js";
import sendRefreshToken from "../utils/auth.js";

import createSerieResolver from "./createSerie.resolver.js";

const userResolver = {
    Query: {
        getUsuarios: async(root) => {
            const allUsers = await Usuario.find({}).populate("series");
            console.log("allusers: ", allUsers);
            return allUsers;
        },
        loginUsuario: async(root, { email, password }) => {
            const usuarioLogin = await Usuario.findOne({
                    email: email,
                    //password: password
                })
                .select("password").select("refreshToken");
            if (!usuarioLogin) throw new Error("No se encontró el usuario");
            const isMatch = await bcrypt.compare(password, usuarioLogin.password);
            if (!isMatch) throw new Error("Usuario o contraseña incorrectos");
            const token = createJWTToken({
                _id: usuarioLogin._id
            });
            const refreshToken = createRefreshJWTToken({
                _id: usuarioLogin._id
            });
            usuarioLogin.refreshToken = refreshToken;
            console.log('usuario logueado: ', usuarioLogin);

            return token;
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
            const salt = await bcrypt.genSalt(10);
            console.log("salt: ", salt);
            const hashedPassword = await bcrypt.hash(password, salt);
            newUser.password = hashedPassword;
            const user = await Usuario.create(newUser);
            console.log(user);
            const token = createJWTToken({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
            //const token = createJWTToken(user);
            console.log("verifiedUser: ", verifiedUser);
            console.log(token);
            return token;
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