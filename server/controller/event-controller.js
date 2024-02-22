const { Event } = require('../db.js')


//fetch all events
const getEvents = async (req, res, next) => {
    let events = await Event.find()
    res.send({ message: "got the events", payload: events });
}

//add a new event
const addEvent = async (req, res, next) => {
    let event = req.body;
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


module.exports = { getEvents, addEvent, updateEvent, deleteEvent };