const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.new = async(req, res) => {
    // Gets the campground on which the review was written
    const campground = await Campground.findById(req.params.id);
    // Gets the input from the form ex. : name="review[body]"
    const review = new Review(req.body.review);
    review.user = req.user._id;
    // Adds the new review to the campground
    campground.reviews.push(review);
    // Saves both the data
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!');
    // redirects back to the show page for the corresponding campground
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async(req, res) => {
    const { id, reviewId } = req.params;
    // $pull takes the reviewId and pulls anything with that ID out of reviews
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}