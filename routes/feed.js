const { body } = require('express-validator');
const express = require('express');
const controllers = require('../controllers/feed');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

router.get('/', isAuth, controllers.getPost);

router.get('/:postId', isAuth, controllers.getPostById);

router.post('/', isAuth,
[
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
]
, controllers.createPost);

router.put('/:postId', isAuth,
[
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
]
, controllers.updatePost);

router.delete('/:postId', isAuth, controllers.deletePost);


module.exports = router;