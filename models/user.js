const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required : true,
    },
    email : {
        type: String,
        required : true,
    },
    pic : {
        type : String,
    },
    resetToken: String,
    tokenExpires: Date,
    following : [{type:ObjectId,ref:"User"}],
    followers : [{type:ObjectId,ref:"User"}],
    password : {
        type: String,
        required : true,
    }
})

mongoose.model('User',userSchema)