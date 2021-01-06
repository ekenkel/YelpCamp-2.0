if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express    = require('express'),
app              = express(),
path             = require('path'),
methodOverride   = require('method-override'),
ejsMate          = require('ejs-mate'),
session          = require('express-session'),
MongoStore       = require('connect-mongo')(session),
passport         = require('passport'),
LocalStrategy    = require('passport-local'),
flash            = require('connect-flash'),
mongoSanitize    = require('express-mongo-sanitize'),
helmet           = require('helmet');

ExpressError     = require('./utils/ExpressError'),
mongoose         = require('mongoose'),
User             = require('./models/user'),

campgroundRoutes = require('./routes/campgroundRoutes'),
reviewRoutes     = require('./routes/reviewRoutes'),
userRoutes       = require('./routes/userRoutes');

// **************************
// *****MONGOOSE/MONGODB*****
// **************************

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
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

app.use(mongoSanitize({
    replaceWith: '_'
}));

// *************
// ***SESSION***
// *************

const secret = process.env.SECRET || 'gjkhkghbnxcosomfwmefwlbimxfniudxlHGKbjgkghjxKGJHGjhggKHGKxJHGkhgrttoiupInhlkhlHHIUYioiu'
const sessionConfig = {
    name:'session',
    secret,
    store: new MongoStore({
        url: dbUrl,
        secret,
        touchAfter: 24 * 3600,
    }).on('error', function(e) {
        console.log('SESSION STORE ERROR', e);
    }),
    resave: false,    saveUnitiialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7
    }
}
app.use(session(sessionConfig));

// **************
// ****HELMET****
// **************

app.use(helmet({
    contentSecurityPolicy: false
}))


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CN}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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
// This is used to serve the public directory
app.use(express.static(path.join(__dirname, 'public')));


// **************
// ****ROUTES****
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
