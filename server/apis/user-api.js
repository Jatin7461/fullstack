const express = require('express')
const userApp = express.Router();
const expressAsyncHandler = require('express-async-handler')

const { getEmail, createUser, getUserWithId, updateUser, userLogin } = require('../controller/user-controller');
const verifyToken = require('../middlewares/verifyToken');


//get user with email
userApp.get('/users', expressAsyncHandler(getEmail))

//user login
userApp.post('/login', expressAsyncHandler(userLogin))

// userApp.get('/users',)

//create new user
userApp.post('/users', expressAsyncHandler(createUser))

//get user with id
userApp.get('/users/:id', verifyToken, expressAsyncHandler(getUserWithId))


userApp.put('/users/:id', verifyToken, expressAsyncHandler(updateUser))

module.exports = userApp;