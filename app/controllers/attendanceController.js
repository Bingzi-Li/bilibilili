const path = require('path')
const middleware = require('../utils/middleware')
const Session = require('../models/session')
const Student = require('../models/student')
const fs = require('fs')
const Json2CsvParser = require('json2csv').Parser

// export the attendance controller
module.exports = function(app, passport) {

    // redirect the staff user to home page of attendance management
    app.get('/staff', middleware.isLoggedIn,
        function(req, res) {
            req.user.then(function(user) {
                Session.find({ staffEmail: user.email }, function(err, data) {
                    res.render('staff', {
                        sessionList: data,
                        user: user
                    })
                })
            })
        })

    // redirect the staff user to the manage student attendance page
    app.get('/staff/:email/:sessionName', middleware.isLoggedIn,
        function(req, res) {
            req.user.then(async function(user) {
                const sessionList = await Session.find({ staffEmail: user.email })
                const session = await Session.findOne({ sessionName: req.params.sessionName, staffEmail: user.email })
                res.render('manageAttendance', {
                    sessionList: sessionList,
                    user: user,
                    session: session
                })
            })
        })

    // redirecdt the staff the face-recognition attendance taking page
    app.post('/staff/:email/:sessionName/takeAttendance', middleware.isLoggedIn,
        function(req, res) {
            req.user.then(async function(user) {
                res.render("takeAttendance", {
                    currentUserEmail: user.email,
                    sessionName: req.params.sessionName,
                    sessionChoice: req.body.sessionChoice
                })
            })
        })


    // edit attendance status
    app.post('/staff/:email/:sessionName/editAttendance', middleware.isLoggedIn,
        function(req, res) {
            Session.findOne({ staffEmail: req.params.email, sessionName: req.params.sessionName }, async function(err, session) {
                    if (session.record) {
                        for (var i = 0; i < session.record.length; i++) {
                            if (session.record[i].matricNumber == req.body.matricNumber) {
                                session.record[i].attendance[req.body.attendanceSession - 1] = req.body.statusChoice
                                break
                            }
                        }
                    }

                    Session.findOneAndUpdate({ staffEmail: req.params.email, sessionName: req.params.sessionName }, session, function(err, data) {
                        res.redirect('/staff/' + req.params.email + '/' + req.params.sessionName)
                    })
                }

            )
        })

    // return student photo path upon requst
    app.get('/staff/:staffEmail/:sessionName/getStudentPhotoPaths', middleware.isLoggedInForApi,
        function(req, res) {
            Session.findOne({ sessionName: req.params.sessionName, staffEmail: req.params.staffEmail },
                async function(err, session) {
                    const studentPhotoPath = []
                    if (session.record) {
                        for (var i = 0; i < session.record.length; i++) {

                            await fs.readdirSync(__dirname + '/../public/faces/' + session.record[i].matricNumber).forEach(file => {
                                if (file.includes('.jpg')) {
                                    studentPhotoPath.push([session.record[i].name, session.record[i].matricNumber, file])
                                }

                            });
                        }
                        res.send(studentPhotoPath)
                        res.status(200)
                        res.end()
                    } else {
                        res.status(404)
                        res.end()
                    }
                })
        })

    // return student image upon request
    app.get('/public/faces/:matricNumber/:fileName', middleware.isLoggedInForApi,
        function(req, res) {
            res.sendFile(req.url, { root: path.dirname(__dirname) });
        })

    // record student attendance
    app.post('/staff/:staffEmail/:sessionName/takeAttendance/:sessionChoice/:matric', middleware.isLoggedIn,
        function(req, res) {

            Session.findOne({ sessionName: req.params.sessionName, staffEmail: req.params.staffEmail }, function(err, session) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                    res.end()
                } else {
                    for (var i = 0; i < session.record.length; i++) {
                        if (session.record[i].matricNumber == req.params.matric) {
                            session.record[i].attendance[req.params.sessionChoice - 1] = "present"
                            break
                        }
                    }

                    Session.findOneAndUpdate({ sessionName: req.params.sessionName, staffEmail: req.params.staffEmail }, session, function(err, data) {
                        if (err) {
                            res.sendStatus(500)
                            res.end()
                        } else {
                            res.sendStatus(200)
                            res.end()
                        }
                    })

                }
            })
        })

    // export attendance list csv
    app.get('/staff/:staffEmail/:sessionName/:fileName', middleware.isLoggedIn,
        function(req, res) {
            Session.findOne({ staffEmail: req.params.staffEmail, sessionName: req.params.sessionName },
                function(err, session) {

                    var fields = ["name", "matric number"]
                    var rows = []

                    for (var i = 0; i < session.record[0].attendance.length; i++) {
                        fields.push((i + 1).toString())
                    }

                    for (var j = 0; j < session.record.length; j++) {
                        row = {}
                        row["name"] = session.record[j].name
                        row["matric number"] = session.record[j].matricNumber
                        for (var k = 0; k < session.record[j].attendance.length; k++) {
                            row[(k + 1).toString()] = session.record[j].attendance[k]
                        }
                        rows.push(row)
                    }

                    const json2csvParser = new Json2CsvParser({ fields });
                    const result = json2csvParser.parse(rows);
                    var dir = __dirname + '/../public/attendanceList/' + req.params.fileName
                    fs.writeFile(dir, [result], "utf8", function(err) {
                        if (err) {

                            res.write("Error occurred")
                            res.end()
                        } else {
                            res.download(dir, req.params.fileName)
                        }
                    });

                })
        })

}