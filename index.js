require('dotenv').config()
const express = require('express')
const cookieSession = require('cookie-session')
const session = require('express-session')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT
const flash = require('connect-flash-plus')

const {authenticate} = require('./app/core/auth/auth.js');
const {isUserLoggedIn} = require('./app/middlewares/auth/user.js');
const {users} = require('./app/data/users.js');

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SECRET_KEY],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }))

app.set('view engine', ejs)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash())

// app.use(isUserLoggedIn)

// Use statics files in assets
app.use(express.static(__dirname))

app.get('/', (req, res)=>{
    if(req.session.user != undefined)
        res.redirect('/home')
    res.render('./pages/auth/login.ejs', {error:req.flash('info')})
}).post('/', (req, res)=>{
    var username = req.body.username
    var password = req.body.password
    user = authenticate(username, password)
    if(!user){
        req.flash('info', 'Invalid username of password')
        return res.redirect('/')
    }
    req.session.user = user
    res.redirect('/home')
})

app.get('/register', (req, res)=>{
    res.render('./pages/auth/register.ejs')
})

app.get('/logout', (req, res)=>{
    if(req.session.user)
        req.session.user = null
    
    res.redirect('/')
})

app.get('/home', (req, res)=>{
    res.render('./pages/home.ejs', {user:req.session.user})
})

app.get('/user',(req, res)=>{
    res.send(`Profile of User`)
})

app.get('/:username',(req, res, next)=>{
    let username = req.params.username
    let user = users.find((user)=>{
        return username === user.username
    })
    if(!user || user === undefined)
    {
        res.sendStatus(404)
        return
    }
    req.user  = user
    next()
},(req, res)=>{
    let user = req.user
    res.send(`Profile of ${user.name} username: ${user.username}`)
})

app.get('/:user/posts/?:id(\\d+)',(req, res)=>{
    let name = req.params.user
    let id = req.params.id
    res.send(`Post  of ${name} with ${id}`)
})

app.listen(port, ()=>{
    console.log(`Port listening to ${port}`)
    console.log(`Serving at http://localhost:${port}`)
})