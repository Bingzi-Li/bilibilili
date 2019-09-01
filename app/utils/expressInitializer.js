const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const favicon = require('serve-favicon')

function init(app, passport) {

    // set template engine to be ejs
    app.set('views', __dirname + '/../views')
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
    app.use(favicon(path.join(__dirname, '/../public/assets/face-recognition.jpg')))
}

module.exports.init = init