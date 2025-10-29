const express = require('express');
const Joi = require('joi');

const { validateBody } = require('../middleware/validator');
const { createUser } = require('../controllers/userController');

const router = express.Router();

const createUserSchema = Joi.object({
    username: Joi.string().min(3).max(20).trim()
        .message("Username should be between 3 to 20 charachter length").required(),
    email: Joi.string().trim()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .message("Valid email-id is required")
        .required(),
    password: Joi.string().min(8).max(20)
        .trim()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)
        .message("Password should contain uppercase & lowercase letters with atleast a number & a symbol and should be of length 8 characters atleast & 20 charcacters at max.")
        .required()
});

router.post('/', validateBody(createUserSchema), createUser);

module.exports = router;