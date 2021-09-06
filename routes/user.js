const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requiredLogin')
const User = mongoose.model("User")

router.get("/user/:id",requireLogin,(req,res)=>{
    User.findById(req.params.id)
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            } 
            res.json({user,posts})
        })
    })
    .catch(err =>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put("/follow",requireLogin,(req,res)=>{
    const {followingId} = req.body
    User.findByIdAndUpdate(followingId,{
        $push:{followers:req.user._id}
    },
    {
        new:true
    },((err,result)=> {
        if(err){
            return res.status(433).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:followingId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>res.json(result))
        .catch(err =>{return res.status(422).json({error:err})} )
    })
    )
})
router.put("/unfollow",requireLogin,(req,res)=>{
    const {unfollowingId} = req.body
    User.findByIdAndUpdate(unfollowingId,{
        $pull:{followers:req.user._id}
    },
    {
        new:true
    },((err,result)=> {
        if(err){
            return res.status(433).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:unfollowingId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>res.json(result))
        .catch(err =>{return res.status(422).json({error:err})} )
    })
    )
})

router.get("/followers/:userId",requireLogin,(req,res)=>{
    User.findById(req.params.userId)
    .populate("followers","_id name")
    .populate("following","_id name")
    .select("-password")
    .select("-email")
    .select("-name")
    .then(result =>{res.json(result)})
    .catch(err => 
        {return res.status(422).json({error:err})}
    )
})

router.put("/updateprofilepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.newPic}},{
        new:true 
    })
    .select("-password")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.post("/search-user",requireLogin,(req,res)=>{
    const userPattern = new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern}})
    .select("_id name")
    .then(user=>{
        res.json({user})
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router