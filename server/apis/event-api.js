
//import express and create event router
const express = require('express')
const eventApp = express.Router();

//import express-async-handler to handle exceptions
const expressAsyncHandler = require('express-async-handler')

//import functions from event controller file
const { getEvents, addEvent, updateEvent, deleteEvent, verify } = require('../controller/event-controller')

//import verify token middleware
const verifyToken = require('../middlewares/verifyToken')

//fetch all events
eventApp.get('/events', verifyToken, expressAsyncHandler(getEvents));

//create a new event
eventApp.post('/events', verifyToken, expressAsyncHandler(addEvent))

//update an event
eventApp.put('/events/:id', verifyToken, expressAsyncHandler(updateEvent))

//delete an event
eventApp.delete('/events/:id', verifyToken, expressAsyncHandler(deleteEvent))


eventApp.post('/verify', expressAsyncHandler(verify))

//export event router
module.exports = eventApp;