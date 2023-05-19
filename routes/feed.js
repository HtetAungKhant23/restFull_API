const { body } = require('express-validator');
const express = require('express');
const controllers = require('../controllers/feed');
const router = express.Router();


router.get('/posts', controllers.getPost);

router.get('/posts/:postId', controllers.getPostById);

router.post('/post', 
[
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
]
, controllers.createPost);

router.put('/post/:postId', 
[
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
]
, controllers.updatedPost);


module.exports = router;