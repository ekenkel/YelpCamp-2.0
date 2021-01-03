const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string()
            .required(),
        price: Joi.number()
            .min(0)
            .max(Number.MAX_SAFE_INTEGER)
            .required(),
        image: Joi.string()
            .required(),
        location: Joi.string()
            .required(),
        description: Joi.string()
            .required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),
        body: Joi.string()
            .required()
    }).required()
});