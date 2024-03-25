const jwt = require('jsonwebtoken')
function verifyToken(req, res, next) {

    //fetch token from headers
    let bearerToken = req.headers.authorization;

    //if token exists then verify it 
    if (bearerToken) {
        const token = bearerToken.split(' ')[1];
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        next()
    }
    //token does not exists
    else {
        res.send({ message: "Unauthorised access" })
    }

}

module.exports = verifyToken;