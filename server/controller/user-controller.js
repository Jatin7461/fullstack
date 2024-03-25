const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken')


const User = require('../db.js').User



const getEmail = async (req, res, next) => {

    //fetch email from query
    let emid = req.query.email;

    //find the user with given email
    let user = await User.findOne({ email: emid })
    //if user does not exists
    if (!user) {
        res.send({ message: "User Not Found", payload: null })
    }
    //if user exists
    else {
        res.send({ message: "User Found", payload: user })
    }

}



//user login code
const userLogin = async (req, res) => {

    //fetch user data
    let userData = req.body, email = userData.email, password = userData.password;


    //if email or password not mentioned
    if (!email || !password) {
        return res.send({ message: "Incomplete Credentials" })
    }

    //find user with given email
    let userFound = await User.findOne({ email: email })


    //if there is no user then return
    if (!userFound) {
        return res.send({ message: "No user found" })
    }

    //if user is found then verify the password
    let passwordMatch = await bcryptjs.compare(password, userFound.password)


    //if password incorrect 
    if (!passwordMatch) {
        return res.send({ message: "Invalid password" })
    }


    //credentials are valid ----------> generate token
    const jwtToken = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: "30m" })

    res.send({ message: "Login Success", token: "Bearer " + jwtToken, payload: userFound })



}



const getUserWithId = async (req, res, next) => {


    //fetch id
    const id = req.params.id;
    //find user with given id
    let user = await User.findOne({ _id: id });

    //if user does not exists
    if (!user) {
        res.send({ payload: null })
    }
    //if user exists
    else {
        res.send({ payload: user })
    }


}





const createUser = async (req, res) => {

    //getch user details
    const user = req.body;

    //validate user inputs
    if (!user.name || !user.pass || !user.email) {
        return res.send({ message: "Incomplete user data" })
    }


    //check if email already in use
    let userFromDb = await User.findOne({ email: user.email });
    if (userFromDb !== null) {
        res.status(200).send({ message: "User already exists" })
    }
    //user does not exists so create a user
    else {
        //hash the password
        let hashedPassword = await bcryptjs.hash(user.pass, 5)
        user.password = hashedPassword

        //create a new user
        await User.create(user)
        res.status(200).send({ message: "new user created" })
    }
}





const updateUser = async (req, res, next) => {

    //fetch details
    const user = req.body
    //update details
    await User.updateOne({ _id: user._id }, { $set: { ...user } })


    res.status(200).send({ message: "User Updated" });
}




module.exports = { getEmail, createUser, getUserWithId, updateUser, userLogin };


