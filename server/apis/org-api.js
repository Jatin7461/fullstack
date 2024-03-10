
//import express and create a router
const express = require('express')
const orgApp = express.Router();

//import express-async-handler to handle exceptions
const expressAsyncHandler = require('express-async-handler')

//import functions from respective controller file
const { getOrgs, addOrg, loginOrg } = require('../controller/org-controller')


//find organization with given email
orgApp.get('/organizations/:email', expressAsyncHandler(getOrgs))

//add a new organization
orgApp.post('/organizations', expressAsyncHandler(addOrg))

//when organization logs in
orgApp.post('/login', expressAsyncHandler(loginOrg))

//export the router
module.exports = orgApp;