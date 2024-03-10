
//import express and create a router
const express = require('express')
const userApp = express.Router();

//import express-async-handler to handle exceptions
const expressAsyncHandler = require('express-async-handler')

//import functions from controller files
const { getEmail, createUser, getUserWithId, updateUser, userLogin } = require('../controller/user-controller');

//import verify token middleware 
const verifyToken = require('../middlewares/verifyToken');


//get user with email
userApp.get('/users', expressAsyncHandler(getEmail))

//user login
userApp.post('/login', expressAsyncHandler(userLogin))

//create new user
userApp.post('/users', expressAsyncHandler(createUser))

//get user with id
userApp.get('/users/:id', verifyToken, expressAsyncHandler(getUserWithId))

//update user with given id
userApp.put('/users/:id', verifyToken, expressAsyncHandler(updateUser))

//export the router
module.exports = userApp;