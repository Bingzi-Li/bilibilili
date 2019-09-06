const User = require('../models/user')

// initialize the default admin user in MongoDB if absent
function initDefaultAdmin() {

    User.find({ email: "admin@ntu.edu.sg" }, function(err, data) {
        if (err) {
            console.log("Error when finding the defaault admin user")
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
}

// export the init function
module.exports.init = initDefaultAdmin