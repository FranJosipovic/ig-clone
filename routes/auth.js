const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const {JWT_SECRET} = require('../config/keys')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth : {
        api_key : "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"
    }
}))

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
                user.save()
                .then(user =>{
                            transporter.sendMail({
                                to:user.email,
                                from:"fran.josipovic55@gmail.com",
                                subject:"uspjesna prijava",
                                html:"<h1>jedi gofnaa</h1>"
                            })
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

router.post('/password-reset',(req,res)=>{
    crypto.randomBytes(32,(err,buf)=>{
        if(err){
            console.log(err)
        }
        const token = buf.toString('hex')
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"user with that email doesn't exist"})
            }
            user.resetToken = token
            user.tokenExpires = Date.now() + 3600000
            user.save().then(result=>{
                transporter.sendMail({
                    to:user.email,
                    from:"fran.josipovic55@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>you requested password reset</p>
                    <h5>follow this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</h5>
                    `
                })
                .then(res.json({message:"check your email"}))
            })
        })
    })
})

router.post('/new-pasword',(req,res)=>{
    const {token,newPassword} = req.body
    User.findOne({resetToken:token,tokenExpires:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"password reset has expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedPassword=>{
            user.password = hashedPassword
            user.resetToken = undefined
            user.tokenExpires = undefined
            user.save().then(savedUser=>{
                res.json({message:"password updated succesfuly"})
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router