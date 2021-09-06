const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requiredLogin')

router.get('/followingposts',requireLogin,(req,res) =>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy" , "_id name email")
    .sort('-createdAt')
    .then(post => {
            res.json({post})
        })
        .catch(err=>{
            console.log(err)
        })
})
router.get('/allposts',requireLogin,(req,res) =>{
    Post.find()
    .populate("postedBy" , "_id name email")
    .sort('-createdAt')
    .then(post => {
            res.json({post})
        })
        .catch(err=>{
            console.log(err)
        })
})

router.post('/createPost',requireLogin,(req,res)=>{
    const {title,body,photo} = req.body
    if(!title || !body){
        return res.status(422).json({error : "please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user,
    })
    post.save().then(
        result => {
            res.json({post:result})
        })
        .catch(err=>{
           console.log(err)
        })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "name _id")
    .sort('-createdAt')
    .then(myPost=>{
        res.json({myPost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost/:postId',requireLogin,(req,res)=>{
    Post.findById(req.params.postId)
    .populate("postedBy","_id name")
    .then(singlePost=>{
        res.json({singlePost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id},
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/commentPost",requireLogin,(req,res)=>{

    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment},
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/uncommentPost",requireLogin,(req,res)=>{

    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:comment},
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router