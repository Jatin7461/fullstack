const express = require('express')
const orgApp = express.Router();
const expressAsyncHandler = require('express-async-handler')

const { getOrgs, addOrg, loginOrg } = require('../controller/org-controller')

orgApp.get('/organizations/:email', expressAsyncHandler(getOrgs))

orgApp.post('/organizations', expressAsyncHandler(addOrg))

orgApp.post('/login',expressAsyncHandler(loginOrg))

module.exports = orgApp;