const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')


const User = require('../db.js').User
// userApp.use((req, res, next) => {
//     usersCollection = req.app.get('usersCollection')
//     next();
// })


const getEmail = async (req, res, next) => {

    let emid = req.query.email;
    console.log(req.query)
    console.log('emailid', emid)
    let user = await User.findOne({ email: emid })
    console.log(user)
    // console.log("hihihi")
    if (!user) {
        res.send({ payload: null })
    }
    else {
        res.send({ payload: user })
    }

}


//user login code
const userLogin = async (req, res) => {
    let userData = req.body, email = userData.email, password = userData.password;

    if (!email || !password) {
        return res.send({ message: "Incomplete Credentials" })
    }

    let userFound = await User.findOne({ email: email })


    if (!userFound) {
        return res.status(404).send({ message: "No user found" })
    }

    let passwordMatch = await bcryptjs.compare(password, userFound.password)

    console.log(passwordMatch)

    if (!passwordMatch) {
        return res.send({ message: "Invalid password" })
    }


    const jwtToken = jwt.sign({ email: email }, "abcdefgh", { expiresIn: "30m" })

    res.send({ message: "User Found", token: "Bearer " + jwtToken, payload: userFound })



}



const getUserWithId = async (req, res, next) => {


    const id = req.params.id;
    console.log("running get user with id")
    let user = await User.findOne({ _id: id });
    console.log('user with id:', user)
    if (!user) {
        res.send({ payload: null })
    }
    else {
        res.send({ payload: user })
    }


}





const createUser = async (req, res) => {

    // const usersCollection = req.app.get("usersCollection");
    const user = req.body;
    console.log('user is', user)
    if (!user.name || !user.pass || !user.email) {
        return res.send({ message: "Incomplete user data" })
    }


    let userFromDb = await User.findOne({ email: user.email });
    console.log('user from db', userFromDb)
    if (userFromDb !== null) {
        res.status(200).send({ message: "User already exists" })
    }
    else {

        let hashedPassword = await bcryptjs.hash(user.pass, 5)
        user.password = hashedPassword

        await User.create(user)
        console.log("new user created", user)
        res.status(200).send({ message: "new user created" })
    }
}



// userApp.get('/protected', verifyToken, (req, res) => {
//     res.send({ message: "access to protected granted" })
// })



const updateUser = async (req, res, next) => {
    const user = req.body
    console.log('user', user)
    let dbRes = await User.updateOne({ _id: user._id }, { $set: { ...user } })

    // console.log(dbRes);

    res.status(200).send({ message: "User Updated" });
}




module.exports = { getEmail, createUser, getUserWithId, updateUser, userLogin };


