const Student = require('../models/student')
const middleware = require('../utils/middleware')
const { check, validationResult } = require('express-validator')
const multer = require("multer");


// export the photo Controller
// Bind with 'cancel' button 
module.exports = function(app, passport){

    // redirect the user to the manage students page
    app.get(['/manageStudents'], middleware.isLoggedIn, function(req, res) {
        res.render('manageStudents')
    })

    // redirect the user to upload photos ?????????????????????????????????????????????????????????

    // get photos via POST request and do uploading for the user
    app.post('/manageStudents', async function(req, res){
        
        // find the student with the studetn id in MongoDB 
        // Add a getStudentByID method !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const student = await Student.getStudentById(req.body.matricNumber)

        // if no studert is found, return manage students page
        if (student == null) {
            res.render("manageStudetns", {
                "msg": "No student with this matric number is found",
                "msgType": "error"
            })
            return
        } 
        else{
            
        }
    })

// 2 app.post ????????????????????????????????????????????????? /photo????????????????
    app.post('/manageStudents/photo', [
        check('photo1').isLength({min: 1}),
        check('photo2').isLength({min: 1}),
        check('photo3').isLength({min: 1})
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // display error message
            res.render("manageStudents", {
                    "msg": "Please upload exactly three photos.",
                    "msgType": "error"
                })
        }
        else{
            //save to DB
        }
    })

}


        