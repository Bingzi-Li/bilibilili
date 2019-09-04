var mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// User schema
var UserSchema = mongoose.Schema({
    id: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    displayName: {
        type: String
    }
})

var User = module.exports = mongoose.model('User', UserSchema, 'users');

module.exports.getUserByEmail = async function(email) {
    var query = { email: email };

    try {
        return await User.findOne(query)
    } catch (err) {
        console.log(err)
    }

}

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserById = function(id) {
    var query = { id: id };
    User.findOne(query, function(err, data) {
        if (err) {
            return null
        } else {
            return data
        }
    })
}