const jwt = require('jsonwebtoken')
function verifyToken(req, res, next) {

    let bearerToken = req.headers.authorization;


    if (bearerToken) {
        const token = bearerToken.split(' ')[1];

        let decodedToken = jwt.verify(token, 'abcdefgh');
        next()
    }
    else {
        res.send({ message: "Unauthorised access" })
    }

}

module.exports = verifyToken;