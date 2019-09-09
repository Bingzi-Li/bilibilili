var mongoose = require('mongoose')

// define Student schema
var ActivitySchema = mongoose.Schema({
    name: {
        type: String
    },
    matricNumber: {
        type: String
    },
    email: {
        type: String
    },
    photo: [String]
})

// create and export the User model
var Activity = module.exports = mongoose.model('Activity', ActivitySchema, 'activities');


// add function getUserByEmail to User
module.exports.getStudentByEmail = async function(email) {

    var query = { email: email };

    try {
        return await Student.findOne(query)
    } catch (err) {
        console.log(err)
    }

}