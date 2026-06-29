const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {Schema} = mongoose;

const subscribeSchema = new Schema ({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    image:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Subscriber' , subscribeSchema)