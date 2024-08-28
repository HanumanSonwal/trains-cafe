const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import Category model
const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/',(req,res,next)=>{
    bcrypt.hash(req.body.Password,10,(err,hash)=>
    {
        if(err)
        {
            return res.status(500).json(
                {
                    error:err
                }
            )
        }
        else
        {
            const user =new User({
                
                    _id: new mongoose.Types.ObjectId(),
                    username:req.body.username,
                    Password:hash,
                    phone:req.body.phone,
                    email:req.body.email,
                    usertype:req.body.usertype,
                })
            user.save().then(result=>{
                res.status(200).json({
                    new_user:result
                })
               
            })
            .catch(err=>{
                res.status(500).json({
                    error:err
                })
            })
            

        }
    })
    
})
router.post('/login', (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ msg: 'User does not exist' });
            }
            bcrypt.compare(req.body.Password, user[0].Password, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                if (!result) {
                    return res.status(401).json({ msg: 'Password does not match' });
                }
                const token = jwt.sign(
                    {
                        username: user[0].username,
                        usertype: user[0].usertype,
                    },
                    'this is dummy text',
                    { expiresIn: '24h' }
                );
                res.status(200).json({
                    username: user[0].username,
                    usertype: user[0].usertype,
                    token: token,
                });
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});
module.exports = router;
