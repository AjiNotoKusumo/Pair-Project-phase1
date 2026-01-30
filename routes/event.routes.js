const express = require('express')
const eventRouter = express.Router()
const Controller = require('../controllers/controller.js')
const {isLoggedIn, isUser, isEventOrganizer} = require('../middlewares/auth.middleware.js')


eventRouter.get('/', Controller.showEvents)
eventRouter.get('/create', isLoggedIn, isEventOrganizer, Controller.createEventForm)
eventRouter.post('/create', isLoggedIn, isEventOrganizer, Controller.createEvent)
eventRouter.get('/:eventId', Controller.showEventDetail)
eventRouter.get('/:eventId/reservation', isLoggedIn, isUser, Controller.createReservation)
eventRouter.get('/:eventId/cancelation', isLoggedIn, isUser, Controller.cancelReservation)
eventRouter.get('/:eventId/edit', isLoggedIn, isEventOrganizer, Controller.editEventForm)
eventRouter.post('/:eventId/edit', isLoggedIn, isEventOrganizer, Controller.editEvent)
eventRouter.get('/:eventId/delete', isLoggedIn, isEventOrganizer, Controller.deleteEvent)


module.exports = eventRouter