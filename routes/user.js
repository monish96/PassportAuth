const express = require('express')
const router = express.Router();
const passport = require('passport')
const { forwardAuthenticated } = require('../config/auth');
//bcrypt

const bcrypt = require('bcryptjs')


//model

const User = require('../models/User')

//login

router.get('/login', (req, res) => {
    res.render("login")
})

//register

router.get('/register', (req, res) => {
    res.render("register")
})


//register handler
router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body

    let errors = [];

    //validate

    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill all the fields'
        })
    }

    //check confirm password

    if (password !== password2) {
        errors.push({
            msg: 'Password does not match'
        })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {

        User.findOne({
            email: email
        }).then((user) => {
            if (user) {
                //user exists
                errors.push({
                    msg: 'email is already registered'
                })
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                //hash pwd
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        //save user to db

                        newUser.save()
                            .then((user) => {
                                req.flash('success_msg', `${name} , you are now registered successfully`)
                                res.redirect('/users/login')
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    })
                })

            }
        })

    }
})

//login handler
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

})


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router;
