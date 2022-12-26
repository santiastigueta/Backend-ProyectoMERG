import pkg from 'jsonwebtoken'

const createJWTToken = user => {
    return pkg.sign({ user }, 'mySuperSecretCryptoKey123', {
        expiresIn: '3h'
    })
}

export default createJWTToken;