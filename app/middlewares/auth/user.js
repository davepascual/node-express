module.exports.isUserLoggedIn =  (req, res, next)=>{
    // if(req.session.user === undefined && req.url != '/')
        // res.redirect('/')
    next()
}
