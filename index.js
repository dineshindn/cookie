const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { signinHandler, welcomeHandler, refreshHandler, logoutHandler } = require('./handlers')
const cors = require("cors");

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

var corsOptions = {
    // origin: "http://localhost:4200"
};
app.use(cors(corsOptions));

app.post('/signin', signinHandler)
app.get('/welcome', welcomeHandler)
app.post('/refresh', refreshHandler)
app.get('/logout', logoutHandler)
console.log("DDDD")
app.listen(8080)