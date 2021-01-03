const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isCampUser} = require('../middleware');

// This file is a means to separate the routes for cleaner code


// *****************
// ***CAMPGROUNDS***
// *****************

// READ - (ALL)
// NEED ASYNC BECAUSE IT IS FINDING DATA
router.get('/', catchAsync(campgrounds.index));

// Gets the form to create
router.get('/new', isLoggedIn, campgrounds.renderNew);

// CREATE
// When the user presses the button to add a campground, it routes here because it is a post route
// NEED ASYNC BECAUSE IT IS FINDING DATA
// catchAsync is watching for throws - it will catch this error and send it to the error handler middleware
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.postNew));

// Read - (SINGLE)
// NEED ASYNC BECAUSE IT IS FINDING DATA
router.get('/:id', catchAsync(campgrounds.readSingle));

// Gets the form to edit
// NEED ASYNC BECAUSE IT IS FINDING DATA
router.get('/:id/edit', isLoggedIn, isCampUser, catchAsync(campgrounds.renderEdit));

// UPDATE
// NEED ASYNC BECAUSE IT IS FINDING DATA
router.put('/:id', isLoggedIn, isCampUser, validateCampground, catchAsync(campgrounds.update));

// DELETE
// NEED ASYNC BECAUSE IT IS FINDING DATA
router.delete('/:id', isLoggedIn, isCampUser, catchAsync(campgrounds.delete));

// *****************
// *CAMPGROUNDS END*
// *****************

module.exports = router;