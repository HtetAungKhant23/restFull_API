const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { body } = require('express-validator');
const controllers = require('../controllers/user');

router.put('/signup', 
[
    body('email')
        .isEmail()
        .withMessage('not a valid email address!')
        .custom((vlaue, {req}) => {
            return User.findOne({email: vlaue})
                .then(user => {
                    if(user){
                        return Promise.reject('Email already exist!');
                    }
                })
        })
        .normalizeEmail(),
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
        .custom((value, {req}) => {
            const conPass = req.body.confirmPassword;
            if(value !== conPass){
                return Promise.reject('your password is not match!');
            }
            return true;
        }),
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter name!')
]
, controllers.signup);

router.get('/', controllers.getUser);

router.get('/:userId', controllers.getUserById);

router.put('/signin',
[
    body('email')
        .trim()
        .isEmail()
        .withMessage('not a valid email format!')
        .not()
        .isEmpty()
        .normalizeEmail(),
    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter password!')
], controllers.signin);

module.exports = router;