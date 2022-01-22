const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');
const config = require('../config');
const User = require('./userModal');
const bcrypt = require('bcryptjs/dist/bcrypt');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())


//Get all Users
router.get('/users',(req,res) => {
    User.find({}, (err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//Register User
router.post('/register', (req,res) => {
    //Encrypt pass
    var hashpassword = bcrypt.hashSync(req.body.password,8);
    var email = req.body.email;
    User.find({email:email},(err,data) => {
        if(data.length>0){
            res.status(500).send({auth:false,token:'Email Already Taken'})
        }
        else{
            User.create({
                name:req.body.name,
                email:req.body.email,
                password:hashpassword,
                phone:req.body.phone,
                role:req.body.role?req.body.role:'User'
            },(err,data) => {
                if(err) return res.status(500).send('Error While Registering')
                res.status(200).send('Register Successful')
            })
        }
    })
})

//Login 
router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return res.status(500).send({auth:false,token:'Error while Login'})
        if(!user) return res.status(500).send({auth:false,token:'No User Found'})
        else{
            // Password Compare
            const passIsValid = bycrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.status(500).send({auth:false,token:'Invalid Password'})
            var token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400})
            res.send({auth:true,token:token})
        }
    })
})

// Profile
router.get('/userInfo',(req,res) => {
    var token = req.headers['x-access-token']
    if(!token) return res.status(500).send({auth:false,token:'No Token Provided'})
    jwt.verify(token, config.secret, (err, user) => {
        if(err) res.status(500).send({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err, result) => {
            res.send(result)
        })
    })
})

module.exports = router