const { Event } = require('../db.js')
const jwt = require('jsonwebtoken')

//fetch all events
const getEvents = async (req, res, next) => {
    
    let events = await Event.find()
    res.send({ message: "got the events", payload: events });
}

//add a new event
const addEvent = async (req, res, next) => {
    let event = req.body;
    console.log('yo')
    await Event.create(event);
    res.send({ message: "Event created" })
}

//update an event
const updateEvent = async (req, res, next) => {
    let newEvent = req.body;
    let eventId = req.params.id;
    let filter = { _id: eventId }


    console.log('new event', newEvent)
    console.log('event id is:', eventId)
    let update = await Event.findOneAndUpdate(filter, newEvent);
    res.send({ message: 'event updated', payload: update })

}

//delete an event
const deleteEvent = async (req, res, next) => {

    let id = req.params.id;
    let filter = { _id: id }
    let deletedEvent = await Event.deleteOne(filter)
    res.send({ message: "Event deleted", payload: deletedEvent })

}



const verify = async (req, res) => {

    console.log(req.body);
    let bearerToken = req.body.token
    const token = bearerToken.split(' ')[1];

    let decodedToken = jwt.verify(token, 'abcdefgh');
    console.log('decoded token is', decodedToken)
    res.send({ message: "token valid" })

}

module.exports = { getEvents, addEvent, updateEvent, deleteEvent, verify };