const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

//Model
const User = require('../models/User')

//Login
router.get('/login', (req, res) => res.render('login'));

//sign-up
router.get('/signup', (req, res) => res.render('signup'));

//Signup handle
router.post('/signup', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all the fields' })
        //alert("Please fill all the fields");
    }

    //check password match
    if (password !== password2) {
        errors.push({ msg: 'Your passwords do not match' });
    }

    //check password length
    if (password.length < 7) {
        errors.push({ msg: 'Password should be of atleast 7 characters' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //validation passed
        User.findOne({ email: email })
        .then(user => {
            if (user) {
                //user exists
                errors.push({ msg: 'Email already exists' })
                res.render('signup', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
                // res.redirect('/users/login')  
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }

                    newUser.password = hash;

                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered and can login');
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))
                }))
            }
        })
    }


});

//Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})


//logout
router.get('logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login');
})

module.exports = router;