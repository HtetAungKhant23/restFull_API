const express = require('express');
const controllers = require('../controllers/feed');
const router = express.Router();


router.get('/posts', controllers.getPost);

router.post('/post', controllers.createPost);


module.exports = router;