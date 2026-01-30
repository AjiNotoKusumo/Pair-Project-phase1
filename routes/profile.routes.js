const express = require('express')
const profileRouter = express.Router()
const Controller = require('../controllers/controller.js')
const {isLoggedIn, isUser, isEventOrganizer} = require('../middlewares/auth.middleware.js')


profileRouter.get('/', isLoggedIn, Controller.showProfile)
profileRouter.post('/update', Controller.updateProfile)
profileRouter.get('/events', isLoggedIn, isUser, Controller.showProfileEvent)
profileRouter.get('/events/event-organizer', Controller.showCreatedEvent)


module.exports = profileRouter
