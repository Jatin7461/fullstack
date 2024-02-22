const express = require('express')
const userApp = express.Router();
const expressAsyncHandler = require('express-async-handler')

const { getEmail, createUser, getUserWithId, updateUser } = require('../controller/user-controller')


//get user with email
userApp.get('/users', expressAsyncHandler(getEmail))


// userApp.get('/users',)

//create new user
userApp.post('/users', expressAsyncHandler(createUser))

//get user with id
userApp.get('/users/:id', expressAsyncHandler(getUserWithId))


userApp.put('/users/:id', expressAsyncHandler(updateUser))

module.exports = userApp;