const User = require('../models/user')

module.exports = function(app, passport) {
    app.get(['/', '/login'], function(req, res) {
        res.render('login')
    })

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/faceRecognition',
            failureRedirect: "/login",
            failureFlash: true
        }),
        function(req, res) {
            console.log(req)
            res.redirect('/login')
        }
    )
}