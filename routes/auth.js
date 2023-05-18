const express = require('express');
const controllers = require('../controllers/auth');

const router = express.Router();

router.get('/posts', controllers.getUser);

router.get('/posts/:userId', controllers.getUserById);

router.post('/post', controllers.createUser);

module.exports = router;