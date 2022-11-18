// crear usuario y guardarlo
//registro e inicio de sesión



import Usuario from '../models/userModel.js'

const userResolver = {
    Query: {
        getUsuarios: async(root, ) => {
            return await Usuario.find({})
        }
    },
    Mutation: {}
}

export default userResolver;