const Post = require('../models/feed');

exports.getPost = (req, res, next) => {
    Post.find()
        .then(post => {
            if(!post){
                return res.status(404).json({
                    message: 'post not found in database',
                })
            }
            res.status(200).json({
                message: 'posts fetched!',
                post: post
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const imgUrl = req.body.imgUrl;

    const post = new Post({
        title: title,
        content: content,
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
            console.log(err);
        })

}