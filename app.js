const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid');

const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4.v4() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('imgUrl')
)

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
    console.log( error.message);
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose
    .connect(
        'mongodb://root:root@ac-ylfcoft-shard-00-00.ksor6cg.mongodb.net:27017,ac-ylfcoft-shard-00-01.ksor6cg.mongodb.net:27017,ac-ylfcoft-shard-00-02.ksor6cg.mongodb.net:27017/firstapi?ssl=true&replicaSet=atlas-ylla10-shard-0&authSource=admin&retryWrites=true&w=majority',
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
        console.log(err, "hehe");
    })