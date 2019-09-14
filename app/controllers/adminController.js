const path = require('path')
const middleware = require('../utils/middleware')

// export the login controller
module.exports = function(app, passport) {

    // redirect the user to the login page
//    app.get('/admin', middleware.isLoggedIn,
//        function(req, res) {
//            res.render('admin')
//        })
    
    //testing, should add middleware.isLoggedIn
    app.get('/admin', 
        function(req, res) {
            res.render('admin')
        })
    
}