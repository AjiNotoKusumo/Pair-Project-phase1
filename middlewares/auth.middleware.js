const setLocalUsers = (req, res, next) => {
    res.locals.user = req.session.user || null
    next()
}

const isLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect('/auth/sign-in')  
    }
        
    next()
}

const isLoggedOut = (req, res, next) => {
    if(!req.session.user) {
         return next()
    } 
        
    const previousPage = req.get('Referer') || '/'
    
    res.redirect(previousPage)  
}

const isUser = (req, res, next) => {
    if(req.session.user.role === 'user') {
        return next() 
    } 

    const previousPage = req.get('Referer') || '/'
    
    res.redirect(previousPage) 
}

const isEventOrganizer = (req, res, next) => {
    if(req.session.user.role === 'eventOrganizer') {
        return next() 
    } 
    
    const previousPage = req.get('Referer') || '/'
    
    res.redirect(previousPage) 
    
}

module.exports = {setLocalUsers, isLoggedOut, isLoggedIn, isUser, isEventOrganizer}