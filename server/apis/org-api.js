const express = require('express')
const orgApp = express.Router();
const expressAsyncHandler = require('express-async-handler')

const { getOrgs, addOrg } = require('../controller/org-controller')

orgApp.get('/organizations/:email', expressAsyncHandler(getOrgs))

orgApp.post('/organizations', expressAsyncHandler(addOrg))

module.exports = orgApp;