import pkg from 'jsonwebtoken'

const createJWTToken = userId => {
    return pkg.sign({ userId }, 'mySuperSecretCryptoKey123', {
        expiresIn: '15m'
    });
};

const createRefreshJWTToken = userId => {
    return pkg.sign({ userId }, 'refreshSecretToken123', {
        expiresIn: '7d'
    });
};
/* const sendAccesToken = (res, req, accestoken) => {
    res.send({
        accestoken,
        email: req.body.email
    })
} */
const sendRefreshToken = (res, refreshToken) => {
    res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        //path: '/refresh_token'
    })
}
export {
    createJWTToken,
    createRefreshJWTToken,
    //sendAccesToken,
    sendRefreshToken
};