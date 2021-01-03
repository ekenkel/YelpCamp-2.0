const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// This is middleware when a campground is deleted
CampgroundSchema.post('findOneAndDelete', async function(camp) {
    // camp = doc
    if (camp) {
        await review.deleteMany({
            // 
            _id: {
                // Somewhere in document reviews
                // Delete all reviews where their id field is in the document that we just deleted
                $in: camp.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);