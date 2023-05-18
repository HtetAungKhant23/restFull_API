const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

app.use('/api', authRoutes);

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