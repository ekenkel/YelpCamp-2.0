const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerPost = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username });
        // Takes the user and hashes the password
        const registeredUser = await User.register(user, password);
        // Adds functionality to stay logged in after registering
        // Use login for first time use
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
        });
        req.flash('success', 'Welcome to YelpCamp.');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginPost = (req, res) => {
    const returnUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(returnUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out.');
    res.redirect('/');
}