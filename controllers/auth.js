const User = require('../models/auth');
const bcrypt = require('bcryptjs');

exports.getUser = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({
                message: 'users fetched!',
                users: users
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getUserById = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            if(!user){
                console.log('user not found in database!');
            }else{
                res.status(200).json({
                    message: 'user fetched!',
                    user: user
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.createUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name
            });

            return user.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'user account successfully created!',
                user: result
            });
        })
        .catch(err => {
            console.log(err);
        })

}