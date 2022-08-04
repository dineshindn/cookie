const uuid = require('uuid')

const users = {
    "user1": "password1",
    "user2": "password2"
}

class Session {
    constructor(username, expiresAt) {
        this.username = username
        this.expiresAt = expiresAt
    }

    isExpired() {
        this.expiresAt < (new Date())
    }
}

const sessions = {}

const signinHandler = (req, res) => {
    // get users credentials from the JSON body
    const { username, password } = req.body

    console.log(req.body, "req.body")
    if (!username) {
        res.status(401).end()
        return
    }

    const expectedPassword = users[username]
    if (!expectedPassword || expectedPassword !== password) {
        res.status(401).end()
        return
    }

    const sessionToken = uuid.v4()

    const now = new Date()
    const expiresAt = new Date(now + 120 * 9000)
    var date = new Date();

// add a day
    var ddd = date.setDate(date.getDate() + 1);
    var expiresx = new Date(Date.now()+ 86400*1000);

console.log(expiresx, "expiresx", expiresAt)


    const session = new Session(username, expiresAt)
    sessions[sessionToken] = session
    console.log("lkklk")
    res.cookie("session_token", sessionToken, { expires: expiresx , secure: true, httpOnly: true, sameSite: 'none' ,});
    console.log("---------p")
    res.send({status:true, msg:"success"});
    res.end()
}

const welcomeHandler = (req, res) => {
    if (!req.cookies) {
        res.status(401).end()
        return
    }
    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        res.status(401).end()
        return
    }

    userSession = sessions[sessionToken]
    if (!userSession) {
        res.status(401).end()
        return
    }
    // session from our map
    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        res.status(401).end()
        return
    }

    res.send(`Welcome  ${userSession.username}!`).end()
    res.send({status:true, msg:"success"});
}

const refreshHandler = (req, res) => {
    if (!req.cookies) {
        res.status(401).end()
        return
    }

    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        res.status(401).end()
        return
    }

    userSession = sessions[sessionToken]
    if (!userSession) {
        res.status(401).end()
        return
    }
    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        res.status(401).end()
        return
    }

    const newSessionToken = uuid.v4()

    const now = new Date()
    const expiresAt = new Date(+now + 120 * 1000)
    const session = new Session(userSession.username, expiresAt)

    sessions[newSessionToken] = session
    delete sessions[sessionToken]

    res.cookie("session_token", newSessionToken, { expires: expiresAt })

    res.send({status:true, msg:"success"});
    res.end()
}

const logoutHandler = (req, res) => {
    if (!req.cookies) {
        res.status(401).end()
        return
    }

    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        res.status(401).end()
        return
    }

    delete sessions[sessionToken]

    res.cookie("session_token", "", { expires: new Date() })

    res.send({status:true, msg:"success"});
    res.end()
}

module.exports = {
    signinHandler,
    welcomeHandler,
    refreshHandler,
    logoutHandler
}