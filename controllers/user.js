const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const err = new Error('validation failed');
        err.statusCode = 422;
        err.message = errors.array();
        throw err;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    const user = new User({
        email: email,
        password: password,
        name: name
    });

    user.save()
        .then(user => {
            console.log('successfully sign up!');
            res.status(200).json({
                message: 'successfully sign up',
                user: user
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

