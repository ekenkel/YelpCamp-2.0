const mongoose = require('mongoose'),
review         = require('./review'),
Schema         = mongoose.Schema,
// This is necessary to send data through JSON after a virtual
opts           = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
});
// This allows us to get a smaller optimized version of our image from cloudinary
// This is not store, this is a function to get it from the stored url
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_125');
});


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);

CampgroundSchema.virtual('properties').get(function() {
    return {
        title: this.title,
        location: this.location,
        id: this._id,
        desc: `${this.description.substring(0, 50)}...`
    }
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