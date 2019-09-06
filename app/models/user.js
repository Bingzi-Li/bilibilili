var mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// define User schema
var UserSchema = mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    displayName: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user']
    }
})

// create and export the User model
var User = module.exports = mongoose.model('User', UserSchema, 'users');


// add function getUserByEmail to User
module.exports.getUserByEmail = async function(email) {

    var query = { email: email };

    try {
        return await User.findOne(query)
    } catch (err) {
        console.log(err)
    }

}

// add function createUser to User
module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}