const { campgroundSchema, reviewSchema} = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

// Passport adds a user to the req. ie: req.user
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please Login');
        return res.redirect('/login');
    }
    next();
}

// Authorization Middleware
module.exports.isCampUser = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.user.equals(req.user._id)) {
        req.flash('error', 'Access Denied');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Authorization Middleware
module.exports.isReviewUser = async (req, res, next) => {
    const { id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    console.log(reviewId);
    console.log(review);
    if (!review.user.equals(req.user._id)) {
        req.flash('error', 'Access Denied');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Server Side Validation - Campgrounds
module.exports.validateCampground = (req, res, next) => {
    // Check for an error in the input we get back
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Server Side Validation - Reviews
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
