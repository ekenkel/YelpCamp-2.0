const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// **************************
// *****MONGOOSE/MONGODB*****
// **************************

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Database connected");
});

// **************************
// IDK IF KEEPING
// **************************

const sessionConfig = {
    secret: 'faq3fwlerspgipojxnvq34ur3j25i',
    resave: false,
    saveUnitiialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7
    }
}
app.use(session(sessionConfig));

// **************
// ***Passport***
// **************

app.use(passport.initialize());
app.use(passport.session());
// In the User model, we include a plugin that allows for more static methods like authenticate
// Can have multiple strategies going in at once. Ex. : Google, Facebook, Twitter
passport.use(new LocalStrategy(User.authenticate()));

// Passport stores the data in a session
// How to store a user in a session
passport.serializeUser(User.serializeUser());
// How to unstore a user from a session
passport.deserializeUser(User.deserializeUser());


// *************
// ****Flash****
// *************

app.use(flash());

// ******************
// ****MIDDLEWARE****
// ******************

// Middleware that stores the flash message for success
// *NOTE* : There won't always be a message for success
app.use((req, res, next) => {
    // We can see the current user everywhere now
    res.locals.currentUser = req.user;
    // Whatever is in the flash success is stored in the key res.locals.success - We will access these later
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// *************
// *****EJS*****
// *************

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// **************
// *****MISC*****
// **************

// Used for updating routes
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
// This is used to serve that directory
app.use(express.static(path.join(__dirname, 'public')));


// **************
// ****Routes****
// **************

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// For any page that does not exist it returns this
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// ********************
// ***ERROR HANDLING***
// ********************

// Error handling middleware
// All express errors go here
app.use((err, req, res, next) => {
    // Default status of 500
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Something went wrong. :(';
    // This renders the error template we have
    res.status(statusCode).render('error', {err});
});

// ************
// ****PORT****
// ************

app.listen(3000, () => {
    console.log('Serving on port 3000');
});
