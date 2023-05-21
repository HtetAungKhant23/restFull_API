const { body } = require('express-validator');
const express = require('express');
const controllers = require('../controllers/feed');
const router = express.Router();


router.get('/', controllers.getPost);

router.get('/:postId', controllers.getPostById);

router.post('/', 
[
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
]
, controllers.createPost);

router.put('/:postId', 
[
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
]
, controllers.updatePost);

router.delete('/:postId', controllers.deletePost);


module.exports = router;