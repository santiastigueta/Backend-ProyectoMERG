// crear usuario y guardarlo
//registro e inicio de sesión



import Usuario from '../models/userModel.js'
import Series from '../models/seriesModel.js'

const userResolver = {
    Query: {
        getUsuarios: async(root, ) => {
            const allUsers = Usuario.find({});
            console.log("allusers: ", allUsers)
            return await allUsers;
        },
        loginUsuario: async(root, { email, password }) => {
            const user = Usuario.findOne({
                where: {
                    email: email,
                    password: password
                }
            })
            console.log('usuario encontrado: ', user);
            return await user;
        },
        /* logout: async(root, args, context, info) => {
            const state = context.req.session.user;
            console.log("state: ", state);
            return true;
        } */
        //pedirle ayuda a lucas con los login y los logout
    },
    Mutation: {
        registerUsuario: async(root, { username, email, password, bio, image }) => {
            let user = {}
            user.username = username; //el nombre no puede tener espacios
            user.email = email;
            user.password = password;
            user.bio = bio;
            user.image = image;
            return await Usuario.create(user)
        },
    }
}

export default userResolver;