const Post = require('../models/feed');
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
    const creator = req.body.creator;
    console.log(imgUrl);

    const post = new Post({
        title: title,
        content: content,
        creator: creator,
        imgUrl: imgUrl        
    })

    post.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'post successfully created!',
                post: result
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })

}