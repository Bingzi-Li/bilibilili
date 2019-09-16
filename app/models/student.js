var mongoose = require('mongoose')

// define Student schema
var StudentSchema = mongoose.Schema({
    name: {
        type: String
    },
    matricNumber: {
        type: String
    },
    email: {
        type: String
    },
    photoStatus: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'unavailable'
    },
    photo: [String]
})

// create and export the User model
var Student = module.exports = mongoose.model('Student', StudentSchema, 'students');


// add function getUserByEmail to User
module.exports.getStudentByEmail = async function(email) {

    var query = { email: email };

    try {
        return await Student.findOne(query)
    } catch (err) {
        console.log(err)
    }

}