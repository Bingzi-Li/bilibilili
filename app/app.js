const databaseInitializer = require('./utils/databaseInitializer')
const passportInitializer = require('./utils/passportInitializer')
const expressInitializer = require('./utils/expressInitializer')


const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const attendanceController = require('./controllers/attendanceController')
const loginController = require('./controllers/loginController')

// connect to MongoDB
mongoose.connect("mongodb://localhost/bilibilili", { useNewUrlParser: true }, (err, res) => {
    if (!err) {
        console.log("Successfully connected to MongoDB")
    } else {
        console.log("Failed to connect to MongoDB")
    }
})

// instantiate express object
const app = express()

// initialize everything
databaseInitializer.init()
passportInitializer.init(passport)
expressInitializer.init(app, passport)

// set up controllers
attendanceController(app, passport)
loginController(app, passport)


// host the server
app.listen(3000)
console.log("Server listening to port 3000")