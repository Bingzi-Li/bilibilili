// check if the user is logged in and redirect to login page if not so
module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login')
}

// check if the user is logged in and return 400 error code if not so
module.exports.isLoggedInForApi = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}