const express = require('express');
const app = express()

// const userApp = require('./controller/user-controller')
const userApp = require('./apis/user-api')
const orgApp = require('./apis/org-api')
const eventApp = require('./apis/event-api')
const mongoose = require('mongoose');
app.use(express.json())

const path = require('path')

app.use(express.static(path.join(__dirname, '../angular/dist/angular/browser')))
app.use('/user-api', userApp, () => {
    console.log("user api running")
});

app.use('/org-api', orgApp, () => {
    console.log('org api is running');
})


app.use('/event-api', eventApp, () => {
    console.log("events api is running")
})


function errHandler(err, req, res, next) {
    console.log('err', err)
    res.send({ message: "error occured", payload: err.message })
}

app.use(errHandler)


app.listen(4000, () => {
    console.log("listenting on port", 4000)
})

