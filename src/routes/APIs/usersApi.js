const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csurf = require('csurf');

//new instance of csurf for cross-site protection
const csrfProtection = csurf({cookie: {httpOnly: true}});

//model requered
const User = require('../../../model/User')
const Assignment = require('../../../model/Assignment')
const key = require('../../../config/keys')
const validateRegisterInput = require('../../../validation/register')
const validateLoginInput = require('../../../validation/login')


//route home 
//route public
router.get('/',(req,res)=>{
    res.render('request/login')
})

router.get('/register',(req,res)=>{
    res.render('request/register')
})
//this route is public
//create a user and turn the password into a hash 
//if user already exists send a error

router.post('/formRegister',(req,res)=>{
    const {errors, isValid} = validateRegisterInput(req.body);
    
    if(!isValid){
        return res.render('request/register', {errors : errors})
    }


    User.findOne({email: req.body.email})
    .then((user)=>{
        if(user){
            errors.email = 'Email already exists'
            res.status(400).json(errors)
        }else{
           

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(()=>{
                        res.redirect('/')
                    })
                    .catch(err => console.log(err))
                })
            })
        }
    })
})

//Route public
//Create payload
//create token
router.post('/login',(req,res)=>{

        const {errors, isValid} = validateLoginInput(req.body)

        if(!isValid){
            return res.render('request/login',{errors : errors})
        }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}).then(user =>{
        const errorsLogin ={}
        if(!user){
            errorsLogin.email = 'User not found'
            res.render('request/login',{errorsLogin : errorsLogin})
        }else{
            bcrypt.compare(password, user.password).then(isMatch =>{
                if(isMatch){
                    const payload = {
                        id: user.id,
                        name: user.name
                    }
                    res.cookie('cookieToken',
                    jwt.sign(payload,
                         key.secretOrkey,
                         {expiresIn:7200},
                         {httpOnly: true})
                    )
                    
                    res.redirect('/painel')
                
                }else{
                    errorsLogin.invalid = 'Email/Password is invalid'
                   res.render('request/Login',{errorsLogin: errorsLogin})     
                }
            })
        } 
        //end else
    })
})



module.exports = router