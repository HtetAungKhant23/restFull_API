const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
    ){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
    next();
});


app.use('/api', authRoutes);
app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose
    .connect(
        'mongodb+srv://root:root@cluster0.ksor6cg.mongodb.net/firstapi?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(result => {
        console.log('Connected!');
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })