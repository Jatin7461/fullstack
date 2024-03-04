const express = require('express')
const eventApp = express.Router();

const expressAsyncHandler = require('express-async-handler')


const { getEvents, addEvent, updateEvent, deleteEvent, verify } = require('../controller/event-controller')
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






module.exports = eventApp;