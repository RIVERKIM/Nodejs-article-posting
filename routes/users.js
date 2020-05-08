const express = require('express');
const router = express.Router();
const {userValidationRules, validate} = require('../validator/validator_user.js');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const passport = require('passport');

// Bring in models
let User = require('../models/user');

// Register Form
router.get('/register', (req, res) => {
	res.render('register');
});

// Register Process
router.post('/register', userValidationRules(), validate,  (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const passwordConfirmation = req.body.passwordConfirmation;
	
	let newUser = new User({
		name: name,
		email: email,
		username: username,
		password: password,
	});
	
	bcrypt.genSalt(saltRounds, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if(err) {
				console.log(err);
			} else {
				newUser.password = hash;
				newUser.save(() => {
					if(err) {
						console.log(err);
						return;
					} else {
						req.flash('success', "You are now registered and can log in");
						res.redirect('/users/login');
					}
				})
			}
		});
	});
});

// Login Form
router.get('/login', (req, res) => {
	res.render('login');
})

// Login Process
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true,
		successFlash: true
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', "You are logged out");
	res.redirect('/users/login');
})

module.exports = router;
