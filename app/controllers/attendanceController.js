const path = require('path')
const middleware = require('../utils/middleware')

// export the attendance controller
module.exports = function(app, passport) {

    // redirect the user to the face recognition page
    app.get('/faceRecognition', middleware.isLoggedIn,
        function(req, res) {
            res.render('faceRecognition')
        })

    // return student image upon request
    app.get('/public/images/*', middleware.isLoggedInForApi,
        function(req, res) {
            res.sendFile(req.url, { root: path.dirname(__dirname) });
        })
}