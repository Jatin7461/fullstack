const jwt = require('jsonwebtoken')
function verifyToken(req, res, next) {

    let bearerToken = req.headers.authorization;
    console.log('bearer token is', bearerToken)


    if (bearerToken) {
        const token = bearerToken.split(' ')[1];

        let decodedToken = jwt.verify(token, 'abcdefgh');
        console.log('decoded token is', decodedToken)
        next()
    }
    else {
        res.send({ message: "Unauthorised access" })
    }

}

module.exports = verifyToken;