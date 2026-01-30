const express = require('express')
const router = express.Router()
const authRouter = require('./auth.routes.js')
const eventRouter = require('./event.routes.js')
const profileRouter = require('./profile.routes.js')
const Controller = require('../controllers/controller.js')

router.get('/', Controller.homePage)
router.use('/auth', authRouter)
router.use('/events', eventRouter)
router.use('/profile', profileRouter)

module.exports = router