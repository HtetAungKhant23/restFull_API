const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const controllers = require('../controllers/user');

router.put('/signup', 
[
    body('email')
        .isEmail()
        .withMessage('not a valid email address!'),
    body('password')
        .trim()
        .isLength({min: 8})
        .not()
        .isUppercase()
        .not()
        .isLowercase()
        .not()
        .isAlphanumeric()
        .withMessage('password is not strong enough!')
]
, controllers.signup);

module.exports = router;