const session = require('express-session')

const expressSession = session({
    secret: 'iluv-dudut',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
})

module.exports = expressSession