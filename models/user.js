const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  firstname:{
       type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  username:{
   type:Number,
   required:true
 },
 parentphoneNumber:{
   type:Number,
   required:true
 },
 stage:{
  type:String,
  required:true,
  enum:['2' , '3']
 }
})


userSchema.plugin(passportLocalMongoose.default);

module.exports=mongoose.model('User' , userSchema);