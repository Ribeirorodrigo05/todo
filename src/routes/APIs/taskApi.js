const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const csurf = require('csurf');
const key = require('../../../config/keys');
const jwt = require('jsonwebtoken');

//new instance of csurf for cross-site protection
const csrfProtection = csurf({cookie: {httpOnly: true}});


//module required
const Assignment = require('../../../model/Assignment')
const User = require('../../../model/User')
const auth = require('../../../config/auth')


router.get('/painel',csrfProtection,auth,(req,res)=>{
   /* let id = {};
    jwt.verify(req.cookies.cookieToken, key.secretOrkey, (err, decoded)=>{
        req.cookies.cookieToken = decoded.id;
        id.userID = decoded.id
        })*/
    
    /*Assignment.findOne({user: id.userID}).then(task =>{
        Assignment.find().then((task)=>{
            if(task){
            res.render('request/painel',{task : task })
            }else{
               
        

        
    })

})*/
    const { userID } = req;

    Assignment.find({user: userID}).then(user => {
        Assignment.find({done:true}).then(isDone =>{
            res.render('request/painel',{user : user ,isDone : isDone})
        })
            
          
       
        })

    })
router.post('/task',auth,(req,res)=>{
    const {userID} = req;

    console.log(userID)

        Assignment.findOne({_id: userID}).then(task => {
            const newTask = new Assignment({
                user : userID,
                task: req.body.task
            }).save()
            .then(()=>{
                res.redirect('/painel')
                console.log('save')
            })
            .catch(err => console.log(err))
        })
    
})

router.post('/edit', auth,(req,res)=>{
   Assignment.findOne({_id:req.body.id}).then(task =>{
       task.done = true
   }).save()
   .then(()=> res.redirect('/painel'))
})

router.get('/delete/:id', csrfProtection,auth, (req,res)=>{
    Assignment.deleteOne({_id: req.params.id}).then(()=>{
        res.redirect('/painel')
    })
})

module.exports = router;