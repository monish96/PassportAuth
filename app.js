const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000

const expressLayout = require('express-ejs-layouts')

const mongoose = require('mongoose')

const db = require('./config/key').mongoURI

const flash = require('connect-flash')

const session = require('express-session')

const passport = require('passport')

// Passport Config
require('./config/passport')(passport);

//connect mongo

mongoose.connect(db, { useNewUrlParser: true }).then(() => console.log("database connected")).catch((err) => console.log(`error coonecting db ${err}`))

//EJS

app.use(expressLayout);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))

//express session

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash())

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//routes

app.use('/users', require('./routes/user'))
app.use('/', require('./routes/index'))

// app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, console.log(`server up and running in port ${PORT}`))



