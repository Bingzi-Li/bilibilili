const path = require('path')
const middleware = require('../utils/middleware')
const User = require('../models/user')
const Session = require('../models/session')
const Student = require('../models/student')
const multer = require('multer')
const fs = require('fs')
const csv = require('csvtojson')

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        var dir = __dirname + '/../public/faces/' + req.params.matricNumber

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir)
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + ".jpg");
    }
});

var uploadPhoto = multer({ storage: storage }).array('studentPhoto', 4)

var uploadCSV = multer({
    storage: multer.memoryStorage()
}).single("csvFile")

// export the login controller
module.exports = function(app, passport) {

    // redirect the user to the login page
    app.get('/admin', middleware.isLoggedIn,
        function(req, res) {
            res.render('admin')
        })

    // redirect the user to the manage students page
    app.get('/admin/manageStudents', middleware.isLoggedIn,
        async function(req, res) {
            const studentList = await Student.find({})
            res.render('manageStudents', {
                studentList: studentList
            })
        })

    // redirect the user to the add students page
    app.get('/admin/manageStudents/add', middleware.isLoggedIn,
        function(req, res) {
            res.render('addStudent')
        })

    // add a student
    app.post('/admin/manageStudents/add', middleware.isLoggedIn,
        async function(req, res) {
            const students = await Student.find({
                email: req.body.email,
                matricNumber: req.body.matricNumber
            })

            if (students.length > 0) {
                res.render("addStudent", {
                    "msg": "The student with this email and matricNumber has been created!",
                    "msgType": "error"
                })
                return
            } else {
                const std = new Student({
                    name: req.body.name,
                    matricNumber: req.body.matricNumber,
                    email: req.body.email,
                    photoStatus: "unavailable"
                })

                std.save(function(err) {
                    Student.find({}, function(err, data) {
                        res.render("manageStudents", {
                            msg: "The student was created successfully!",
                            msgType: "success",
                            studentList: data
                        })
                        return
                    })
                })
            }
        })

    // delete a student
    app.delete('/admin/manageStudents/delete/:matricNumber', middleware.isLoggedIn, function(req, res) {

        Student.find({ matricNumber: req.params.matricNumber }).remove(function(err) {
            if (!err) {
                res.status(200)
                res.end()
            }
        });
    })

    // save uploaded photos
    app.post('/manageStudents/uploadPhoto/:matricNumber', middleware.isLoggedIn, function(req, res) {
        uploadPhoto(req, res, function(err) {
            if (err) {
                Student.find({}, function(err, data) {
                    res.render("manageStudents", {
                        msg: "Error occurred when uploading the images",
                        msgType: "error",
                        studentList: data
                    })
                    return
                })
            }

            const query = { matricNumber: req.params.matricNumber }
            const update = { photoStatus: "available" }
            Student.findOneAndUpdate(query, update,
                function(err, data) {
                    Student.find({}, function(err, data) {
                        res.render("manageStudents", {
                            msg: "Photos are uploaded successfully!",
                            msgType: "success",
                            studentList: data
                        })
                        return
                    })
                })
        })
    })


    // redirect the user to the manage sessions page
    app.get('/admin/manageSessions', middleware.isLoggedIn,
        function(req, res) {
            Session.find({}, function(err, data) {
                res.render('manageSessions', {
                    sessionList: data
                })
            })
        })

    // redirect the user to the manage sessions page
    app.get('/admin/manageSessions/add', middleware.isLoggedIn,
        function(req, res) {
            User.find({ role: "user" }, function(err, data) {
                res.render('addSession', {
                    staffList: data
                })
            })
        })

    // add a session
    app.post('/admin/manageSessions/add', middleware.isLoggedIn,
        async function(req, res) {

            const sess = await Session.find({ sessionName: req.body.sessionName })

            if (sess.length > 0) {
                const staffList = await User.find({ role: "user" })
                res.render("addSession", {
                    msg: "The session with the same name was already created!",
                    msgType: "error",
                    staffList: staffList
                })
                return
            }

            User.find({ email: req.body.email }, function(err, data) {
                const sess = new Session({
                    sessionName: req.body.sessionName,
                    staffInCharge: data[0].displayName,
                    staffEmail: req.body.email,
                    numOfSessions: req.body.numOfSessions
                })

                sess.save(function(err) {
                    Session.find({}, function(err, data) {
                        res.render("manageSessions", {
                            msg: "The session was created successfully!",
                            msgType: "success",
                            sessionList: data
                        })
                        return
                    })
                })
            })
        })

    // delete a session
    app.delete('/admin/manageSessions/delete/:sessionName', middleware.isLoggedIn, function(req, res) {

        const sessionName = req.params.sessionName.replace("*", " ")

        Session.find({ sessionName: sessionName }).remove(function(err) {
            if (!err) {
                res.status(200)
                res.end()
            }
        });
    })

    // redirect the user to the manage staff page
    app.get('/admin/manageSessions/assignStudent', middleware.isLoggedIn,
        function(req, res) {
            Session.find({}, function(err, data) {
                res.render('assignStudent', {
                    sessionList: data
                })
            })

        }
    )

    // assign students
    app.post('/admin/manageSessions/assignStudent/', middleware.isLoggedIn,
        uploadCSV,
        function(req, res) {
            csv({
                    noheader: false,
                    output: "csv"
                })
                .fromString(req.file.buffer.toString())
                .then((csvRow) => {
                    Session.findOne({ sessionName: req.body.sessionChoice },
                        async function(err, session) {
                            const emails_to_add = [].concat.apply([], csvRow);

                            for (var i = 0; i < session.record.length; i++) {
                                if (!emails_to_add.includes(session.record[i].email)) {
                                    await session.record.splice(i)
                                    i--
                                } else {
                                    await emails_to_add.splice(emails_to_add.indexOf(session.record[i].email))
                                }
                            }

                            for (var i = 0; i < emails_to_add.length; i++) {
                                await Student.findOne({ email: emails_to_add[i] },
                                    async function(err, data) {
                                        if (data) {
                                            var att = [];

                                            for (var i = 0; i < session.numOfSessions; i++) {
                                                await att.push("pending");
                                            }
                                            session.record.push({
                                                name: data.name,
                                                matricNumber: data.matricNumber,
                                                attendance: att
                                            })
                                        }

                                    })
                            }

                            Session.findOneAndUpdate({ sessionName: session.sessionName }, session, function(err, doc) {
                                Session.find({}, function(err, data) {
                                    res.render('manageSessions', {
                                        sessionList: data,
                                        "msg": "Student assigned successfully!",
                                        "msgType": "success"
                                    })
                                })
                            });


                        })
                })
        })


    // redirect the user to the manage staff page
    app.get('/admin/manageStaff', middleware.isLoggedIn,
        function(req, res) {

            User.find({ role: "user" }, function(err, data) {
                res.render('manageStaff', {
                    users: data
                })
            })
        })

    // redirect the user to the manage staff page
    app.get('/admin/manageStaff/add', middleware.isLoggedIn,
        async function(req, res) {
            res.render('addStaff')
        })

    // create a new user
    app.post('/admin/manageStaff/add', middleware.isLoggedIn,
        async function(req, res) {
            const staff = await User.getUserByEmail(req.body.email)
            if (staff != null) {
                res.render("addStaff", {
                    "msg": "The user with this email has been created!",
                    "msgType": "error"
                })
                return
            } else {
                User.createUser(new User({
                    email: req.body.email,
                    password: "ntuniubi",
                    displayName: req.body.displayName,
                    role: 'user'
                }), function(err, doc) {

                    User.find({ role: "user" }, function(err, data) {
                        res.render('manageStaff', {
                            "users": data,
                            "msg": "New staff account has been created.",
                            "msgType": "success"
                        })
                    })
                    return
                });
            }

        })

    // delete a user
    app.delete('/admin/manageStaff/delete/:email', middleware.isLoggedIn, function(req, res) {
        User.find({ email: req.params.email }).remove(function(err) {
            if (!err) {
                res.end()
            }
        });
    })
}