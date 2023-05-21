const mongoose = require('mongoose');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getUser = (req, res, next) => {
    User.find()
        .then(users => {
            if(!users){
                const err = new Error('Users not found!');
                err.statusCode = 404;
                throw err;
            }
            console.log('users fetched!');
            res.status(200).json({
                message: 'Users fetched!',
                user: users
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getUserById = (req, res, next) => {
    const userId = req.params.userId;

    if(!mongoose.isValidObjectId(userId)){
        const err = new Error('it is not valid user ID');
        err.statusCode = 400;
        throw err; 
    }

    User.findById(userId)
        .then(user => {
            if(!user){
                const err = new Error('user not found!');
                err.statusCode = 404;
                throw err;
            }
            res.status(200).json({
                message: 'user by ID fetched!',
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

    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name
            })
            return user.save();
        })
        .then(result => {
            console.log('successfully sign up!');
            res.status(200).json({
                message: 'successfully sign up!',
                user: result._id,
                name: result.name
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    
}

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let userDb;

    User.findOne({email: email})
        .then(user => {
            console.log(user);
            if(user){
                userDb = user;
                return bcrypt.hash(password, 12);         
            }
        })
        .then(hashedPw => {
            if(hashedPw === userDb.password){
                res.status(200).json({
                    message: 'successfully login!',
                    user: userDb
                })
            }
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}



