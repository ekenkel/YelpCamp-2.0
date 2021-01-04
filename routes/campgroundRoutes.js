const express                                 = require('express'),
router                                        = express.Router(),
Campground                                    = require('../models/campground'),
campgrounds                                   = require('../controllers/campgrounds'),
catchAsync                                    = require('../utils/catchAsync'),
{ isLoggedIn, validateCampground, isCampUser} = require('../middleware');

// NEED ASYNC WHEN IT IS FINDING DATA
// catchAsync is watching for throws - it will catch the error and send it to the error handler middleware in the index

router.route('/')
// READ - (ALL)
.get(catchAsync(campgrounds.index))
// CREATE
.post(isLoggedIn, validateCampground, catchAsync(campgrounds.postNew))

// Gets the form to CREATE
router.get('/new', isLoggedIn, campgrounds.renderNew);

router.route('/:id')
// Read - (SINGLE)
.get(catchAsync(campgrounds.readSingle))
// UPDATE
.put(isLoggedIn, isCampUser, validateCampground, catchAsync(campgrounds.update))
// DELETE
.delete(isLoggedIn, isCampUser, catchAsync(campgrounds.delete))

// Gets the form to edit
router.get('/:id/edit', isLoggedIn, isCampUser, catchAsync(campgrounds.renderEdit));

module.exports = router;