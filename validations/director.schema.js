const Joi = require('joi');

const directorSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
    }),
    age: Joi.number().min(18).max(99).required().messages({
        'number.base': 'Age must be a number',
        'number.empty': 'Age is required',
        'number.min': 'Age must be at least 18',
        'number.max': 'Age must be at most 99',
    })
});

module.exports = directorSchema;