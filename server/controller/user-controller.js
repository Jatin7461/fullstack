const exp = require('express');
const userApp = exp.Router();
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


userApp.get('/users', async (req, res, next) => {

    // const usersCollection = req.app.get('usersCollection')

    try {


        let users = await User.find();
        console.log(users)

        res.status(200).send({ message: "users", payload: users })
    }
    catch (err) {
        // next(err)
        next()
    }

})


userApp.get('/users/:userId', async (req, res) => {

    const userId = Number(req.params.userId);
    console.log(typeof (userId))
    // const usersCollection = req.app.get('usersCollection')

    let user = await User.findOne({ userId: userId })

    res.status(200).send({ message: "single user", payload: user })

})


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

// userApp.post('/users', async (req, res) => {

//     // const usersCollection = req.app.get("usersCollection");
//     const user = req.body;
//     console.log(user)
//     if (!user.name || !user.pass || !user.email) {
//         return res.send({ message: "Incomplete user data" })
//     }


//     let userFromDb = await User.findOne({ name: user.name });
//     console.log(userFromDb)
//     if (userFromDb !== null) {
//         res.status(200).send({ message: "User already exists" })
//     }
//     else {

//         let hashedPassword = await bcryptjs.hash(user.pass, 5)
//         user.password = hashedPassword

//         await User.create(user)
//         res.status(200).send({ message: "new user created" })
//     }
// })


userApp.post('/user-login', async (req, res) => {
    let userCred = req.body;

    let user = await User.findOne({ name: userCred.name });
    if (user === null) {
        res.status(404).send({ message: "invalid user" });
    }
    else {
        let result = await bcryptjs.compare(userCred.password, user.password)


        if (!result) {
            res.status(404).send({ message: "Invalid password" })
        }
        else {
            let signedToken = jwt.sign({ name: user.name }, 'abcdefgh', { expiresIn: 30 });
            res.status(200).send({ message: "login successfull", token: signedToken, user: user })
        }

    }
})


userApp.get('/protected', verifyToken, (req, res) => {
    res.send({ message: "access to protected granted" })
})


userApp.put('/users/:id', async (req, res) => {


    const user = req.body
    let dbRes = await User.updateOne({ userId: user.userId }, { $set: { ...user } })

    console.log(dbRes);

    res.status(200).send({ message: "User Updated" });

})


const updateUser = async (req, res, next) => {
    const user = req.body
    let dbRes = await User.updateOne({ userId: user.userId }, { $set: { ...user } })

    // console.log(dbRes);

    res.status(200).send({ message: "User Updated" });
}


userApp.delete('/users/:userId', async (req, res, next) => {

    try {
        let userId = Number(req.params.userId);
        console.log(userId)



        let deleteOp = await User.deleteOne({ userId: userId })
        res.send({ message: "user deleted", payload: deleteOp })
    }
    catch (err) {
        next(err)
    }

})


module.exports = { userApp, getEmail, createUser, getUserWithId, updateUser };



