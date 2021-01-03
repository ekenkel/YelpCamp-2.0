const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    // Gets all the campgrounds from the DB
    const campgrounds = await Campground.find({});
    // Passes the campgrounds to the ejs file
    res.render('campgrounds/index', {campgrounds});
};

module.exports.renderNew = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.postNew = async (req, res, next) => {
    //Create a new Campground based on the data passed in from /campgrounds/new
    const campground = new Campground(req.body.campground);
    // req.user is automatically added in with passport, it is the current user
    campground.user = req.user._id;
    // await for it to be saved to the DB before continuing
    await campground.save();
    // Waits til after a successful save and creates a flash message
    req.flash('success', 'Successfully made a new campground!');
    // redirect to see the new campground
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.readSingle = async (req, res) => {
    // Gets the specific campground from the DB
    const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'user'
            }
        }).populate('user');
    if (!campground) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds');
    }
    // Passes the campground to the ejs file
    res.render('campgrounds/show', {campground});    
}

module.exports.renderEdit = async (req, res) => {
    // Gets the specific campground from the DB
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds');
    }
    // Passes the campground to the ejs file
    res.render('campgrounds/edit', {campground});    
}

module.exports.update = async (req, res) => {
    // Gets the specific campground from the DB
    const { id } = req.params;
    // await Campground.updateOne(campground, ...req.body.campground);
    // Before - Campground.findByIdAndUpdate
    // Now - Find the Campground, verify that the campground associated user is the same user, then allow to update
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    await campground.save();
    // Passes the campground to the ejs file
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => {
    // Gets the specific campground from the DB
    const { id } = req.params;
    const { title } = await Campground.findByIdAndDelete(id);
    if (!title) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds');
    }
    req.flash('success', `Successfully deleted ${title}`);
    // redirect to see the updated list
    res.redirect(`/campgrounds`);
}