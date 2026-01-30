const { Op, Sequelize } = require('sequelize');
const {Category, Event, Profile, Reservation, User, sequelize} = require('../models/index.js')
const bcrypt = require('bcryptjs')

class Controller {
    static async homePage(req, res) {
        try {
            const eventsData = await Event.findAll({
                where: {
                    eventDate: {
                        [Op.gte]: new Date()
                    }
                },
                order: [['eventDate', 'ASC']],
                limit: 4
            })

            const categoriesData = await Category.findAll({
                attribute: ['id', 'name'],
                order: [['id', 'ASC']],
                limit: 4
            })

            res.render('homePage.ejs', {eventsData, categoriesData})
        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }

    static async signInPage(req, res) {
        try {
            let errors = ''
            if(req.query.errorMessages){
                errors = req.query.errorMessages
            }

            res.render('signInPage.ejs', {errors})
        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }

    static async postSignIn(req, res) {
        try {
            const {email, password} = req.body

            const user = await User.findOne({
                include: {
                    model: Profile,
                    attribute: ['fullName', 'avatarUrl']
                },
                where: {
                    email
                }
            })

            if(!user) {
                throw {
                    name: 'authError',
                    message: 'Invalid email'
                }
            }

            const isValidPassword = bcrypt.compareSync(password, user.password)

            if(!isValidPassword) {
                throw {
                    name: 'authError',
                    message: 'Incorrect Password'
                }
            }

            req.session.user = {
                id: user.id,
                role: user.role,
                fullName: user.Profile.fullName,
                avatarUrl : user.Profile.avatarUrl
            }

            res.redirect('/')
        } catch (error) {
            if(error.name === 'authError') {
                res.redirect(`/auth/sign-in?errorMessages=${error.message}`)
            } else {
                res.send(error)
                console.log(error);
                
            }
        }
    }

    static async signUpPage(req, res) {
        try {
            let errorsArray = []
            if(req.query.errorMessages){
                errorsArray = req.query.errorMessages.split(',')
            }

            res.render('signUpPage.ejs', {errorsArray})
        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }

    static async postSignUp(req, res) {
        try {
            const {fullName, email, role, password} = req.body

            await User.create({
                email, 
                role, 
                password,
                Profile: {
                    fullName
                } 
            }, {
                include: [Profile],
                validate: true
            })

            res.redirect('/auth/sign-in')
        } catch(error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let messages = error.errors.map(error => error.message)

                res.redirect(`/auth/sign-up?errorMessages=${messages.join(',')}`)
            } else {
                res.send(error)
                console.log(error);
            }
        }
    }

    static signOut(req, res) {
        req.session.destroy((error) => {
            if(error) {
                res.send(error)
            } else {
                res.redirect('/')
            }
        })
    }

    static async showEvents(req, res) {
        try {
            const {search, sort, CategoryId, startDate, endDate} = req.query

            const eventsData = await Event.showEvents(search, sort, CategoryId, startDate, endDate)

            const categoriesData = await Category.findAll({
                attribute: ['id', 'name']
            })

            res.render('exploreEvent.ejs', {eventsData, categoriesData, search, CategoryId, startDate, endDate})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async showEventDetail(req, res) {
        try {
            const eventData = await Event.findOne({
                attributes: ['id', 'title', 'eventDate', 'location', 'imageUrl', 'capacity', 'OrganizerId', 'description', [Sequelize.fn('COUNT', Sequelize.col('Users.id')), 'attendeesCount']],
                include: [
                    {
                        model: User,
                        attributes: [],
                        through: {
                            model: Reservation, 
                            attributes: [],
                            where: {
                                status: 'Reserved'
                            } 
                        } 
                    },
                    {
                        model: Category,
                        attributes: ['name']
                    }
                ],
                where: {
                    id: req.params.eventId 
                },
                group: ['Event.id', 'Category.id'],
            })

            const organizerName = await Profile.findOne({
                attributes: ['fullName'],
                where: {
                    id: eventData.OrganizerId
                }
            })

            let reservationData

            if(req.session.user){
                reservationData = await Reservation.findOne({
                    attributes: ['status'],
                    where: {
                        UserId: req.session.user.id,
                        EventId: req.params.eventId 
                    }
                })
            }
            
            
            res.render('eventDetail.ejs', {eventData, organizerName, reservationData})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async createReservation(req, res) {
        try {
            let reservationData

            if(req.session.user){
                reservationData = await Reservation.findOne({
                    attributes: ['status'],
                    where: {
                        UserId: req.session.user.id,
                        EventId: req.params.eventId 
                    }
                })
            }

            if(reservationData && reservationData.status === 'Canceled') {
                await Reservation.update(
                    {status: 'Reserved'},
                    {
                        where: {
                            UserId: req.session.user.id,
                            EventId: req.params.eventId
                        }
                    }
                )
            } else {
                await Reservation.create({UserId: req.session.user.id, EventId: req.params.eventId})
            }

            res.redirect(`/events/${req.params.eventId}`)
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async cancelReservation(req, res){
        try {
            await Reservation.update(
                {status: 'Canceled'},
                {
                    where: {
                        UserId: req.session.user.id,
                        EventId: req.params.eventId
                    }
                }
            )

            const previousPage = req.get('Referer') || '/'

            res.redirect(previousPage)
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async createEventForm(req, res) {
        try {
            let errorsArray = []
            if(req.query.errorMessages){
                errorsArray = req.query.errorMessages.split(',')
            }

            const categoriesData = await Category.findAll({
                attribute: ['id', 'name']
            })

            res.render('createEvent.ejs', {categoriesData, errorsArray})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async createEvent(req, res) {
        try {
            const {title, location, capacity, CategoryId, eventDate, description, imageUrl} = req.body

            await Event.create({
                title, 
                location, 
                capacity, 
                CategoryId, 
                eventDate, 
                description,
                imageUrl,
                OrganizerId: req.session.user.id
            })

            res.redirect('/profile/events/event-organizer')
        } catch (error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let messages = error.errors.map(error => error.message)

                res.redirect(`/events/create?errorMessages=${messages.join(',')}`)
            } else {
                res.send(error)
                console.log(error);
            } 
        }
    }

    static async editEventForm(req, res) {
        try {
            let errorsArray = []
            if(req.query.errorMessages){
                errorsArray = req.query.errorMessages.split(',')
            }

            const eventData = await Event.findOne({
                where: {
                    OrganizerId: req.session.user.id,
                    id: req.params.eventId
                }
            })

            if(!eventData){
                res.redirect('/')
            }

            const categoriesData = await Category.findAll({
                attribute: ['id', 'name']
            })

            res.render('editEvent.ejs', {categoriesData, errorsArray, eventData})
        } catch (error) {
            res.send(error)
            console.log(error); 
        }
    }

    static async editEvent(req, res) {
        try {
            const {title, location, capacity, CategoryId, eventDate, description, imageUrl} = req.body

            await Event.update(
                {title, location, capacity, CategoryId, eventDate, description, imageUrl},
                {
                    where: {
                        OrganizerId: req.session.user.id,
                        id: req.params.eventId
                    }
                }
            )

            res.redirect('/profile/myEvents')
        } catch (error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let messages = error.errors.map(error => error.message)

                res.redirect(`/events/${req.params.eventId}/edit?errorMessages=${messages.join(',')}`)
            } else {
                res.send(error)
                console.log(error);
            }  
        }
    }

    static async showProfile(req, res) {
        try {
            let errorsArray = []
            if(req.query.errorMessages){
                errorsArray = req.query.errorMessages.split(',')
            }

            const profileData = await User.findOne({
                include: {
                    model: Profile
                },
                where: {
                    id: req.session.user.id
                }
            })

            res.render('profilePage.ejs', {profileData, errorsArray})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async updateProfile(req, res) {
        const transaction = await sequelize.transaction()
        try {

            let profileInputData = {fullName: req.body.fullName}

            if(req.body.imageUrl) {
                req.session.user.avatarUrl = req.body.imageUrl
                profileInputData.avatarUrl = req.body.imageUrl
            }

            if(req.body.phone) {
                profileInputData.phone = req.body.phone
            }

            let userInputdata = {}
            if(req.body.password) {
                userInputdata.password = req.body.password
            }

            await User.update(
                userInputdata,
                {
                    where: {
                        id: req.session.user.id
                    },
                    individualHooks: true,
                    transaction
                }   
            )

            await Profile.update(
                profileInputData,
                {
                    where: {
                        id: req.session.user.id
                    },
                    transaction
                }   
            )

            await transaction.commit();

            res.redirect('/profile')
        } catch (error) {
            await transaction.rollback();
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let messages = error.errors.map(error => error.message)

                res.redirect(`/profile?errorMessages=${messages.join(',')}`)
            } else {
                res.send(error)
                console.log(error);
            }  
        }
    }


    static async showProfileEvent(req, res) {
        try {
            const eventsData = await Event.findAll({
                include: [
                    {
                        model: User,
                        attributes: [],
                        through: {
                            model: Reservation, 
                            attributes: [],
                            where: {
                                status: 'Reserved'
                            } 
                        },
                        where: {
                            id: req.session.user.id,
                        },
                    },
                ],
                where: {
                    eventDate: {
                        [Op.gte]: new Date()
                    },
                },
                order: [['eventDate', 'ASC']]
            })

            res.render('userEventPage.ejs', {eventsData})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async showCreatedEvent(req, res) {
        try {
            const eventsData = await Event.findAll({
                attributes: ['id', 'title', 'eventDate', 'location', 'capacity', [Sequelize.fn('COUNT', Sequelize.col('Users.id')), 'attendeesCount']],
                include: [{
                model: User,
                attributes: [],
                through: { 
                    model: Reservation, 
                    attributes: [],
                } 
                }],
                where: {
                    OrganizerId: req.session.user.id
                },
                order: [['eventDate', 'ASC']],
                group: ['Event.id'],
            })

            res.render('eoEventPage.ejs', {eventsData})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async deleteEvent(req, res) {
        try {
            const eventData = await Event.findOne({
                where: {
                    OrganizerId: req.session.user.id,
                    id: req.params.eventId
                }
            })

            if(!eventData) {
                return res.redirect('/')
            }

            await Event.destroy({
                 where: {
                    OrganizerId: req.session.user.id,
                    id: req.params.eventId
                }
            })

            res.redirect('/profile/events/event-organizer')
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
}

module.exports = Controller