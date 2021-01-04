const mongoose        = require('mongoose'),
Schema                = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// This adds a username, password, and additional methods to the schema
// We use User.authenticate
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);