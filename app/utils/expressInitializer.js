const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const favicon = require('serve-favicon')

/**
 * Initialize the configurations of Express and Passport instances
 * @param {*} app the Express instance
 * @param {*} passport the Passport instance
 */
function init(app, passport) {

    // set the directory to views
    app.set('views', __dirname + '/../views')

    // set template engine to be ejs
    app.set("view engine", "ejs")

    // set middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(flash())

    // Initialize passport
    app.use(session({
        secret: 'mySecret',
        saveUninitialized: false,
        resave: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // set directory of static resources
    app.use(express.static(path.join(__dirname, '/../public/images')))
    app.use(express.static(path.join(__dirname, '/../public/assets')))
    app.use(express.static(path.join(__dirname, '/../public/css')))
    app.use(express.static(path.join(__dirname, '/../public/js')))
    app.use(express.static(path.join(__dirname, '/../public/weights')))
    app.use(favicon(path.join(__dirname, '/../public/assets/logo.png')))
}

// export the init function
module.exports.init = init