const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('../models/user')

function init(passport) {
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

    passport.use(new LocalStrategy({ usernameField: 'email' },
        authenticateUser))

    passport.serializeUser((user, done) => done(null, user.email));

    passport.deserializeUser((email, done) => {
        return done(null, User.getUserByEmail(email))
    });
}

module.exports.init = init