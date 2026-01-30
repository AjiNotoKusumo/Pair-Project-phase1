const express = require('express')
const router = require('./routes/index.routes.js')
const app = express()
const expressSession = require('./config/expressSession.js')
const { setLocalUsers } = require('./middlewares/auth.middleware.js')
const port = 3000

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use(expressSession)
app.use(setLocalUsers)

app.use(router)

app.listen(port, () => {
    console.log(`Website is running on port ${port}`);
})