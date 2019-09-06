const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('../models/user')

/**
 * Initialize the Passport instance
 * @param {*} passport the Passport instance
 */
function init(passport) {

    // define how to authenticate the user
    const authenticateUser = async(email, password, done) => {
        const user = await User.getUserByEmail(email)
        if (user == null) {
            return done(null, false, {
                message: "No user with this email is found"
            })
        }

        await bcrypt.compare(password, user.password, (err, isValid) => {
            if (err) {
                return done(err)
            }
            if (!isValid) {
                return done(null, false, {
                    message: 'Invalid credentials'
                })
            }
            return done(null, user)
        })
    }

    // initialize the authentication strategy
    passport.use(new LocalStrategy({ usernameField: 'email' },
        authenticateUser))

    // implemente the serialization function
    passport.serializeUser((user, done) => done(null, user.email));

    // implemente the de-serialization function
    passport.deserializeUser((email, done) => {
        return done(null, User.getUserByEmail(email))
    });
}

// export the init funcdtion
module.exports.init = init