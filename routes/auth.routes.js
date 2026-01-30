const express = require('express')
const authRouter = express.Router()
const Controller = require('../controllers/controller.js')
const {isLoggedOut, isLoggedIn} = require('../middlewares/auth.middleware.js')

authRouter.get('/sign-up', isLoggedOut, Controller.signUpPage);

authRouter.post('/sign-up', Controller.postSignUp);

authRouter.get('/sign-in', isLoggedOut, Controller.signInPage);

authRouter.post('/sign-in', Controller.postSignIn);

authRouter.get('/sign-out',isLoggedIn, Controller.signOut);

module.exports = authRouter