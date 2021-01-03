const express = require('express');
// Merge the params from the index/app file with the current file (used to find the CampgroundID)
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const { isLoggedIn, validateReview, isReviewUser} = require('../middleware');


// *****************
// *****REVIEWS*****
// *****************

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.new));

router.delete('/:reviewId', isLoggedIn, isReviewUser, catchAsync(reviews.delete));

// *****************
// ***REVIEWS END***
// *****************

module.exports = router;
