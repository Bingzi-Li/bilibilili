const User = require('../models/user')
const url = require('url')
const bcrypt = require('bcrypt')

// export the login controller
module.exports = function(app, passport) {

    // redirect the user to the login page
    app.get(['/', '/login'], function(req, res) {
        res.render('login')
    })

    // authenticate the user and redirect them to different page based on role
    // if authentication fails, return to the login page
    app.post('/login',
        passport.authenticate('local', {
            failureRedirect: "/login",
            failureFlash: true
        }),
        function(req, res) {

            if (req.user.role == "admin") {
                res.redirect('/admin')
            } else {
                res.redirect('/staff')
            }
        }
    )

    // redirect the user to the change password page
    app.get('/changePassword', function(req, res) {
        res.render('changePassword')
    })

    // get user data via POST request and change the password for the user
    app.post('/changePassword', async function(req, res) {

        // find the user with the same email in MongoDB
        const user = await User.getUserByEmail(req.body.email)

        // if no user is found, return the change password page
        if (user == null) {
            res.render("changePassword", {
                "msg": "No user with this email is found",
                "msgType": "error"
            })
            return
        }


        // check the credentials
        await bcrypt.compare(req.body.oldPassword, user.password, (err, isValid) => {

            if (err) {
                res.render("changePassword", {
                    "msg": "Unknown error occurred",
                    "msgType": "error"
                })
                return
            }

            // if credentials are incorrect, return the change password page
            if (!isValid) {
                res.render("changePassword", {
                    "msg": "Invalid credentials",
                    "msgType": "error"
                })
                return
            }

            // update the user password and return to the login page
            else {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                        user.password = hash;

                        const query = { email: req.body.email }

                        User.findOneAndUpdate(query, user, function(err, doc) {
                            res.render("login", {
                                "msg": "Your password has been changed successfully!",
                                "msgType": "success"
                            })
                            return
                        });
                    });
                });
            }
        })
    })

    app.get('/logout', (req, res) => {
        req.session.destroy(function(err) {
            res.redirect('/login');
        });
    })
}