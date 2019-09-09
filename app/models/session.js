var mongoose = require('mongoose')

// define Student schema
var SessionSchema = mongoose.Schema({
    session: {
        type: String
    },
    staffInCharge: {
        type: String
    },
    staffEmail: {
        type: String
    },
    numOfSessions: {
        type: String
    },
    record: [{
        matricNum: String,
        attendace: [String]
    }]
})

// create and export the User model
var Session = module.exports = mongoose.model('Session', SessionSchema, 'sessions');