const User = require('../models/user')

function init() {
    initDefaultAdmin()
}

// check if admin user is initialized
function initDefaultAdmin() {
    User.find({ email: "admin@ntu.edu.sg" }, function(err, data) {
        if (err) {
            console.log("Error when finding the defaault admin user")
        } else {
            if (data.length == 0) {
                User.createUser(new User({
                    email: "admin@ntu.edu.sg",
                    password: "admin123",
                    displayName: "admin"
                }))
            }
        }
    })
}

module.exports.init = init