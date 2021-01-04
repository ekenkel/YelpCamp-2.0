const express                               = require('express'),
// Merge the params from the index/app file with the current file (used to find the CampgroundID)
router                                      = express.Router({ mergeParams: true }),
Campground                                  = require('../models/campground'),
Review                                      = require('../models/review'),
reviews                                     = require('../controllers/reviews'),
catchAsync                                  = require('../utils/catchAsync'),
{ isLoggedIn, validateReview, isReviewUser} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.new));

router.delete('/:reviewId', isLoggedIn, isReviewUser, catchAsync(reviews.delete));

module.exports = router;
