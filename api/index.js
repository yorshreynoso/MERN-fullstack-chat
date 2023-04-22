const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const jwtSecret =process.env.JWT_SECRET;
const User = require('./models/User');
const CLIENT_URL = process.env.CLIENT_URL;

(async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected correctly');
        
    } catch (error) {
        console.log('Failed to connect to mongodb', error);
    }
})();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true, 
    'Access-Control-Allow-Origin': 'http://localhost:5173', 
    'Access-Control-Allow-Credentials': true, 
    'Access-Control-Allow-Headers': true, 
    origin:'http://localhost:5173'
}));

app.set('PORT', process.env.PORT);


app.get('/test', (req, res) => {
    res.json({'test': 'ok'});
});

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if(token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if(err) throw err;
            res.json({ userData })
        })
    } else {
        res.status(401).json('no token');
    }
})


app.post('/register', async (req, res) => {
    console.log('esta entrando');
    const {username, password} = req.body;

    try {
        const createdUser = await User.create({username, password});
        //await jwt.sign({userId: createdUser._id}, jwtSecret); await, another way to do it
        jwt.sign({userId: createdUser._id, username}, jwtSecret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token, {sameSite:'none', secure: true}).status(201).json({
                _id: createdUser._id,
            });
        })    
    } catch (error) {
        console.log('Verify your error please ',error);
        res.status(500).json('bad request');
    }
   
});



app.listen(app.get('PORT'), () => {
    console.log(`Server connected on port ${app.get('PORT')}`);
});