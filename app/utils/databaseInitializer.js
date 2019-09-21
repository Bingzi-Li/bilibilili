const User = require('../models/user')

/**
 * initialize the default data in MongoDB if absent
 */
function init() {

    // initialize default admin user
    User.find({ role: "admin" }, function(err, data) {
        if (err) {
            console.log("Error when finding the default admin user")
        } else {

            // create the default admin user
            if (data.length == 0) {
                User.createUser(new User({
                    email: "admin@ntu.edu.sg",
                    password: "admin123",
                    displayName: "Admin",
                    role: "admin"
                }))
            }
        }
    })

    // initialize default university staff
    User.find({ role: "user" }, function(err, data) {
        if (err) {
            console.log("Error when finding the user")
        } else {

            // create the default user
            if (data.length == 0) {
                User.createUser(new User({
                    email: "frank@ntu.edu.sg",
                    password: "ntuniubi",
                    displayName: "Frank Lee",
                    role: "user"
                }))
            }
        }
    })
}




// export the init function
module.exports.init = init