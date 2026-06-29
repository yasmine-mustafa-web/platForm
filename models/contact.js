const mongoose = require('mongoose');
const {Schema} = mongoose;

const contactSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:[true , 'write your message']
    }
})

module.exports=mongoose.model('Contact' , contactSchema);