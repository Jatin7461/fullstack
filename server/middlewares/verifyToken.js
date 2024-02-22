const jwt = require('jsonwebtoken')
function verifyToken(req, res, next) {

    const bearerToken = req.headers.authorization;

    if (bearerToken) {
        const token = bearerToken.split(' ')[1];

        let decodedToken = jwt.verify(token, 'abcdefgh');
        console.log(decodedToken)
        next()
    }
    else {
        res.send({ message: "Unauthorised access" })
    }

}

module.exports = verifyToken;