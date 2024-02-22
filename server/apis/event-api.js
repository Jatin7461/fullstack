const express = require('express')
const eventApp = express.Router();

const expressAsyncHandler = require('express-async-handler')


const { getEvents, addEvent, updateEvent,deleteEvent } = require('../controller/event-controller')


//fetch all events
eventApp.get('/events', expressAsyncHandler(getEvents));

//create a new event
eventApp.post('/events', expressAsyncHandler(addEvent))

//update an event
eventApp.put('/events/:id', expressAsyncHandler(updateEvent))

//delete an event
eventApp.delete('/events/:id',expressAsyncHandler(deleteEvent))







module.exports = eventApp;