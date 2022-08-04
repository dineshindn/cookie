const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { signinHandler, welcomeHandler, refreshHandler, logoutHandler } = require('./handlers')
const cors = require("cors");
var session = require("express-session");

const app = express();
app.use(bodyParser.json());

app.use(cookieParser())


app.use(
  session({
    key: "session_cookie_user_auth",
    secret: "mooncore",
    resave: false,
    saveUninitialized: false,
    cookie: {
      Secure: true,
      maxAge: 1000 * 60 * 60 * 60,
      SameSite: "none",
	httpOnly: true,
      domain: "https://icondemo.fidisys.com",
    },
  })
);


app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Expose-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    " Accept,Accept-Language,Content-Language,Content-Type,Authorization,Set-Cookie,X-Requested-With,Origin,Host"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});


var corsOptions = {
  origin: "https://icondemo.fidisys.com",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
  credentials: true,
};
app.use(cors(corsOptions));


app.get('/setcookie', (req, res) => {
    res.cookie(`Cookie token name`,`encrypted cookie string Value`,{
        maxAge: 5000,
        expires: new Date('01 12 2022'),
        secure: true,
        httpOnly: false,
        sameSite: 'none'
    });
    res.send('Cookie have been saved successfully');
});

app.post('/signin', signinHandler)
app.get('/welcome', welcomeHandler)
app.post('/refresh', refreshHandler)
app.get('/logout', logoutHandler)
console.log("DDDD")
app.listen(3000)