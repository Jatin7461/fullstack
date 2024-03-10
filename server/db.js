// import mongoose and connect to database
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017").then(() => {
    console.log("connection to db successful")
}).catch((err) => {
    console.log(err);
})

//user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    confirmPassword: {
        type: String,
    },
    events: {
        type: Array,
        required: [true, "Events array is required"]
    }

})

//organization schema
const orgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    pass: {
        type: String,
        required: [true, "Password is required"]
    }
})

//event schema
const eventSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required']
    },

    eventName: {
        type: String,
        required: [true, 'Event name is required']
    },
    eventDate: {
        type: String,
        required: [true, 'Event Date is required']
    },
    location: {
        type: String,
        required: [true, 'Event location is required']
    },
    startTime: {
        type: String,
        required: [true, 'Event Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'Event end time is required']
    }

})


//create model for the respective events
const User = mongoose.model('user', userSchema)
const Org = mongoose.model('org', orgSchema);
const Event = mongoose.model('event', eventSchema)

//export the models
module.exports = { Org, User, Event };