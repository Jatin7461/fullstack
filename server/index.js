//import express
const express = require('express');
const app = express()

//import path module
const path = require('path')

//import routers from api files
const userApp = require('./apis/user-api')
const orgApp = require('./apis/org-api')
const eventApp = require('./apis/event-api')

//parses requests with json payloads
app.use(express.json())

/*

express.static -> build in middleware, it servers static files

path.join -> joins the path segments into one path

express.static(root) -> here root is path.join(...), root specifies the directory from which static assests are served

*/
app.use(express.static(path.join(__dirname, '../angular/dist/angular/browser')))


//routes the request to the respective middlewares
app.use('/user-api', userApp);

app.use('/org-api', orgApp)

app.use('/event-api', eventApp)

//error handling middleware
function errHandler(err, req, res, next) {
    res.send({ message: "error occured", payload: err.message })
}

//add the error handling middleware
app.use(errHandler)


app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../angular/dist/angular/browser/index.html'))
})


//binds and listens the app to the specific port
app.listen(4000, () => {
    console.log("listenting on port", 4000)
})

