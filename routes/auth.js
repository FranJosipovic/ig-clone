const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')

router.post('/signUp',(req,res)=>{
    const {name,email,password,pic} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error:'please add all fields'})
    }
    User.findOne({email:email}).then(
        (savedUser) => {
            if(savedUser){
                return res.status(422).json({error:'user already exists'})
            }
            bcrypt.hash(password,12).then(
                hashedPassword => {
                const user = new User({
                    email,
                    password : hashedPassword,
                    name,
                    pic
                })
                user.save().then(user =>{
                    res.json({message: 'user saved sucefully'})
                })
                .catch(err => console.log(err))}
            )
        })
        .catch(err => console.log(err))
})

router.post('/signIn',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:'no email or password'})
    }
    User.findOne({email:email}).then(
        savedUser =>{
            if(!savedUser){
                return res.status(422).json({error :'invalid email or password'})
            }
            bcrypt.compare(password,savedUser.password)
            .then(isCorrect =>{
                if(isCorrect){
                    const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
                    res.json({token,user:savedUser})
                }
                else{
                    return res.status(422).json({error :'invalid email or password'})
                }
            })
        }
    )
    .catch(error=>{
        console.log(error)
    })
})

module.exports = router