//import event model
const { Event } = require('../db.js')

//import json web token to create/decode token
const jwt = require('jsonwebtoken')

//fetch all events
const getEvents = async (req, res, next) => {
    let events = await Event.find()
    res.send({ message: "got the events", payload: events });
}

//add a new event
const addEvent = async (req, res, next) => {
    //get the event from request body and insert using Model.create() function
    let event = req.body;
    await Event.create(event);
    //send the response
    res.send({ message: "Event created" })
}

//update an event
const updateEvent = async (req, res, next) => {

    //get the event and event id from request body and reqest params respectively
    let newEvent = req.body;
    let eventId = req.params.id;

    //create a filter for findOneAndUpdate method
    let filter = { _id: eventId }


    let update = await Event.findOneAndUpdate(filter, newEvent);

    //send the response
    res.send({ message: 'event updated', payload: update })

}

//delete an event
const deleteEvent = async (req, res, next) => {
    //get the event id from request params
    let id = req.params.id;

    //create filter for deleteOne method
    let filter = { _id: id }

    //delete the event
    let deletedEvent = await Event.deleteOne(filter)

    //send the response
    res.send({ message: "Event deleted", payload: deletedEvent })

}



const verify = async (req, res) => {

//fetch token
    let bearerToken = req.body.token
    const token = bearerToken.split(' ')[1];

    //verify token
    let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    res.send({ message: "token valid" })

}


//export all the functions
module.exports = { getEvents, addEvent, updateEvent, deleteEvent, verify };