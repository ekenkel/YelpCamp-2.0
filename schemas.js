const BaseJoi = require('joi'),
sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean != value) {
                    return helpers.error('string.escapeHTML', { value });
                }
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);

//SERVER SIDE VALIDATION
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string()
            .escapeHTML()
            .required(),
        price: Joi.number()
            .min(0)
            .max(Number.MAX_SAFE_INTEGER)
            .required(),
        // image: Joi.array()
        //     .required(),
        location: Joi.string()
            .escapeHTML()
            .required(),
        description: Joi.string()
            .escapeHTML()
            .required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(0)
            .max(5)
            .required(),
        body: Joi.string()
            .escapeHTML()
            .required(),
    }).required()
});