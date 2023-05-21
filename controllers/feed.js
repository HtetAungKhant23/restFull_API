const Post = require('../models/feed');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

exports.getPost = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'posts fetched!',
                post: posts
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getPostById = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post){
                const error = new Error('post not found!');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'post fetched!',
                post: post
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    if(!req.file){
        const error = new Error('no image provided!');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const imgUrl = req.file.path.replace('\\','/');
    console.log(imgUrl);
    let creator;

    const post = new Post({
        title: title,
        content: content,
        creator: req.body.userId,
        imgUrl: imgUrl        
    })

    post.save()
        .then(result => {
            return User.findById(req.body.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'post successfully created!',
                post: post,
                userId: result._id,
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

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation failed!');
        error.statusCode = 422;
        throw error;
    }
    
    const title = req.body.title;
    const content = req.body.content;
    let imgUrl = req.body.imgUrl;
    const creator = req.body.creator;

    if(req.file){
        imgUrl = req.file.path.replace('\\', '/');
    }

    if(!imgUrl){
        const error = new Error('no file detected!');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if(!post){
                const err = new Error('Post not found in database');
                err.statusCode = 404;
                throw err;
            }

            // if(imgUrl !== post.imgUrl){
            //     clearImage(post.imgUrl);
            // }
            clearImage(post.imgUrl);

            post.title = title;
            post.content = content;
            post.imgUrl = imgUrl;
            post.creator = creator;

            return post.save();
        })
        .then(result => {
            console.log('post successfully updated!');
            res.status(200).json({
                message: 'post successfully updated!',
                post: result
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err, "is here?"));
    // fs.unlink(filePath);
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post){
                const err = new Error('post not found!');
                err.statusCode = 422;
                throw err;
            }
            clearImage(post.imgUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            console.log('Post deleted!');
            res.status(200).json({
                message: 'Post deleted!'
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}