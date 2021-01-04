const express = require('express');
router        = express.Router(),
passport      = require('passport'),
User          = require('../models/user'),
users         = require('../controllers/users'),
catchAsync    = require('../utils/catchAsync');

router.route('/register')
// GETS THE REGISTER FORM
.get(users.renderRegister)
// POSTS THE REGISTER FORM
.post(catchAsync(users.registerPost))

router.route('/login')
// GETS THE LOGIN FORM
.get(users.renderLogin)
// POSTS THE LOGIN FORM
.post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), users.loginPost)

router.get('/logout', users.logout);

module.exports = router;

