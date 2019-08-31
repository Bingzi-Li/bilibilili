const express = require('express')
const path = require('path')

// instantiate express object
const app = express()

// set template engine to be ejs
app.set('views', __dirname + '/views')
app.set("view engine", "ejs")

// set directory of static resources
app.use(express.static(path.join(__dirname, '/public/images')))
app.use(express.static(path.join(__dirname, '/public/css')))
app.use(express.static(path.join(__dirname, '/public/js')))
app.use(express.static(path.join(__dirname, '/public/weights')))

app.get('/', function(req, res){
    res.render('index')
})

app.get('/public/images/*', function (req, res) {
    res.sendFile( __dirname + "/" + req.url );
    console.log("Request for " + req.url + " received.");
})

app.listen(3000)
console.log("Server listening to port 3000")