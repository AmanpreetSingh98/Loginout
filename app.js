const express = require('express');
const app = express();
const db = require('./db');
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

const AuthController = require('./auth/authController');
const router = require('./auth/authController');
const userModal = require('./auth/userModal');
app.use('/api/auth', AuthController);



app.listen(port, () => {
    console.log('listen to port 5000')
})