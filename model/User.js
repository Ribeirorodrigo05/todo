const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name:{
        type:String,
        require:true,
        uppercase:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
    
})

module.exports = User = mongoose.model('users', UserSchema)
