import pkg from 'jsonwebtoken';

const authToken = async(req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) throw new Error('No se encontró un token')
    try {
        const user = pkg.verify(token, "mySuperSecretCryptoKey123");
        req.user = user._id;
        console.log("hay token!")
        next();
    } catch (error) {
        console.log("invalid token: ", error)
    }
};
// este authToken va a verificar que el usuario este logueado
// se tiene que aplicar a cada peticion privada 
export default authToken;