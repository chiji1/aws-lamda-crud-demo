const Joi = require('joi');

const schemaCreate = Joi.object({
    title: Joi.string().trim().required(),
    image: Joi.string().optional(),
});

const schemaUpdate = Joi.object({
    title: Joi.string().trim().optional(),
    image: Joi.string().optional(),
    fat: Joi.string().optional(),
    calories: Joi.string().optional(),
    carbohydrates: Joi.string().optional()
});

module.exports = {
    schemaCreate,
    schemaUpdate
}
