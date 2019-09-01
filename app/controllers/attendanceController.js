const path = require('path')
const middleware = require('../utils/middleware')

module.exports = function(app, passport) {
    app.get('/faceRecognition', middleware.isLoggedIn,
        function(req, res) {
            res.render('faceRecognition')
        })

    app.get('/public/images/*', middleware.isLoggedInForApi,
        function(req, res) {
            res.sendFile(req.url, { root: path.dirname(__dirname) });
        })
}