const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const assignmentSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    task:{
        type:String,
        Require:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
    
})

module.exports = Assignment = mongoose.model('assignment', assignmentSchema)