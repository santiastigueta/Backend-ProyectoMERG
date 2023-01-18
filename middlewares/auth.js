import pkg from 'jsonwebtoken';

const authToken = async(req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return 'Token not found';
    try { 
        const user = await pkg.verify(token, "mySuperSecretCryptoKey123");
        req.user = user._id;
        next();
    } catch (error) {
        return new Error('error, no hay token.')
    }
};
// este authToken va a verificar que el usuario este logueado
// se tiene que aplicar a cada peticion privada 
export default authToken; 