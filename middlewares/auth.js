import pkg from 'jsonwebtoken'
const authenticate = (req, res, next) => {

    /* const token = req.headers.authorization ? .split(' ')[1]
    console.log(token);
    next() */

    /* const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) throw new Error("token inválido");
    console.log('token middleware: ', token); */
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("No authorization");
        const token = authHeader.split(" ")[1];

        const verified = pkg.verify(token, 'mySuperSecretCryptoKey123')
        req.verifiedUser = verified;
        //console.log(verified)
        //req.authorization = verified.user
        next();
    } catch (error) {
        next();
    }

}
// 
export default authenticate;