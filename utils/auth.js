import pkg from 'jsonwebtoken'

const createJWTToken = user => {
    return pkg.sign({ user }, 'mySuperSecretCryptoKey123', {
        expiresIn: '15m'
    });
};

const createRefreshJWTToken = user => {
    return pkg.sign({ user }, 'refreshSecretToken123', {
        expiresIn: '7d'
    });
};
const sendAccesToken = (res, req, accestoken) => {
    res.send({
        accestoken,
        email: req.body.email
    })
}
const sendRefreshToken = (res, refreshToken)=>{
    res.cookie('refreshtoken', token, {
        httpOnly: true,
        path: '/refresh_token'
    })
}
export default {
    createJWTToken,
    createRefreshJWTToken,
    sendAccesToken,
    sendRefreshToken
};