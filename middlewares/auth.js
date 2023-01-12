import pkg from 'jsonwebtoken';
const { verify } = pkg;

const isAuth = (req, res) => {

    const authorization = req.headers['authorization'];
    if (!authorization) throw new Error("You need to Login");
    const token = authorization.split(" ")[1];
    const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
    return userId;
};

export default isAuth;